# Mood Detector (React-in-browser + FastAPI)

This project keeps **emotion inference in the browser** (fast + privacy) using **face-api.js**, and uses **FastAPI** only for optional logging + stats.

## Structure

```
mood-detector-rf/
  frontend/          # React (no build step)
  backend/           # FastAPI
```

## Frontend (React, zero-build)

1. Download face-api.js model files into:

`frontend/models/`

Model source: `https://github.com/justadudewhohacks/face-api.js/tree/master/weights`

Optional (Windows): auto-download the minimum required model files:

```bash
cd frontend
powershell -ExecutionPolicy Bypass -File .\download-models.ps1
```

2. Serve the `frontend` folder with any static server (recommended):

```bash
cd frontend
python -m http.server 5173
```

Then open `http://localhost:5173`.

> Tip: You can also use VS Code “Live Server”.

## Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API:
- `POST /log` body: `{ "emotion": "happy", "confidence": 0.92 }`
- `GET /stats` returns counts

## Why this architecture (viva line)

“Emotion detection runs client-side using face-api.js for real-time performance, while FastAPI handles logging and analytics. This separation improves speed, scalability, and privacy.”

