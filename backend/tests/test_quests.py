from app.services.ai.quest_provider import LocalQuestProvider


def test_local_quest_provider_uses_fallback_for_empty_model():
    provider = LocalQuestProvider(model_name="")
    quest = provider.generate_quest(
        time_minutes=20,
        difficulty="beginner",
        interest="plants",
        environment="park",
        age_group="adult",
        accessibility="easy_access",
        group_mode="solo",
    )
    assert quest["title"]
    assert quest["estimated_duration"] == 20
    assert quest["source"] in {"local_fallback", "local_ai"}


def test_local_quest_provider_validates_schema():
    provider = LocalQuestProvider(model_name="test-model")
    quest = provider.generate_quest(
        time_minutes=10,
        difficulty="intermediate",
        interest="birds",
        environment="forest",
        age_group="teen",
        accessibility="step_free",
        group_mode="group",
    )
    required = {
        "title",
        "description",
        "learning_objective",
        "estimated_duration",
        "difficulty",
        "completion_criteria",
        "safety_guidance",
        "education",
        "eco_xp",
        "source",
    }
    assert required.issubset(quest.keys())
