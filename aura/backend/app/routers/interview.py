from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.ai_service import generate_interview_question, evaluate_interview_answer

router = APIRouter()

INTERVIEW_QUESTIONS = {
    "technical": [
        "Tell me about a technical challenge you faced and how you overcame it.",
        "Describe your experience with system design. Can you give an example of a system you architected?",
        "How do you approach debugging a complex issue in production?",
        "Explain the difference between synchronous and asynchronous programming.",
        "What design patterns have you used in your projects?",
    ],
    "managerial": [
        "Describe a time you led a team through a difficult project.",
        "How do you prioritize tasks when everything seems urgent?",
        "Tell me about a conflict you resolved within your team.",
        "How do you ensure project deadlines are met?",
    ],
    "hr": [
        "Tell me about yourself and your career journey.",
        "Why do you want to work for our company?",
        "Where do you see yourself in 5 years?",
        "What are your greatest strengths and weaknesses?",
    ],
}

class InterviewStartRequest(BaseModel):
    job_role: str
    round: str = "technical"

class InterviewAnswerRequest(BaseModel):
    job_role: str
    round: str
    question: str
    answer: str
    question_number: int

class QuestionResponse(BaseModel):
    question: str
    round: str
    question_number: int
    total_questions: int

class FeedbackResponse(BaseModel):
    score: int
    feedback: str
    next_question: Optional[str]
    round_complete: bool

@router.post("/start", response_model=QuestionResponse)
async def start_interview(data: InterviewStartRequest):
    questions = INTERVIEW_QUESTIONS.get(data.round, INTERVIEW_QUESTIONS["technical"])
    return QuestionResponse(
        question=questions[0],
        round=data.round,
        question_number=1,
        total_questions=len(questions),
    )

@router.post("/answer", response_model=FeedbackResponse)
async def answer_question(data: InterviewAnswerRequest):
    questions = INTERVIEW_QUESTIONS.get(data.round, INTERVIEW_QUESTIONS["technical"])
    word_count = len(data.answer.split())
    score = min(100, max(5, word_count * 2 + 20))

    if word_count < 10:
        feedback = "Your answer was too brief. Try to elaborate more with specific examples and details."
    elif word_count < 30:
        feedback = "Good start! Add more context and concrete examples from your experience to strengthen your answer."
    else:
        feedback = f"Well-structured answer! You demonstrated good understanding. For {data.job_role} roles, keep focusing on measurable outcomes and technical depth."

    next_q_idx = data.question_number
    round_complete = next_q_idx >= len(questions)
    next_question = questions[next_q_idx] if not round_complete else None

    return FeedbackResponse(
        score=score,
        feedback=feedback,
        next_question=next_question,
        round_complete=round_complete,
    )

@router.get("/rounds")
async def get_rounds():
    return {
        "rounds": [
            {"id": "technical", "name": "Technical Round", "questions": 5, "pass_score": 60},
            {"id": "managerial", "name": "Managerial Round", "questions": 4, "pass_score": 60},
            {"id": "hr", "name": "HR Round", "questions": 4, "pass_score": 60},
        ]
    }
