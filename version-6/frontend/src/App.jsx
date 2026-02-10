import React from "https://esm.sh/react@18.2.0";
import EmotionDetector from "./EmotionDetector.jsx";

export default function App() {
  return (
    <div className="page">
      <header className="header">
        <h1 className="title">Real‑Time Emotion Detection</h1>
        <p className="subtitle">
          Client-side inference (face-api.js) + optional FastAPI logging
        </p>
      </header>

      <EmotionDetector />
    </div>
  );
}

