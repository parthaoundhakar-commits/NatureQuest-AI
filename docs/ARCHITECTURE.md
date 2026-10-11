# Architecture

## Overview

NatureQuest AI is designed around a local-first pattern:

- The frontend runs in the browser as a PWA and stores user progress locally.
- The backend exposes FastAPI endpoints for health, progress, and quest generation.
- Local AI adapters are isolated behind provider interfaces.
- Offline fallback content is intentionally deterministic and source-tagged.

## Component boundaries

- `frontend/` handles the user experience, navigation, journal, missions, and map fallback behavior.
- `backend/app/services/ai/` contains provider interfaces and local quest generation logic.
- `backend/app/services/progress.py` tracks XP and badge eligibility without requiring cloud infrastructure.
- `docs/` records offline, model, and privacy guidance for users and contributors.

## Design principles

- No mandatory account or cloud requirement for the local experience
- Privacy first with optional sharing and local retention
- Clear uncertainty for AI-generated findings and identification results
- Honest reporting of model status and capability limits
