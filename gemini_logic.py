
import os
import json
import re
import asyncio
from typing import List, Dict, Optional
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

class GeminiLogic:
    def __init__(self):
        # Try multiple common env variable names for flexibility
        self.api_key = os.getenv("API_KEY") or os.getenv("GOOGLE_API_KEY")
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            print("Gemini AI: API Key configured successfully.")
        else:
            print("WARNING: No Gemini API Key found in .env file (looked for API_KEY or GOOGLE_API_KEY)")
            
        self.model_name = "gemini-3-flash-preview"

    def _clean_json(self, text: str) -> str:
        """Removes markdown code blocks and non-JSON garbage."""
        if not text:
            return "[]"
        text = re.sub(r'```json\s*', '', text)
        text = re.sub(r'\s*```', '', text)
        # Find the first '[' or '{' and last ']' or '}'
        start_idx = min(text.find('['), text.find('{')) if ('[' in text or '{' in text) else -1
        end_idx = max(text.rfind(']'), text.rfind('}')) if (']' in text or '}' in text) else -1
        
        if start_idx != -1 and end_idx != -1:
            return text[start_idx:end_idx+1].strip()
        return text.strip()

    async def extract_skills_via_ai(self, text: str, context_type: str) -> List[str]:
        if not text.strip(): return []
        if not self.api_key: return []
        
        model = genai.GenerativeModel(self.model_name)
        prompt = (
            f"Extract the top 10 technical/professional skills from this {context_type}. "
            f"Return ONLY a JSON array of strings. Text: {text[:2500]}"
        )
        try:
            # Ensure key is configured for the current session/thread
            genai.configure(api_key=self.api_key)
            response = await asyncio.wait_for(model.generate_content_async(
                prompt,
                generation_config={"response_mime_type": "application/json", "temperature": 0.0}
            ), timeout=15.0)
            
            cleaned = self._clean_json(response.text)
            data = json.loads(cleaned)
            return [str(s) for s in data if s][:10]
        except Exception as e:
            print(f"Skill Extraction Error: {e}")
            return []

    async def extract_job_title(self, text: str) -> str:
        if not text.strip() or not self.api_key: return "Role"
        model = genai.GenerativeModel(self.model_name)
        prompt = f"Identify the Job Title from this text. Output only the title string: {text[:500]}"
        try:
            genai.configure(api_key=self.api_key)
            response = await asyncio.wait_for(model.generate_content_async(prompt), timeout=10.0)
            return response.text.strip().replace('"', '')
        except:
            return "Professional"

    async def get_grounded_explanation(self, score: float, matched: List[str], gaps: List[str], job_title: str) -> str:
        if not self.api_key: return f"Analysis match score: {score}%"
        model = genai.GenerativeModel(self.model_name)
        prompt = (
            f"Write a 1-sentence assessment for a {job_title} candidate. Match: {score}%. "
            f"Matches: {', '.join(matched[:3])}. Gaps: {', '.join(gaps[:3])}."
        )
        try:
            genai.configure(api_key=self.api_key)
            response = await asyncio.wait_for(model.generate_content_async(prompt), timeout=10.0)
            return response.text.strip()
        except:
            return f"Match completed for {job_title}."

    async def generate_adaptive_quiz(self, matched: List[str], gaps: List[str], job_description: Optional[str] = None) -> List[Dict]:
        if not self.api_key: return []
        model = genai.GenerativeModel(self.model_name)
        context = job_description[:3000] if job_description else f"Required Skills: {matched} {gaps}"
        prompt = (
            f"You are a technical interviewer. Create EXACTLY 10 multiple-choice questions for this specific role. "
            f"Context: {context}\n"
            "Include questions covering: " + ", ".join(matched[:5] + gaps[:5]) + ". "
            "Return ONLY a JSON array of objects: {id, skill, question, options(4), correctIndex(0-3), explanation}."
        )
        try:
            genai.configure(api_key=self.api_key)
            response = await asyncio.wait_for(model.generate_content_async(
                prompt,
                generation_config={"response_mime_type": "application/json", "temperature": 0.2}
            ), timeout=30.0)
            
            cleaned = self._clean_json(response.text)
            quiz = json.loads(cleaned)
            return quiz[:10]
        except Exception as e:
            print(f"Quiz Generation Error: {e}")
            return []

    async def recommend_courses(self, gaps: List[str], current_skills: List[str]) -> List[Dict]:
        if not self.api_key: return []
        model = genai.GenerativeModel(self.model_name)
        prompt = f"Top 3 course objects for these skill gaps: {gaps[:5]}. JSON: id, title, platform, description, skill, duration, isFree, url."
        try:
            genai.configure(api_key=self.api_key)
            response = await asyncio.wait_for(model.generate_content_async(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            ), timeout=15.0)
            
            cleaned = self._clean_json(response.text)
            return json.loads(cleaned)
        except Exception as e:
            print(f"Course Recommendation Error: {e}")
            return []

gemini_ai = GeminiLogic()
