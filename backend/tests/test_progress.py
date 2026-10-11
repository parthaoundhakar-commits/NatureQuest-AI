from app.services.progress import ProgressService


def test_xp_credit_is_idempotent():
    service = ProgressService()
    service.award_xp("mission-1", 25)
    service.award_xp("mission-1", 25)
    assert service.total_xp() == 25


def test_badge_unlocks_for_streak():
    service = ProgressService()
    for _ in range(7):
        service.award_xp("mission-test-1", 10)
    assert service.badges() == ["Seven-Day Explorer"]
