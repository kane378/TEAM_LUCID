from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.services.ai_service import generate_quiz_questions

router = APIRouter()

class QuizRequest(BaseModel):
    domain: str
    difficulty: str = "Easy"
    count: int = 5

class Question(BaseModel):
    id: int
    question: str
    options: List[str]
    correct: str
    explanation: str

class QuizResponse(BaseModel):
    domain: str
    difficulty: str
    questions: List[Question]

class SubmitRequest(BaseModel):
    domain: str
    difficulty: str
    answers: Dict[str, str]
    questions: List[dict]

class SubmitResponse(BaseModel):
    score: int
    total: int
    percentage: float
    results: List[dict]

QUESTION_BANK = {
    "javascript_Easy": [
        {"question": "What is the correct syntax for a for loop?", "options": ["for (i=0; i<10; i++)", "for (i=0; i<10; i++)", "foreach (i in 10)", "loop (i=0; i<10)"], "correct": "for (i=0; i<10; i++)", "explanation": "JavaScript for loop: for (initialization; condition; increment)."},
        {"question": "Which method adds an item to the end of an array?", "options": ["append()", "push()", "add()", "insert()"], "correct": "push()", "explanation": "push() adds elements to the end of an array and returns the new length."},
        {"question": "How do you declare a variable in JavaScript?", "options": ["variable x", "v x", "variable", "var, let, const"], "correct": "var, let, const", "explanation": "JavaScript has three keywords for declaring variables: var, let, and const."},
        {"question": "How do you create an object in JavaScript?", "options": ["{}", "Object()", "new Object()", "All are correct"], "correct": "All are correct", "explanation": "All three methods create objects: {}, Object(), and new Object()."},
        {"question": "What is undefined in JavaScript?", "options": ["Syntax error", "Variable declared but not assigned", "Keyword", "Type of null"], "correct": "Variable declared but not assigned", "explanation": "undefined is the value of variables declared but not initialized."},
    ],
    "python_Easy": [
        {"question": "How do you print in Python?", "options": ["console.log()", "print()", "echo()", "write()"], "correct": "print()", "explanation": "Python uses print() function to output text."},
        {"question": "Which keyword defines a function in Python?", "options": ["function", "def", "func", "define"], "correct": "def", "explanation": "Python uses 'def' keyword to define functions."},
        {"question": "What is a list in Python?", "options": ["Immutable sequence", "Mutable ordered collection", "Key-value pairs", "Unordered set"], "correct": "Mutable ordered collection", "explanation": "Python lists are mutable, ordered collections of items."},
        {"question": "How do you create a comment in Python?", "options": ["//", "/*", "#", "--"], "correct": "#", "explanation": "Python uses # for single-line comments."},
        {"question": "What does len() return?", "options": ["Last element", "Length of object", "Type of object", "None"], "correct": "Length of object", "explanation": "len() returns the number of items in an object."},
    ],
    "react_Easy": [
        {"question": "What hook manages state in React?", "options": ["useEffect", "useState", "useRef", "useMemo"], "correct": "useState", "explanation": "useState is the primary hook for managing component state."},
        {"question": "What is JSX?", "options": ["JavaScript XML", "Java Syntax Extension", "JSON Extension", "None"], "correct": "JavaScript XML", "explanation": "JSX is a syntax extension that allows writing HTML-like code in JavaScript."},
        {"question": "How do you pass data to a child component?", "options": ["State", "Props", "Context", "Redux"], "correct": "Props", "explanation": "Props (properties) are used to pass data from parent to child components."},
        {"question": "Which hook runs after render?", "options": ["useState", "useRef", "useEffect", "useCallback"], "correct": "useEffect", "explanation": "useEffect runs after every render by default."},
        {"question": "What is a React component?", "options": ["A CSS class", "A reusable UI piece", "A database model", "An API endpoint"], "correct": "A reusable UI piece", "explanation": "React components are reusable, independent pieces of UI."},
    ],
}

def get_questions(domain: str, difficulty: str, count: int) -> List[Question]:
    key = f"{domain.lower()}_{difficulty}"
    bank = QUESTION_BANK.get(key, QUESTION_BANK.get("javascript_Easy", []))
    selected = bank[:count]
    return [Question(id=i+1, **q) for i, q in enumerate(selected)]

@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(data: QuizRequest):
    questions = get_questions(data.domain, data.difficulty, data.count)
    return QuizResponse(domain=data.domain, difficulty=data.difficulty, questions=questions)

@router.post("/submit", response_model=SubmitResponse)
async def submit_quiz(data: SubmitRequest):
    results = []
    correct_count = 0
    for q in data.questions:
        qid = str(q["id"])
        user_ans = data.answers.get(qid, "")
        is_correct = user_ans == q["correct"]
        if is_correct:
            correct_count += 1
        results.append({
            "id": q["id"],
            "question": q["question"],
            "user_answer": user_ans,
            "correct_answer": q["correct"],
            "is_correct": is_correct,
            "explanation": q.get("explanation", ""),
        })
    total = len(data.questions)
    percentage = (correct_count / total * 100) if total else 0
    return SubmitResponse(score=correct_count, total=total, percentage=round(percentage), results=results)
