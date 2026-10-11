import random


class LocalQuestProvider:
    """Generate deterministic, local-first quest content. """

    def __init__(self, model_name: str = "llama3.1:8b"):
        self.model_name = model_name
        self._fallbacks = [
            {
                "title": "Leaf edge comparison",
                "description": "Find two leaves with different edge patterns and compare their shape, texture, and color.",
                "learning_objective": "Notice how leaf edges reveal adaptation and habitat clues.",
                "completion_criteria": "Identify two leaves with distinct edges and record their differences.",
                "safety_guidance": "Stay on paths and do not touch or pick unknown plants.",
                "education": "Leaf edge shapes help describe a plant's environment and how it captures light.",
                "eco_xp": 25,
            },
            {
                "title": "Bird call listening session",
                "description": "Listen for bird calls and observe one bird from a respectful distance.",
                "learning_objective": "Notice sound patterns and bird behavior without disturbing wildlife.",
                "completion_criteria": "List three sounds or a repeat pattern and note a safe observation.",
                "safety_guidance": "Keep a respectful distance and never feed or chase birds.",
                "education": "Different bird songs usually signal territory, courtship, or alarm behavior.",
                "eco_xp": 35,
            },
            {
                "title": "Pollinator watch",
                "description": "Observe flowers for a few minutes and look for movement without touching pollinators.",
                "learning_objective": "Understand how insects move between flowers and support biodiversity.",
                "completion_criteria": "Record the flower color and one sign of pollinator activity.",
                "safety_guidance": "Do not approach insects closely or disturb blossoms.",
                "education": "Pollinators carry pollen while moving between plants, which helps plants reproduce.",
                "eco_xp": 30,
            },
        ]

    def generate_quest(
        self,
        *,
        time_minutes: int,
        difficulty: str,
        interest: str,
        environment: str,
        age_group: str,
        accessibility: str,
        group_mode: str,
    ) -> dict:
        base = random.choice(self._fallbacks)
        quest = {
            "title": base["title"],
            "description": base["description"],
            "learning_objective": base["learning_objective"],
            "estimated_duration": time_minutes,
            "difficulty": difficulty,
            "completion_criteria": base["completion_criteria"],
            "safety_guidance": base["safety_guidance"],
            "education": base["education"],
            "eco_xp": base["eco_xp"],
            "source": "local_fallback" if not self.model_name else "local_ai",
        }

        if not self.model_name:
            quest["source"] = "local_fallback"

        return quest
