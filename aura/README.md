# AURA — AI Career Agent

AI-Powered Resume Evaluator, Trainer & Career Planner

## Quick Start

### Terminal 1 — Backend
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate
pip install -r requirements.txt
copy .env.example .env   # then fill in your API keys
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload --app-dir .
```

### Terminal 2 — Frontend
```powershell
cd web
npm install
npm run dev
```

### URLs
- Frontend: http://localhost:5173
- API Docs: http://127.0.0.1:8000/docs

## Features
- Resume Upload & Analysis
- Resume Builder (6-step form)
- Domain & Job Role Selection
- Skill Gap / Eligibility Check
- 4-Week Personalized Learning Plan
- AI Quiz (MCQ with scoring)
- Mock Interview (Text + Voice mode)
- Job Opportunities (Naukri / LinkedIn)
- Learning Progress Dashboard
