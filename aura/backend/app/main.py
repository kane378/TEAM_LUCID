from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

from app.core.config import settings
from app.routers import resume, evaluate, plan, quiz, interview, jobs, progress

app = FastAPI(title="Vidyamitra API", version="0.1.0")

# ✅ CORS FIX (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 allow all (fixes Vercel connection)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ROUTERS
app.include_router(resume.router,    prefix="/resume",    tags=["resume"])
app.include_router(evaluate.router,  prefix="/evaluate",  tags=["evaluate"])
app.include_router(plan.router,      prefix="/plan",      tags=["plan"])
app.include_router(quiz.router,      prefix="/quiz",      tags=["quiz"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])
app.include_router(jobs.router,      prefix="/jobs",      tags=["jobs"])
app.include_router(progress.router,  prefix="/progress",  tags=["progress"])

# ✅ ROOT API
@app.get("/")
def root() -> dict:
    return {"name": "Vidyamitra API", "status": "ok"}