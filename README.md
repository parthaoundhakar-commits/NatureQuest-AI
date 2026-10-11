# NatureQuest AI

NatureQuest AI is a local-first, offline-ready nature exploration platform built for mindful people who want to walk away from screens, explore biodiversity, complete real-world missions, and keep their progress private by default.

Tagline: "Less scrolling. More exploring."

## Features

- Offline-first dashboard for quests, journal, XP, and progress
- Local quest generation with deterministic fallback logic
- Nature identification workflow with uncertainty prompts and local photo handling
- Eco XP, levels, badges, and streak tracking
- Biodiversity map with private observation handling and sync queue
- Screen-free challenge mode with short timers and reflection capture
- Developer-focused AI lab with model configuration information
- Multilingual interface ready for English, Hindi, and Marathi

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Lucide
- Backend: FastAPI, Pydantic, SQLAlchemy, SQLite
- Offline: PWA service worker + local storage / IndexedDB-style local-first flows
- Local AI: Ollama-compatible adapter and fallback quest generation

## Project layout

- `frontend/` — React + Vite + Tailwind app
- `backend/` — FastAPI service and local AI adapters
- `docs/` — architecture, privacy, offline, and AI model guidance
- `.github/` — workflows and contribution templates

## Quick start

### Windows

1. Install Node.js LTS and Python 3.12.
2. From the repo root:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
3. In a second terminal:
   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Local AI configuration

The app uses a provider interface that allows swapping model adapters. For local inference, install Ollama and configure a compatible model such as `llama3.1:8b` or a vision-capable model if supported by your hardware.

This project intentionally avoids cloud-only AI. The core experience works with deterministic local fallback data when a local model is unavailable.

## Testing

```powershell
cd frontend
npx vitest run

cd backend
python -m pytest
```

## License

This project is licensed under the MIT license. See [LICENSE](LICENSE).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and the issue templates under [.github](.github).
