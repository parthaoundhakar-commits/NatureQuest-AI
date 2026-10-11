from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["service"] == "naturequest-ai"


def test_quest_endpoint_returns_valid_schema():
    response = client.post(
        "/api/quests/generate",
        json={
            "time": "20",
            "difficulty": "beginner",
            "interest": "plants",
            "environment": "park",
            "age_group": "adult",
            "accessibility": "easy_access",
            "group_mode": "solo",
        },
    )
    assert response.status_code == 200
    quest = response.json()
    assert quest["title"]
    assert quest["description"]
    assert quest["difficulty"] == "beginner"
    assert quest["estimated_duration"] == 20
    assert quest["eco_xp"] > 0
