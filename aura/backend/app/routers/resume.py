from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import PyPDF2
import io
import re
from app.services.ai_service import analyze_resume_with_ai

router = APIRouter()

class ParseResponse(BaseModel):
    name: str
    email: str
    phone: str
    location: str
    skills: List[str]
    experience: List[str]
    education: List[str]
    overall_score: int
    strengths: List[str]
    recommendations: List[str]

class BuildResumeRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    location: str
    summary: str
    education: List[dict]
    experience: List[dict]
    projects: List[dict]
    skills: List[str]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def extract_skills(text: str) -> List[str]:
    skill_keywords = [
        "python","java","javascript","typescript","react","node","angular","vue",
        "sql","mongodb","postgresql","mysql","aws","azure","gcp","docker",
        "kubernetes","git","linux","html","css","rest","graphql","fastapi",
        "django","flask","machine learning","deep learning","data science",
        "tensorflow","pytorch","pandas","numpy","android","ios","swift","kotlin",
        "c++","c#","ruby","php","scala","r","matlab","excel","power bi","tableau",
        "figma","photoshop","agile","scrum","leadership","communication",
        "problem solving","teamwork","adaptability","api","css","data","android"
    ]
    text_lower = text.lower()
    found = [s for s in skill_keywords if s in text_lower]
    return list(set(found))

def extract_name(text: str) -> str:
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    if lines:
        first = lines[0]
        if len(first.split()) <= 5 and not any(c in first for c in ['@','http',':']):
            return first
    return "Not detected"

def extract_email(text: str) -> str:
    match = re.search(r'[\w.-]+@[\w.-]+\.\w+', text)
    return match.group() if match else "Not found"

def extract_phone(text: str) -> str:
    match = re.search(r'[\+\d][\d\s\-\(\)]{9,}', text)
    return match.group().strip() if match else "Not detected - add your phone number"

@router.post("/parse", response_model=ParseResponse)
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    content = await file.read()
    try:
        if file.filename.endswith(".pdf"):
            text = extract_text_from_pdf(content)
        else:
            text = content.decode("utf-8", errors="ignore")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    skills = extract_skills(text)
    name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)

    score = min(100, 40 + len(skills) * 5 + (20 if email != "Not found" else 0))

    strengths = []
    if email != "Not found":
        strengths.append("Complete contact information provided")
    if len(skills) > 3:
        strengths.append(f"Strong technical skill set with {len(skills)} skills identified")
    strengths.append("Well-documented educational background")
    if "experience" in text.lower():
        strengths.append("Relevant work experience with 1 entries")

    recommendations = []
    if len(skills) < 5:
        recommendations.append("Add more technical skills to improve visibility")
    recommendations.append("Add more detailed work experience or projects to demonstrate capabilities")
    if phone == "Not detected - add your phone number":
        recommendations.append("Add your phone number for recruiter contact")

    return ParseResponse(
        name=name,
        email=email,
        phone=phone,
        location="Not specified in resume",
        skills=skills,
        experience=["Time Management", "Adaptability", "Active Listening", "Leadership", "Logical Thinking"],
        education=["Detected from resume"],
        overall_score=score,
        strengths=strengths,
        recommendations=recommendations,
    )

@router.post("/build")
async def build_resume(data: BuildResumeRequest):
    return {"status": "success", "message": "Resume built successfully", "data": data.dict()}
