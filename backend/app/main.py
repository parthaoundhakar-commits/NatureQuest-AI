from fastapi import FastAPI
from pydantic import BaseModel

from app.services.ai.quest_provider import LocalQuestProvider
from app.services.progress import ProgressService

app = FastAPI(title="NatureQuest AI", version="0.1.0")
provider = LocalQuestProvider(model_name="llama3.1:8b")
progress_service = ProgressService()


class QuestRequest(BaseModel):
    time: str
    difficulty: str
    interest: str
    environment: str
    age_group: str
    accessibility: str
    group_mode: str


@app.get("/api/health")
def health_check() -> dict:
    return {"status": "ok", "service": "naturequest-ai", "version": app.version}


@app.get("/api/ai/status")
def ai_status() -> dict:
    return {
        "provider": "ollama-compatible",
        "model_name": provider.model_name,
        "status": "ready",
        "source": "local",
    }


@app.post("/api/quests/generate")
def generate_quest(payload: QuestRequest) -> dict:
    quest = provider.generate_quest(
        time_minutes=int(payload.time),
        difficulty=payload.difficulty,
        interest=payload.interest,
        environment=payload.environment,
        age_group=payload.age_group,
        accessibility=payload.accessibility,
        group_mode=payload.group_mode,
    )
    return {
        "title": quest["title"],
        "description": quest["description"],
        "learning_objective": quest["learning_objective"],
        "estimated_duration": quest["estimated_duration"],
        "difficulty": quest["difficulty"],
        "completion_criteria": quest["completion_criteria"],
        "safety_guidance": quest["safety_guidance"],
        "education": quest["education"],
        "eco_xp": quest["eco_xp"],
        "source": quest["source"],
    }


@app.get("/api/progress")
def get_progress() -> dict:
    return {"xp": progress_service.total_xp(), "badges": progress_service.badges()}


@app.post("/api/progress/award")
def award_progress(mission_id: str, points: int = 25) -> dict:
    granted = progress_service.award_xp(mission_id, points)
    return {"mission_id": mission_id, "awarded": granted, "xp_total": progress_service.total_xp()}
