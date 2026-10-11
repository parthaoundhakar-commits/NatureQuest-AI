class ProgressService:
    def __init__(self):
        self._awarded: set[str] = set()
        self._xp_by_mission: dict[str, int] = {}
        self._streak_count = 0

    def award_xp(self, mission_id: str, points: int) -> int:
        self._streak_count += 1
        if mission_id in self._awarded:
            return self._xp_by_mission.get(mission_id, 0)
        self._awarded.add(mission_id)
        self._xp_by_mission[mission_id] = points
        return points

    def total_xp(self) -> int:
        return sum(self._xp_by_mission.values())

    def badges(self) -> list[str]:
        badges: list[str] = []
        if self._streak_count >= 7:
            return ["Seven-Day Explorer"]
        if self.total_xp() > 0:
            badges.append("First Adventure")
        if self.total_xp() >= 25:
            badges.append("Leaf Detective")
        if self.total_xp() >= 50:
            badges.append("Bird Observer")
        return badges
