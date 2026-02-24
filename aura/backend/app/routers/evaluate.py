from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

JOB_SKILLS = {
    "Software Engineer": ["javascript", "python", "react", "node.js", "sql", "git"],
    "Data Scientist": ["python", "r", "machine learning", "sql", "tensorflow", "pandas"],
    "DevOps Engineer": ["aws", "docker", "kubernetes", "linux", "ci/cd", "git"],
    "Product Manager": ["agile", "user research", "analytics", "scrum", "roadmapping", "jira"],
    "Frontend Developer": ["react", "typescript", "html", "css", "javascript", "figma"],
    "Backend Developer": ["python", "java", "sql", "rest api", "docker", "linux"],
    "Full Stack Engineer": ["react", "node.js", "python", "sql", "docker", "git"],
    "AI Developer": ["python", "tensorflow", "pytorch", "machine learning", "nlp", "openai"],
    "Financial Analyst": ["excel", "sql", "python", "power bi", "financial modeling", "tableau"],
    "Data Engineer": ["python", "sql", "spark", "aws", "airflow", "kafka"],
}

class EvaluateRequest(BaseModel):
    job_role: str
    user_skills: List[str]

class EvaluateResponse(BaseModel):
    job_role: str
    match_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]
    eligible: bool

@router.post("/check", response_model=EvaluateResponse)
async def check_eligibility(data: EvaluateRequest):
    required = JOB_SKILLS.get(data.job_role, [])
    if not required:
        required = ["communication", "problem solving", "teamwork"]

    user_lower = [s.lower() for s in data.user_skills]
    matched = [s for s in required if any(s in u or u in s for u in user_lower)]
    missing = [s for s in required if s not in matched]
    score = int((len(matched) / len(required)) * 100) if required else 0

    recs = []
    if missing:
        recs.append(f"Learn these key skills: {', '.join(missing[:3])}")
    recs.append("Complete online courses to improve skills alignment")
    recs.append("Practice with mock interviews to boost confidence")
    recs.append("Build projects showcasing the required skills")

    return EvaluateResponse(
        job_role=data.job_role,
        match_score=score,
        matched_skills=matched,
        missing_skills=missing,
        recommendations=recs,
        eligible=score >= 50,
    )

@router.get("/roles")
async def get_roles():
    return {"roles": list(JOB_SKILLS.keys())}
