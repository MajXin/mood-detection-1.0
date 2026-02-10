# Version-6: Workflow & Architecture Guide

## System Overview

Version-6 combines **client-side emotion detection** with **optional backend logging**.

```
YOUR COMPUTER
├─ Browser (http://localhost:5173)
│  └─ React App + face-api.js
│     ├─ Captures video from webcam
│     ├─ Detects emotions (in-browser AI)
│     └─ Draws detection boxes
│
└─ Optional Backend (http://localhost:8000)
   └─ FastAPI Server
      ├─ Logs emotions
      └─ Provides statistics
```

---

## Complete Workflow Flowchart

```
START
  │
  ├─→ [Download Models] (one-time setup)
  │   ├─ tiny_face_detector model
  │   ├─ face_landmark68 model
  │   └─ faceExpression model
  │
  ├─→ [Start Frontend Server]
  │   └─ python -m http.server 5173
  │
  ├─→ [Open Browser]
  │   └─ http://localhost:5173
  │
  ├─→ [Load Web Page]
  │   ├─ Load React (from CDN)
  │   ├─ Load Babel (JSX transpiler)
  │   ├─ Load face-api.js
  │   └─ Load models from local /models folder
  │
  ├─→ [UI Shows "Ready! Click Start"]
  │
  ├─→ [User Clicks "Start Detection"]
  │   │
  │   ├─→ [Request Camera Permission]
  │   │   └─ Browser shows permission dialog
  │   │
  │   ├─→ [Video Stream Starts]
  │   │   └─ 720×560 resolution
  │   │
  │   └─→ [Enter Detection Loop] ⟲ Every 100ms
  │       │
  │       ├─ Capture video frame
  │       ├─ Run TinyFaceDetector
  │       ├─ Extract 68 landmarks
  │       ├─ Get 7 emotion probabilities
  │       ├─ Find max emotion
  │       ├─ Draw detection box on canvas
  │       ├─ Update UI text/stats
  │       ├─ (Optional) Log to backend
  │       │
  │       └─ Repeat unless stopped
  │
  ├─→ [User Clicks "Stop Detection"]
  │   ├─ Stop detection loop
  │   ├─ Stop camera stream
  │   └─ Show final statistics
  │
  └─→ END
```

---

## Data Flow Diagram

### Single Detection Cycle

```
┌──────────────────────────────────────────────────────────────┐
│                    BROWSER CLIENT                            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 1. Video Element                                      │ │
│  │    720×560 pixel stream from webcam                  │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│  ┌────────────▼───────────────────────────────────────────┐ │
│  │ 2. face-api.js detectSingleFace()                     │ │
│  │    Input: video frame                                 │ │
│  │    Output: Detection object                           │ │
│  │    ├─ detection.box (coordinates)                    │ │
│  │    ├─ detection.landmarks (68 points)                │ │
│  │    └─ detection.expressions (7 emotions)             │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│  ┌────────────▼───────────────────────────────────────────┐ │
│  │ 3. Extract Emotion Object                             │ │
│  │    { happy: 0.92, sad: 0.05, ... }                   │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│  ┌────────────▼───────────────────────────────────────────┐ │
│  │ 4. Find Maximum                                        │ │
│  │    maxEmotion = 'happy' (confidence: 0.92)            │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│  ┌────────────▼───────────────────────────────────────────┐ │
│  │ 5. Draw Canvas                                         │ │
│  │    ├─ Draw box around face                            │ │
│  │    └─ Draw emotion label                              │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│  ┌────────────▼───────────────────────────────────────────┐ │
│  │ 6. Update React State                                  │ │
│  │    ├─ setEmotion('HAPPY')                            │ │
│  │    ├─ setConfidence(92)                              │ │
│  │    └─ Add to history                                  │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│  ┌────────────▼───────────────────────────────────────────┐ │
│  │ 7. (Optional) Log to Backend                           │ │
│  │    POST /log { emotion: 'happy', confidence: 0.92 } │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│  ┌────────────▼───────────────────────────────────────────┐ │
│  │ 8. Render UI                                           │ │
│  │    ├─ "Emotion: HAPPY"                               │ │
│  │    ├─ "😊 Positive"                                   │ │
│  │    ├─ "Confidence: 92%"                              │ │
│  │    └─ "happy: 45 | neutral: 23 | ..."              │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│               └─→ Wait 100ms, Loop Back to #1
│
└──────────────────────────────────────────────────────────────┘
```

---

## Backend (Optional) Data Flow

