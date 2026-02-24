from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.ai_service import generate_training_plan
from app.services.youtube_service import fetch_youtube_video

router = APIRouter()

class PlanRequest(BaseModel):
    job_role: str
    missing_skills: List[str]
    user_skills: List[str]
    username: Optional[str] = "User"

class WeekPlan(BaseModel):
    week: int
    skill: str
    description: str
    tasks: List[str]
    video_title: str
    video_url: str
    video_channel: str
    learning_outcomes: List[str]

class PlanResponse(BaseModel):
    job_role: str
    duration: str
    weeks: List[WeekPlan]

WEEK_TASKS = [
    "Study {skill} fundamentals through interactive tutorials and documentation",
    "Complete 5-7 beginner-level {skill} coding exercises on platforms like LeetCode/HackerRank",
    "Build a simple starter project implementing {skill} concepts",
    "Document your learning journey, challenges faced, and solutions found",
    "Watch at least 3 comprehensive video tutorials on {skill}",
]

LEARNING_OUTCOMES = {
    "javascript": ["Understand core JavaScript concepts and principles","Implement JavaScript in practical projects","Master JavaScript best practices for Software Engineer","Build confidence to use JavaScript in real-world scenarios"],
    "react": ["Build dynamic UIs with React components","Manage state effectively using hooks","Integrate APIs in React apps","Deploy production-ready React applications"],
    "python": ["Write clean Python scripts","Use Python for automation and data tasks","Understand OOP in Python","Apply Python to real-world backend problems"],
    "node.js": ["Build REST APIs with Node.js","Handle async programming","Work with Express framework","Connect Node.js to databases"],
    "sql": ["Write complex SQL queries","Design normalized databases","Optimize query performance","Use SQL for data analysis"],
    "default": ["Understand core concepts and principles","Implement in practical projects","Master best practices","Build confidence to use in real-world scenarios"],
}

VIDEO_DATA = {
    "javascript": ("JavaScript Tutorial Full Course - Beginner to Pro", "https://www.youtube.com/results?search_query=javascript+full+course", "SuperSimpleDev"),
    "react": ("React Full Course for Beginners", "https://www.youtube.com/results?search_query=react+full+course", "freeCodeCamp"),
    "python": ("Python Full Course for Beginners [2025]", "https://www.youtube.com/results?search_query=python+full+course+2025", "Programming with Mosh"),
    "node.js": ("Node.js Ultimate Beginner's Guide in 7 Easy Steps", "https://www.youtube.com/results?search_query=nodejs+beginner+guide", "Fireship"),
    "sql": ("SQL Tutorial - Full Database Course for Beginners", "https://www.youtube.com/results?search_query=sql+full+course", "freeCodeCamp"),
    "machine learning": ("Machine Learning Course - Full Tutorial", "https://www.youtube.com/results?search_query=machine+learning+full+course", "freeCodeCamp"),
    "docker": ("Docker Tutorial for Beginners", "https://www.youtube.com/results?search_query=docker+tutorial+beginners", "TechWorld with Nana"),
    "aws": ("AWS Tutorial For Beginners", "https://www.youtube.com/results?search_query=aws+tutorial+beginners", "Simplilearn"),
    "typescript": ("TypeScript Full Course for Beginners", "https://www.youtube.com/results?search_query=typescript+full+course", "Dave Gray"),
    "default": ("Full Course - Beginner to Advanced", "https://www.youtube.com/results?search_query=programming+full+course", "freeCodeCamp"),
}

@router.post("/generate", response_model=PlanResponse)
async def generate_plan(data: PlanRequest):
    skills_to_learn = data.missing_skills[:4] if data.missing_skills else ["communication", "problem solving"]

    weeks = []
    for i, skill in enumerate(skills_to_learn, 1):
        skill_lower = skill.lower()
        video = VIDEO_DATA.get(skill_lower, VIDEO_DATA["default"])
        outcomes = LEARNING_OUTCOMES.get(skill_lower, [o.replace("{skill}", skill) for o in LEARNING_OUTCOMES["default"]])
        tasks = [t.format(skill=skill) for t in WEEK_TASKS]

        weeks.append(WeekPlan(
            week=i,
            skill=skill,
            description=f"Master {skill} to excel as a {data.job_role}. This week focuses on beginner-level concepts essential for your target role.",
            tasks=tasks,
            video_title=video[0],
            video_url=video[1],
            video_channel=video[2],
            learning_outcomes=outcomes,
        ))

    return PlanResponse(
        job_role=data.job_role,
        duration=f"{len(weeks)}-Week Learning Journey",
        weeks=weeks,
    )
