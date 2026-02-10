from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Mood Detector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class EmotionLog(BaseModel):
    emotion: str = Field(..., min_length=1, max_length=32)
    confidence: float | None = Field(default=None, ge=0.0, le=1.0)


emotion_log: list[dict[str, Any]] = []


@app.post("/log")
def log_emotion(data: EmotionLog):
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "emotion": data.emotion.lower().strip(),
        "confidence": data.confidence,
    }
    emotion_log.append(entry)
    return {"status": "logged", "size": len(emotion_log)}


@app.get("/stats")
def get_stats():
    counts = Counter(e["emotion"] for e in emotion_log)
    return dict(counts)


@app.get("/health")
def health():
    return {"ok": True}

