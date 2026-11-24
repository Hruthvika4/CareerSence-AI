
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime = datetime.utcnow()

class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    job_text: str

class SkillAnalysisResponse(BaseModel):
    matchScore: float
    resumeSkills: List[str]
    jobSkills: List[str]
    matchedSkills: List[str]
    skillGaps: List[str]
    explanation: str

class QuizQuestionModel(BaseModel):
    id: int
    skill: str
    question: str
    options: List[str]
    correctIndex: int
    explanation: str

class CourseRecommendation(BaseModel):
    id: str
    title: str
    platform: str
    description: str
    skill: str
    duration: str
    isFree: bool
    url: str

class Token(BaseModel):
    access_token: str
    token_type: str
