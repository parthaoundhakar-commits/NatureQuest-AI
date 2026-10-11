from typing import Protocol


class QuestGenerator(Protocol):
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
        ...
