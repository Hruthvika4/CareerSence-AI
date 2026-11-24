
export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface SkillAnalysis {
  matchScore: number;
  resumeSkills: string[];
  jobSkills: string[];
  matchedSkills: string[];
  skillGaps: string[];
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  skill: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Course {
  id: string;
  title: string;
  platform: string;
  description: string;
  skill: string;
  duration: string;
  isFree: boolean;
  url: string;
}

export interface AppState {
  user: User | null;
  resumeText: string;
  jobText: string;
  analysis: SkillAnalysis | null;
  quiz: QuizQuestion[];
  quizAnswers: Record<number, number>;
  completedCourses: string[];
}
