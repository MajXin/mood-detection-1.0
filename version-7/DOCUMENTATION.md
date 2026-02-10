# Version-6: Mood Detection (React + face-api.js + FastAPI)

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [System Workflow](#system-workflow)
4. [Quick Start Guide](#quick-start-guide)
5. [User Manual](#user-manual)
6. [API Documentation](#api-documentation)
7. [Troubleshooting](#troubleshooting)
8. [Features](#features)

---

## Project Overview

**Version-6** is a modern emotion detection application that combines:

- **Frontend:** React (zero-build, runs in browser)
- **Detection:** face-api.js (client-side, proven & fast)
- **Backend:** FastAPI (optional, for logging & statistics)
- **Models:** Pre-trained neural networks for face detection and emotion classification

### Key Advantages
✅ **No Build Step** - Just open in browser  
✅ **Privacy-First** - All detection happens client-side  
✅ **Offline Capable** - Works after models load (no internet needed)  
✅ **Optional Backend** - Logging is completely optional  
✅ **Fast Detection** - Real-time emotion recognition  
✅ **Proven Libraries** - Uses battle-tested face-api.js  
✅ **Emotion Trends** - Real-time line graph of emotion history  
✅ **Mobile Responsive** - Works on desktop, tablet, and mobile devices  

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │           React App (index.html)                    │ │
│  │  - UI Components (JSX in-browser transpiled)       │ │
│  │  - Video capture from webcam                       │ │
│  │  - Real-time emotion detection                    │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │        face-api.js (TensorFlow.js)                 │ │
│  │  - Tiny Face Detector (detect faces)              │ │
│  │  - Face Landmarks (68 points)                     │ │
│  │  - Expression Net (7 emotions)                    │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │        Canvas for Drawing (Video Overlay)          │ │
│  │  - Draw detection boxes                           │ │
│  │  - Display emotion labels                         │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         ↓ (Optional HTTP POST)
┌─────────────────────────────────────────────────────────────┐
│                FastAPI Backend (Optional)                   │
│                                                             │
│  ├─ POST /log     → Store emotion log                      │
│  ├─ GET /stats    → Retrieve emotion statistics            │
│  └─ GET /health   → Health check                           │
│                                                             │
│  (In-memory storage, resets on restart)                   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 18 (UMD build) | UI components, state management |
| **Transpiler** | Babel (Standalone) | JSX to JavaScript in-browser |
| **ML Library** | face-api.js 0.22.2 | Emotion detection & face landmarks |
| **Deep Learning** | TensorFlow.js | Model inference (already included in face-api.js) |
| **Server (Frontend)** | Python http.server | Serve static files |
| **API (Optional)** | FastAPI | RESTful emotion logging |
| **ASGI Server** | Uvicorn | Run FastAPI application |

---

## System Workflow

### Initialization Phase

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Opens Browser → http://localhost:5173              │
└────────────────────────┬──────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. index.html Loads                                         │
│    - React CDN loaded via <script>                         │
│    - Babel Standalone loaded for JSX transpilation        │
│    - face-api.js CDN loaded                               │
└────────────────────────┬──────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Models Load (from ./models/ directory)                  │
│    ├─ tinyFaceDetector model                              │
│    ├─ faceLandmark68Net model                             │
│    └─ faceExpressionNet model                             │
│                                                             │
│    Status: "Loading models..." appears on screen          │
└────────────────────────┬──────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. UI Ready                                                 │
│    Status: "Ready! Click Start"                           │
│    Start button becomes enabled                           │
└─────────────────────────────────────────────────────────────┘
```

### Detection Loop Phase

```
┌─────────────────────────────────────────────────────────────┐
│ User Clicks "Start Detection"                              │
└────────────────────────┬──────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Request Camera Permission                                  │
│ (Browser API: getUserMedia)                               │
└────────────────────────┬──────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Video Stream Starts                                         │
│ - 720×560 resolution requested                            │
│ - Canvas overlay created on top of video                  │
└────────────────────────┬──────────────────────────────────┘
                         ↓
        ┌───────────────────────────────────────┐
        │ Detection Loop (Every 100ms / 10 FPS) │
        └───────────────────────┬───────────────┘
                                ↓
        ┌───────────────────────────────────────┐
        │ 1. Capture Video Frame                │
        └───────────────────────┬───────────────┘
                                ↓
        ┌───────────────────────────────────────┐
        │ 2. Run TinyFaceDetector               │
        │    (Find faces in frame)              │
        └───────────────────────┬───────────────┘
                                ↓
        ┌───────────────────────────────────────┐
        │ 3. Extract 68 Face Landmarks          │
        │    (Precise face geometry)            │
        └───────────────────────┬───────────────┘
                                ↓
        ┌───────────────────────────────────────┐
        │ 4. Run Expression Recognition         │
        │    Get 7 emotion probabilities:       │
        │    - angry, disgusted, fearful        │
        │    - happy, neutral, sad, surprised   │
        └───────────────────────┬───────────────┘
                                ↓
        ┌───────────────────────────────────────┐
        │ 5. Find Max Emotion                   │
        │    (Highest probability)              │
        └───────────────────────┬───────────────┘
                                ↓
        ┌───────────────────────────────────────┐
        │ 6. Draw on Canvas                     │
        │    - Blue box around face             │
        │    - Emotion label                    │
        │    - Confidence percentage            │
        └───────────────────────┬───────────────┘
                                ↓
        ┌───────────────────────────────────────┐
        │ 7. Update UI                          │
        │    - Show emotion text                │
        │    - Update confidence bar            │
        │    - Update statistics                │
        └───────────────────────┬───────────────┘
                                ↓
        ┌───────────────────────────────────────┐
        │ 8. (Optional) Log to Backend          │
        │    POST /log with emotion data        │
        └───────────────────────┬───────────────┘
                                ↓
        ┌───────────────────────────────────────┐
        │ Wait 100ms, Loop Back to Step 1       │
        └───────────────────────────────────────┘
```

### Cleanup Phase

```
┌─────────────────────────────────────────────────────────────┐
│ User Clicks "Stop Detection"                               │
└────────────────────────┬──────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 1. Clear Detection Loop (Stop interval)                    │
│ 2. Stop Camera Stream (Stop all tracks)                    │
│ 3. Clear Canvas                                             │
│ 4. Reset UI to Initial State                              │
│ 5. Statistics remain visible for review                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start Guide

### Prerequisites
- **Windows/Mac/Linux** system
- **Python 3.8+** installed
- **Modern browser** (Chrome, Firefox, Edge)
- **Internet connection** (first time to download models)

### Installation Steps

#### Step 1: Download Model Files (5 minutes)

```bash
cd c:\Users\hp\Desktop\mood detection 2x\version-6\frontend
powershell -ExecutionPolicy Bypass -File .\download-models.ps1
```

**What this does:**
- Downloads 3 face-api.js model files (~20MB total)
- Saves to `frontend/models/` directory
- Creates weight manifests for model loading

**Expected Output:**
```
Downloading tiny_face_detector_model-weights_manifest.json ...
Downloading tiny_face_detector_model-shard1 ...
Downloading face_landmark_68_model-weights_manifest.json ...
Downloading face_landmark_68_model-shard1 ...
Downloading face_expression_model-weights_manifest.json ...
Downloading face_expression_model-shard1 ...

Done. Models saved to: C:\Users\hp\Desktop\mood detection 2x\version-6\frontend\models
```

#### Step 2: Start Frontend Server (Immediate)

```bash
cd c:\Users\hp\Desktop\mood detection 2x\version-6\frontend
python -m http.server 5173
```

**Expected Output:**
```
Serving HTTP on 0.0.0.0 port 5173 (http://0.0.0.0:5173/) ...
```

**Then Open:**
```
http://localhost:5173
```

#### Step 3 (Optional): Start Backend Server

```bash
cd c:\Users\hp\Desktop\mood detection 2x\version-6\backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

---

## User Manual

### Starting the Application

#### Setup (First Time Only)

1. **Download Models** (1 terminal)
   ```bash
   cd c:\Users\hp\Desktop\mood detection 2x\version-6\frontend
   powershell -ExecutionPolicy Bypass -File .\download-models.ps1
   ```
   Wait for "Done" message (~2-5 minutes depending on internet speed)

2. **Start Frontend** (Keep this terminal open)
   ```bash
   cd c:\Users\hp\Desktop\mood detection 2x\version-6\frontend
   python -m http.server 5173
   ```
   You should see: `Serving HTTP on 0.0.0.0 port 5173`

3. **Open Browser**
   - Go to: `http://localhost:5173`
   - Wait for "Ready! Click Start" message

### Using the Application

#### Interface Overview

```
┌─────────────────────────────────────────────┐
│  🎭 Real‑Time Emotion Detection             │
│  Client-side inference + optional logging    │
├─────────────────────────────────────────────┤
│  [▶ Start] [⏹ Stop] [🗑 Clear]            │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │        Video Stream + Detection Box   │ │
│  │        (Blue box on detected face)    │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Emotion: HAPPY [😊 Positive]             │
│  Confidence: 92.45%                        │
│                                             │
│  Stats:                                     │
│  happy: 45 | neutral: 23 | sad: 2         │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Emotion Trend (Last 50)              │ │
│  │           📈 Chart.js Graph           │ │
│  │   Shows emotion detection timeline    │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

#### Step-by-Step Instructions

1. **Grant Camera Permission**
   - Click "Start" button
   - Browser asks: "Allow access to camera?"
   - Click "Allow" (essential for emotion detection)

2. **Face the Camera**
   - Position your face clearly in video
   - Good lighting recommended
   - Keep 1-2 feet distance

3. **View Results**
   - **Emotion Text:** Current detected emotion (HAPPY, SAD, etc.)
   - **Mood Label:** Category + emoji (Positive 😊, Negative 😞, etc.)
   - **Confidence:** Shows how certain the model is (0-100%)
   - **Detection Box:** Cyan/blue rectangle around your face
   - **Statistics:** Running count of all emotions detected
   - **Emotion Trend Graph:** Real-time line chart showing emotion history (appears after first detection)

4. **View Emotion Trends**
   - After 2-3 detections, emotion graph appears below statistics
   - Shows last 50 emotion readings over time
   - Color-coded by emotion type
   - Updates in real-time

5. **Clear History**
   - Click "Clear" button to reset statistics and graph
   - Button is disabled until detections start

6. **Stop Detection**
   - Click "Stop" button
   - Video stops, statistics and graph remain visible
   - Camera access is released

### Emotion Categories

| Emotion | Mood | Color | Meaning |
|---------|------|-------|---------|
| Happy | Positive | 🟢 Green | Positive emotional state |
| Sad | Negative | 🔴 Red | Negative emotional state |
| Angry | Negative | 🔴 Red | Negative emotional state |
| Disgusted | Negative | 🔴 Red | Negative emotional state |
| Fearful | Negative | 🔴 Red | Negative emotional state |
| Surprised | Surprised | 🟡 Yellow | Unexpected reaction |
| Neutral | Neutral | ⚪ Gray | No clear emotion |

### Tips for Best Results

1. **Lighting**
   - Use natural daylight or well-lit room
   - Avoid harsh backlighting
   - Shadows on face reduce accuracy

2. **Face Position**
   - Look directly at camera
   - Keep head relatively still
   - Avoid extreme angles

3. **Expressions**
   - Make clear emotion expression
   - Hold expression 1-2 seconds
   - Exaggerate for better detection

4. **Distance**
   - 1-2 feet from camera
   - Don't be too close or too far
   - Face should take ~30% of video area

### Emotion Trend Graph

**What It Shows:**
- Real-time line chart of your last 50 emotion detections
- Color-coded by emotion type (7 different colors)
- Time axis shows detection count (1-50)
- Updates automatically as detections occur

**How to Use:**
1. Start detection and make different expressions
2. After 2-3 detections, graph appears below stats
3. Watch the graph build as you continue detecting
4. Use "Clear" button to reset graph and statistics

**Graph Features:**
- **Lines:** One line per emotion type
- **Colors:** Same color coding as emotion display
  - Green (Happy)
  - Red (Sad/Angry/Disgusted/Fearful)
  - Yellow (Surprised)
  - Gray (Neutral)
- **Legend:** Bottom of graph shows emotion labels
- **Responsive:** Adapts to screen size

**Tips:**
- Keep graph for entire session to track emotion patterns
- Clear graph to start fresh analysis
- Useful for monitoring mood changes over time

---

## API Documentation

### Backend Endpoints (Optional)

These endpoints are only available if you run the FastAPI backend on port 8000.

#### 1. Health Check

```http
GET /health
```

**Response:** `200 OK`
```json
{
  "ok": true
}
```

---

#### 2. Log Emotion

```http
POST /log
Content-Type: application/json

{
  "emotion": "happy",
  "confidence": 0.92
}
```

**Parameters:**
- `emotion` (string, required): Emotion label (1-32 chars)
- `confidence` (float, optional): Confidence score 0.0-1.0

**Response:** `200 OK`
```json
{
  "status": "logged",
  "size": 45
}
```

**Example using Frontend:**
The frontend automatically sends this when logging is enabled.

---

#### 3. Get Statistics

```http
GET /stats
```

**Response:** `200 OK`
```json
{
  "happy": 45,
  "neutral": 23,
  "sad": 2,
  "surprised": 1
}
```

Returns counts of all logged emotions (resets on server restart).

---

## Troubleshooting

### Problem: "Error loading models"

**Cause:** Models not found in `frontend/models/`

**Solution:**
1. Ensure models are downloaded:
   ```bash
   cd c:\Users\hp\Desktop\mood detection 2x\version-6\frontend
   powershell -ExecutionPolicy Bypass -File .\download-models.ps1
   ```

2. Check files exist:
   ```bash
   dir models
   ```
   Should show 6 files (3 JSON + 3 shard files)

### Problem: Emotion graph not appearing

**Cause:** Graph only appears after detections are made

**Solution:**
1. Start detection and let it run for 2-3 seconds
2. Graph automatically appears after first detection
3. Check browser console for errors (F12 → Console)
4. Ensure JavaScript is enabled in browser

### Problem: Graph looks small on mobile

**Cause:** Responsive design scaling

**Solution:**
1. Graph automatically adjusts to screen size
2. Rotate device to landscape for larger view
3. Zoom in browser if needed (Ctrl + )
4. Graph height limited to prevent scrolling

---

### Problem: "Camera access denied"

**Cause:** Browser lacks camera permission

**Solution:**
1. Check browser permissions settings
2. For Chrome: Settings → Privacy → Camera → Allow localhost:5173
3. For Firefox: Preferences → Privacy → ensure camera access enabled
4. Restart browser tab
5. Try again

---

### Problem: Port 5173 already in use

**Cause:** Another app using port 5173

**Solution:**
```bash
# Use different port
cd c:\Users\hp\Desktop\mood detection 2x\version-6\frontend
python -m http.server 8888
# Then go to: http://localhost:8888
```

---

### Problem: Slow detection / Low FPS

**Cause:** Computer not meeting performance specs

**Solution:**
1. Close other browser tabs
2. Reduce video resolution (modify index.html)
3. Close CPU-intensive applications
4. Use dedicated GPU (better with CUDA support)

---

### Problem: Inaccurate emotion detection

**Cause:** Poor lighting, face angle, or expression

**Solution:**
1. Improve lighting (face should be well-lit)
2. Face camera directly
3. Make clearer expressions
4. Models work best with frontal faces

---

### Problem: Backend connection failing

**Cause:** FastAPI not running

**Solution:**
1. Backend is optional, emotion detection works without it
2. If you want logging, ensure backend is started:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

---

## Features

### ✅ Implemented Features

- **Real-time Detection** (10 FPS update rate)
- **7 Emotion Classes** (happy, sad, angry, disgusted, fearful, surprised, neutral)
- **Confidence Scoring** (0-100% displayed)
- **Session Statistics** (running emotion count)
- **Emotion Trend Graph** (Chart.js line graph showing last 50 detections)
- **Canvas Overlay** (visual detection box with label)
- **Optional Logging** (to FastAPI backend)
- **Mood Categorization** (7 emotions → 4 categories)
- **Mobile Responsive** (optimized layouts for mobile, tablet, and desktop)
- **Privacy-First** (all processing client-side)
- **No Build Required** (zero-build React setup)

### 🔄 Detection Metrics

| Metric | Value |
|--------|-------|
| Detection Interval | 100ms |
| FPS (Frames Per Second) | ~10 |
| Model Latency | ~50-100ms per frame |
| Supported Faces | 1 (single face per frame) |
| Canvas Resolution | Video-dependent (720×560) |

### 📊 Data Collected (Optional)

When backend logging is enabled:

```json
{
  "ts": "2026-02-10T14:30:45.123456+00:00",
  "emotion": "happy",
  "confidence": 0.9245
}
```

- **Timestamp:** ISO 8601 UTC
- **Emotion:** Lowercase emotion string
- **Confidence:** Float 0.0-1.0

### 🔐 Privacy

- ✅ All processing happens in your browser
- ✅ No video frames sent to servers
- ✅ Models run locally (TensorFlow.js)
- ✅ Optional backend only logs summary data
- ✅ No personal information collected

---

## Directory Structure

```
version-6/
│
├── README.md                          ← Quick reference
├── DOCUMENTATION.md                   ← This file
│
├── frontend/                          ← React app (no build step)
│   ├── index.html                     ← Main HTML with React code
│   ├── src/
│   │   ├── styles.css                 ← UI styling
│   │   ├── App.jsx                    ← Main React component
│   │   ├── EmotionDetector.jsx        ← Detection component
│   │   └── main.jsx                   ← Entry point
│   ├── models/                        ← face-api.js models (download here)
│   │   ├── tiny_face_detector_model-weights_manifest.json
│   │   ├── tiny_face_detector_model-shard1
│   │   ├── face_landmark_68_model-weights_manifest.json
│   │   ├── face_landmark_68_model-shard1
│   │   ├── face_expression_model-weights_manifest.json
│   │   └── face_expression_model-shard1
│   ├── download-models.ps1            ← Auto-download script
│   └── package-lock.json              ← Dependencies lock (reference only)
│
└── backend/                           ← FastAPI (optional logging)
    ├── main.py                        ← FastAPI application
    ├── requirements.txt               ← Python dependencies
    └── __pycache__/                   ← Python cache (auto-generated)
```

---

## Performance Optimization

### Model Loading Time
- **Initial Load:** 2-5 seconds
- **Models Size:** ~20MB (downloaded once)
- **Cached:** Browser caches models locally

### Detection Speed
- **Per Frame:** 50-100ms inference
- **Update Rate:** 100ms interval = 10 FPS
- **GPU Support:** Faster with CUDA/Metal (auto-detected)

### Browser Storage
- Models cached in browser IndexedDB
- ~20MB disk space required
- Persists across sessions

---

## Limitations

⚠️ **Known Limitations:**

1. **Single Face Only** - Detects best with 1 face
2. **Frontal View** - Works best facing camera directly
3. **Lighting Important** - Poor lighting reduces accuracy
4. **Emotion Confusion** - Similar emotions may misclassify (angry vs disgusted)
5. **Session Data Only** - Backend stores in memory (resets on restart)
6. **Browser Dependent** - Requires modern JS support

---

## Mobile & Tablet Support

### Responsive Design

Version-6 is fully responsive and optimized for all screen sizes:

**Mobile (< 480px)**
- Single-column layout
- Full-width video container
- Touch-friendly button sizing (minimum 42px)
- Wrapped button layout
- Responsive font sizes
- Emotion graph height limited to prevent scrolling

**Tablet (480px - 768px)**
- Optimized spacing for medium screens
- Medium-width video
- Balanced font sizes
- Flexible stat grid

**Desktop (> 768px)**
- Full 720px layout
- Optimal spacing and typography
- Full-width graph display

### Using on Mobile

1. **Portrait Mode** (Recommended)
   - Video takes up full width
   - Controls stack vertically
   - Good for casual use

2. **Landscape Mode** (Best for Graph)
   - Wider video display
   - Controls arranged horizontally
   - Emotion graph has more width for readability
   - Best viewing experience

### Touch-Friendly Controls

- Buttons automatically sized for touch (min 44px)
- Large tap targets
- No hover effects on mobile
- Full functionality on phones and tablets

### Performance on Mobile

- Detection runs smoothly on modern phones
- Face-api.js optimized for mobile
- Battery usage reasonable (detection loop runs 10x/second)
- Models cached after first load

### Browser Support Mobile/Tablet

| Device | Browser | Support | Notes |
|--------|---------|---------|-------|
| iPhone/iPad | Safari | ✅ Full | HTTPS may be required |
| Android | Chrome | ✅ Full | WebGL for GPU support |
| Android | Firefox | ✅ Full | Good performance |
| Tablets | Chrome/Safari | ✅ Full | Recommended |

---

## Keyboard Shortcuts

Currently no keyboard shortcuts. Use mouse/touch to interact with buttons.

---

## Getting Help

### Common Issues

1. **Models won't download?**
   - Check internet connection
   - Try again later
   - Manual download from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

2. **Emotion detection wrong?**
   - Improve lighting
   - Ensure clear facial expressions
   - Face directly at camera

3. **Server won't start?**
   - Check if port is already in use
   - Try different port with: `python -m http.server 8888`

---

## Version History

- **Version 6:** React + face-api.js + optional FastAPI
- **Version 5:** React + PyTorch backend
- **Version 4:** Python Streamlit
- **Version 3:** Vanilla JS with face-api.js (proven working)
- **Version 2:** Browser-based detection
- **Version 1:** Initial concept

---

## Credits & Resources

- **face-api.js:** https://github.com/justadudewhohacks/face-api.js
- **TensorFlow.js:** https://www.tensorflow.org/js
- **React:** https://react.dev
- **FastAPI:** https://fastapi.tiangolo.com
- **Babel Standalone:** https://babeljs.io/docs/babel-standalone

---

## License

This project is provided as-is for educational and personal use.

---

**Last Updated:** February 2026  
**Version:** 6.0  
**Status:** ✅ Fully Functional
