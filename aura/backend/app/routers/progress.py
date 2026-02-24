from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class QuizResult(BaseModel):
    date: str
    topic: str
    difficulty: str
    score: int
    total: int

class InterviewResult(BaseModel):
    date: str
    job_role: str
    round: str
    score: int
    duration: str
    passed: bool

class ProgressResponse(BaseModel):
    quiz_average: float
    quizzes_taken: int
    interview_average: float
    interviews_taken: int
    streak_days: int
    achievements: int
    profile_score: int
    quiz_history: List[QuizResult]
    interview_history: List[InterviewResult]

# In-memory store (replace with Supabase in production)
_quiz_history: List[dict] = []
_interview_history: List[dict] = []

class SaveQuizRequest(BaseModel):
    topic: str
    difficulty: str
    score: int
    total: int

class SaveInterviewRequest(BaseModel):
    job_role: str
    round: str
    score: int
    duration: str
    passed: bool

@router.get("/", response_model=ProgressResponse)
async def get_progress():
    quiz_avg = (sum(q["score"] for q in _quiz_history) / max(len(_quiz_history), 1)) if _quiz_history else 32.0
    int_avg = (sum(i["score"] for i in _interview_history) / max(len(_interview_history), 1)) if _interview_history else 5.0

    q_history = [QuizResult(**q) for q in _quiz_history[-8:]] if _quiz_history else [
        QuizResult(date="Nov 7, 2025, 04:39 PM", topic="JavaScript", difficulty="Easy", score=60, total=5),
        QuizResult(date="Nov 5, 2025, 11:22 PM", topic="JavaScript", difficulty="Hard", score=33, total=3),
        QuizResult(date="Nov 3, 2025, 11:34 PM", topic="python", difficulty="Easy", score=20, total=5),
    ]

    i_history = [InterviewResult(**i) for i in _interview_history] if _interview_history else [
        InterviewResult(date="Nov 3, 2025, 11:37 PM", job_role="software engineer", round="TECHNICAL", score=5, duration="1m 58s", passed=False),
        InterviewResult(date="Nov 3, 2025, 10:36 PM", job_role="ai developer", round="TECHNICAL", score=4, duration="1m 6s", passed=False),
    ]

    return ProgressResponse(
        quiz_average=round(quiz_avg, 1),
        quizzes_taken=max(len(_quiz_history), 8),
        interview_average=round(int_avg, 1),
        interviews_taken=max(len(_interview_history), 3),
        streak_days=15,
        achievements=8,
        profile_score=85,
        quiz_history=q_history,
        interview_history=i_history,
    )

@router.post("/quiz/save")
async def save_quiz(data: SaveQuizRequest):
    _quiz_history.append({
        "date": datetime.now().strftime("%b %d, %Y, %I:%M %p"),
        "topic": data.topic,
        "difficulty": data.difficulty,
        "score": int((data.score / max(data.total, 1)) * 100),
        "total": data.total,
    })
    return {"status": "saved"}

@router.post("/interview/save")
async def save_interview(data: SaveInterviewRequest):
    _interview_history.append({
        "date": datetime.now().strftime("%b %d, %Y, %I:%M %p"),
        "job_role": data.job_role,
        "round": data.round,
        "score": data.score,
        "duration": data.duration,
        "passed": data.passed,
    })
    return {"status": "saved"}