```
Browser                                    Backend (FastAPI)
  │
  ├─→ POST /log
  │   Body: {
  │     "emotion": "happy",
  │     "confidence": 0.9245
  │   }
  │                                       ┌─────────────────────┐
  │                                       │ Receive emotion log │
  │                                       ├─────────────────────┤
  │                                       │ Store in memory:    │
  │                                       │ [                   │
  │                                       │   {                 │
  │   ◄─→ Response: {"status": "logged"} │    "ts": "ISO...",  │
  │       {"size": 45}                    │    "emotion": "h",  │
  │                                       │    "conf": 0.92     │
  │                                       │   },                │
  │                                       │   ...               │
  │                                       │ ]                   │
  │                                       └─────────────────────┘
  │
  ├─→ GET /stats
  │                                       ┌────────────────────┐
  │                                       │ Calculate counts:  │
  │   ◄─→ Response: {                    │ {                  │
  │       "happy": 45,                    │  "happy": 45,      │
  │       "neutral": 23,                  │  "neutral": 23,    │
  │       "sad": 2                        │  "sad": 2          │
  │   }                                   │ }                  │
  │                                       └────────────────────┘
  │
  └─→ Done (All in memory, lost on restart)
```

---

## Component Hierarchy

```
App (Main React Component)
│
├─ Header
│  ├─ Title: "🎭 Real‑Time Emotion Detection"
│  └─ Subtitle: "Client-side inference + optional logging"
│
├─ Controls
│  ├─ Button: Start Detection
│  └─ Button: Stop Detection
│
├─ VideoSection
│  ├─ <video> element (webcam feed)
│  ├─ <canvas> element (detection overlay)
│  └─ Draw detection boxes
│
└─ Stats Section
   ├─ EmotionDisplay
   │  ├─ Current emotion text and color
   │  └─ Mood label with emoji
   │
   ├─ ConfidenceDisplay
   │  ├─ Percentage text
   │  └─ Progress bar visualization
   │
   └─ StatisticsDisplay
      └─ Running counts: happy: 45 | neutral: 23...
```

---

## State Management

```
React Component State:
│
├─ modelsReady: boolean
│  └─ true when all 3 models loaded
│
├─ running: boolean
│  └─ true when detection loop active
│
├─ emotion: string
│  └─ Current emotion ('happy', 'sad', etc.) or status text
│
├─ confidenceText: string
│  └─ "92.45%" format
│
├─ stats: object
│  └─ { happy: 45, neutral: 23, sad: 2, ... }
│
└─ (refs)
   ├─ videoRef → <video> element
   ├─ canvasRef → <canvas> for drawing
   ├─ streamRef → MediaStream
   ├─ intervalRef → Detection loop setInterval
   └─ lastPostRef → Throttle backend posts
```

---

## Model Architecture

### TinyFaceDetector
```
Input: Video Frame (any size)
  │
  ├─ Convolution layers
  ├─ Feature extraction
  ├─ Region proposal
  │
Output: Face location {x, y, width, height}
```

### FaceLandmark68Net
```
Input: Cropped face image (must have face)
  │
  ├─ Deep convolutional layers
  ├─ Extract facial geometry
  │
Output: 68 landmark points (coordinates)
  └─ Eyes, nose, mouth, jaw, etc.
```

### FaceExpressionNet
```
Input: Face image with landmarks
  │
  ├─ Feature extraction from landmarks
  ├─ Classify emotional state
  │
Output: 7 emotion probabilities
  ├─ happy: 0.92
  ├─ sad: 0.05
  ├─ angry: 0.02
  ├─ surprised: 0.005
  ├─ fearful: 0.001
  ├─ disgusted: 0.001
  └─ neutral: 0.001
```

---

## Time Measurements

### First-Time Startup

```
Action                          Time
─────────────────────────────────────
Download models                 2-5 min
Serve frontend                  1 sec
Browser load                    2-3 sec
React initialization            0.5 sec
Models load in browser          2-3 sec
Ready for detection             2-5 min TOTAL
```

### Per Frame (During Detection)

```
Action                          Time
─────────────────────────────────────
Capture frame                   < 1 ms
TinyFaceDetector                20-40 ms
FaceLandmark68Net               15-30 ms
FaceExpressionNet               10-20 ms
Canvas drawing                  < 5 ms
React render                    < 5 ms
Optional POST to backend        10-50 ms
─────────────────────────────────────
TOTAL per frame                 ~100 ms
Updates per second              10 FPS
```

---

## Error Handling Flow

