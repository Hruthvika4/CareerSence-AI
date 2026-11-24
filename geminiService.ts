
import { GoogleGenAI, Type } from "@google/genai";
import { SkillAnalysis, QuizQuestion, Course } from "./types";

const API_BASE_URL = window.location.hostname === 'localhost' ? "http://localhost:8000" : "";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeResumeAndJob = async (resume: string, job: string): Promise<SkillAnalysis> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_text: resume, job_text: job }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    if (response.ok) return await response.json();
    throw new Error("Backend error");
  } catch (err) {
    console.warn("Backend unavailable or timed out. Using browser Gemini fallback.");
    return fallbackAnalyze(resume, job);
  }
};

export const generateQuiz = async (matched: string[], gaps: string[], jobDescription?: string): Promise<QuizQuestion[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(`${API_BASE_URL}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matched, gaps, job_description: jobDescription }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (response.ok) return await response.json();
    throw new Error("Backend quiz error");
  } catch (err) {
    return fallbackGenerateQuiz(matched, gaps, jobDescription);
  }
};

export const recommendCourses = async (gaps: string[], current: string[]): Promise<Course[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gaps, current_skills: current })
    });
    if (response.ok) return await response.json();
    throw new Error("Backend courses error");
  } catch (err) {
    return fallbackRecommendCourses(gaps, current);
  }
};

const cleanJson = (text: string) => text.replace(/```json/g, "").replace(/```/g, "").trim();

const fallbackAnalyze = async (resume: string, job: string): Promise<SkillAnalysis> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Detailed analysis for:
    Resume: ${resume.substring(0, 2000)}
    Job: ${job.substring(0, 2000)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchScore: { type: Type.NUMBER },
          resumeSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          jobSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          skillGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING }
        },
        required: ["matchScore", "resumeSkills", "jobSkills", "matchedSkills", "skillGaps", "explanation"]
      }
    }
  });
  return JSON.parse(cleanJson(response.text || "{}")) as SkillAnalysis;
};

const fallbackGenerateQuiz = async (matched: string[], gaps: string[], jobDescription?: string): Promise<QuizQuestion[]> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `10 specific technical questions for: ${jobDescription?.substring(0, 2000) || (matched.join(",") + gaps.join(","))}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            skill: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "skill", "question", "options", "correctIndex", "explanation"]
        }
      }
    }
  });
  const quiz = JSON.parse(cleanJson(response.text || "[]")) as QuizQuestion[];
  return quiz.slice(0, 10);
};

const fallbackRecommendCourses = async (gaps: string[], current: string[]): Promise<Course[]> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `3 roadmap courses for: ${gaps.join(", ")}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            platform: { type: Type.STRING },
            description: { type: Type.STRING },
            skill: { type: Type.STRING },
            duration: { type: Type.STRING },
            isFree: { type: Type.BOOLEAN },
            url: { type: Type.STRING }
          },
          required: ["id", "title", "platform", "description", "skill", "duration", "isFree", "url"]
        }
      }
    }
  });
  return JSON.parse(cleanJson(response.text || "[]")) as Course[];
};
