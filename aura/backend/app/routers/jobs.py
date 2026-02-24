from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter()

class JobSearchRequest(BaseModel):
    skills: List[str]
    location: str = "Nationwide"
    job_type: str = "All Types"

class JobListing(BaseModel):
    id: str
    title: str
    company: str
    location: str
    type: str
    salary: str
    description: str
    skills_required: List[str]
    match_score: int
    platform: str
    apply_url: str
    status: str = "DEVELOPING"

class JobSearchResponse(BaseModel):
    total: int
    jobs: List[JobListing]

JOB_TEMPLATES = [
    {"title": "Python Tutor", "company": "CodeAcademy", "platform": "LinkedIn", "salary": "₹500/hr", "type": "Part-time", "skills": ["python", "teaching"]},
    {"title": "Full Stack Engineer", "company": "TechCorp", "platform": "Naukri", "salary": "₹15-25 LPA", "type": "Full-time", "skills": ["react", "node.js", "python"]},
    {"title": "Senior Backend Engineer", "company": "CloudSystems", "platform": "LinkedIn", "salary": "₹20-35 LPA", "type": "Full-time", "skills": ["python", "aws", "docker"]},
    {"title": "Frontend Developer", "company": "WebInnovate", "platform": "Naukri", "salary": "₹12-20 LPA", "type": "Full-time", "skills": ["react", "typescript", "css"]},
    {"title": "Frontend Consultant", "company": "Freelance Corp", "platform": "Naukri", "salary": "₹500/hr", "type": "Part-time", "skills": ["html", "css", "javascript"]},
    {"title": "Data Science Contractor", "company": "Analytics Co", "platform": "Naukri", "salary": "₹1000/hr", "type": "Part-time", "skills": ["python", "data", "machine learning"]},
    {"title": "Contract Python Developer", "company": "TempWork", "platform": "LinkedIn", "salary": "₹1000-1300/hr", "type": "Contract", "skills": ["python", "api", "django"]},
]

@router.post("/search", response_model=JobSearchResponse)
async def search_jobs(data: JobSearchRequest):
    user_skills_lower = [s.lower() for s in data.skills]
    results = []
    for i, job in enumerate(JOB_TEMPLATES):
        matched = [s for s in job["skills"] if any(s in u or u in s for u in user_skills_lower)]
        score = int((len(matched) / max(len(job["skills"]), 1)) * 100)
        loc = "Remote" if data.location == "Nationwide" else data.location
        apply_query = job["title"].replace(" ", "+")
        platform_url = f"https://www.naukri.com/jobs-in-india?searchQuery={apply_query}" if job["platform"] == "Naukri" else f"https://www.linkedin.com/jobs/search/?keywords={apply_query}"

        results.append(JobListing(
            id=str(i+1),
            title=job["title"],
            company=job["company"],
            location=loc,
            type=job["type"],
            salary=job["salary"],
            description=f"{job['title']} opportunity at {job['company']}. Build and develop using modern tech stack...",
            skills_required=job["skills"],
            match_score=score,
            platform=job["platform"],
            apply_url=platform_url,
            status="DEVELOPING",
        ))

    results.sort(key=lambda x: x.match_score, reverse=True)
    return JobSearchResponse(total=len(results), jobs=results)