```
┌─ Models Load
│  ├─ Success → "Ready! Click Start"
│  └─ Failure → "Error loading models (check frontend/models/)"
│
├─ Get Camera
│  ├─ Success → Start video stream
│  └─ Failure → "Camera access denied"
│
├─ Face Detection
│  ├─ Face found → Process emotions
│  ├─ No face → "No face detected" (keep trying)
│  └─ Error → Log to console (retry next frame)
│
└─ Backend Post (Optional)
   ├─ Success → Silent (no feedback)
   ├─ Failure → Silent (keep detecting locally)
   └─ Throttled → Max 1 post per 500ms
```

---

## Performance Optimization Strategies

### Memory Optimization
```
✓ Canvas reused for drawing (no new allocation per frame)
✓ Refs used for direct access (no re-render triggers)
✓ Detection loop managed with setInterval (not RAF)
✓ Models loaded once (shared across all detections)
```

### Speed Optimization
```
✓ 100ms interval (not every frame available)
✓ Single face detection (not multi-face)
✓ Local inference (no network latency)
✓ optional backend posts throttled (async/fire-and-forget)
```

### Browser Optimization
```
✓ Canvas drawing batched per loop
✓ React state updates batched
✓ Video stream resolution fixed (720×560)
✓ Models cached in IndexedDB after first load
```

---

## Scalability Considerations

### Current Limits
- Single face detection (1 face recommended)
- 10 FPS update rate
- Single browser tab
- In-memory backend storage

### Future Scaling Options
- Multi-face detection (detect all faces in frame)
- Multi-tab synchronization (WebSocket)
- Database backend (instead of in-memory)
- Distributed inference (edge servers)
- Batch processing (video files vs streaming)

---

## Privacy & Security

```
Data Flow Privacy:
┌─────────────────────────────────────────────────────┐
│ Webcam                                              │
│   ↓                                                 │
│ Browser (Client-side Processing)                   │
│   ├─ Video frame DOES NOT leave browser           │
│   ├─ Emotions detected in-browser                  │
│   └─ Only text sent to backend (NOT video)        │
│       ├─ emotion string ('happy')                 │
│       ├─ confidence float (0.92)                  │
│       └─ timestamp (ISO 8601)                     │
│   ↓                                                │
│ Backend (Optional)                                │
│   ├─ Stores summary data only                     │
│   ├─ No video frames stored                       │
│   ├─ No facial features stored                    │
│   └─ No personal information                      │
│       ↓                                            │
│ REST API                                          │
│   └─ CORS enabled (browser access only)          │
│       ↓                                            │
│ In-Memory Database                               │
│   └─ Lost on server restart (session only)       │
└─────────────────────────────────────────────────────┘

Result: Maximum privacy with optional analytics
```

---

## Deployment Architecture

### Local Development (Current)
```
Your Computer
├─ Frontend: http://localhost:5173
├─ Backend: http://localhost:8000 (optional)
└─ Models: frontend/models/
```

### Production Deployment (Future)
```
Cloud Server
├─ Frontend: Static hosting (AWS S3, Netlify, etc.)
├─ Backend: API server (AWS Lambda, Heroku, etc.)
├─ Models: CDN (Cloudflare, AWS CloudFront)
└─ Database: PostgreSQL, MongoDB, etc.
```

---

## Monitoring & Logging

### Browser Console Logs
```javascript
// Model loading
console.log("✅ Models loaded")
console.error("❌ Model loading error:", e)

// Detection errors
console.error("❌ Detection error:", e)

// General info
console.log("Detection running:", running)
```

### Backend Logs (if running)
```
[INFO] Uvicorn running on http://127.0.0.1:8000
[INFO] Application startup complete
[INFO] POST /log - {"emotion": "happy", ...}
[INFO] GET /stats - {emotion_counts}
```

---

## Debugging Tips

### Check if Models Downloaded
```bash
dir c:\Users\hp\Desktop\mood detection 2x\version-6\frontend\models
# Should show 6 files
```

### Check if Frontend Server Running
```bash
# When running: Ctrl+C, it shows all requests
# Check for: GET /index.html, GET /src/App.jsx, etc.
```

### Check if Backend Running
```bash
curl http://localhost:8000/health
# Should return: {"ok":true}
```

### Browser Console Errors
```
F12 → Console tab
Look for red error messages
Check Network tab for failed requests
```

---

## Summary

**Version-6 Architecture:**
- ✅ **Client-Side Detection** (privacy-first)
- ✅ **Optional Backend Logging** (analytics)
- ✅ **Zero-Build React** (simple setup)
- ✅ **Proven Models** (face-api.js)
- ✅ **Real-Time Processing** (10 FPS)
- ✅ **In-Browser Inference** (fast & responsive)

**Perfect for:**
- Personal emotion detection
- Educational demos
- Privacy-conscious users
- Quick prototyping
- Offline applications

---

**Last Updated:** February 2026  
**Version:** 6.0
