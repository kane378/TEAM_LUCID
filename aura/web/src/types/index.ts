export interface User {
  username: string
  firstName: string
  lastName: string
  email: string
}

export interface ResumeAnalysis {
  name: string
  email: string
  phone: string
  location: string
  skills: string[]
  experience: string[]
  education: string[]
  overall_score: number
  strengths: string[]
  recommendations: string[]
}

export interface JobRole {
  title: string
  demand: string
  desc: string
  exp: string
  salary: string
  skills: string[]
}

export interface EligibilityResult {
  job_role: string
  match_score: number
  matched_skills: string[]
  missing_skills: string[]
  recommendations: string[]
  eligible: boolean
}

export interface WeekPlan {
  week: number
  skill: string
  description: string
  tasks: string[]
  video_title: string
  video_url: string
  video_channel: string
  learning_outcomes: string[]
}

export interface PlanResult {
  job_role: string
  duration: string
  weeks: WeekPlan[]
}

export interface Question {
  id: number
  question: string
  options: string[]
  correct: string
  explanation: string
}

export interface QuizResult {
  score: number
  total: number
  percentage: number
  results: {
    id: number
    question: string
    user_answer: string
    correct_answer: string
    is_correct: boolean
    explanation: string
  }[]
}
