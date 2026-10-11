# Offline mode

NatureQuest AI is designed to work without network access for core activities.

## What remains available offline

- Mission browsing and quest generation from the local fallback library
- Personal progress and journal data stored locally
- Eco XP and badge tracking
- Local map fallback list and observation state
- Screen-free reflection workflow

## What depends on a local backend

- Local quest generation through Ollama-compatible models
- Optional image classification when the hardware supports a compatible vision model
- Community sync queue processing after connectivity returns

## User guidance

- Download and configure a compatible local model before expecting offline AI features
- Keep the backend process running locally on the same machine or LAN
- Map tile loading depends on cached data and network access
- Some features remain intentionally limited when no local model is available
