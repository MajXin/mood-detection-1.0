# Version-6: Quick Start User Manual

## 🚀 Getting Started in 5 Minutes

### What You'll Need
- Computer (Windows/Mac/Linux)
- Python installed
- Web browser
- Webcam

---

## Step 1: Download Models (One-Time Setup)

Open **PowerShell** or **Command Prompt** and run:

```bash
cd c:\Users\hp\Desktop\mood detection 2x\version-6\frontend
powershell -ExecutionPolicy Bypass -File .\download-models.ps1
```

**Wait for completion message:**
```
Done. Models saved to: ...
```

This takes 2-5 minutes. ☕ (Get a coffee!)

---

## Step 2: Start the App

**Keep previous terminal open and open a NEW terminal:**

```bash
cd c:\Users\hp\Desktop\mood detection 2x\version-6\frontend
python -m http.server 5173
```

You'll see:
```
Serving HTTP on 0.0.0.0 port 5173 (http://0.0.0.0:5173/) ...
```

---

## Step 3: Open in Browser

Go to: **[http://localhost:5173](http://localhost:5173)**

You should see:
```
🎭 Real‑Time Emotion Detection
Client-side inference + optional logging

[▶ Start Detection] [⏹ Stop Detection]

Status: Loading models...
```

**Wait for:** `Ready! Click Start`

---

## Step 4: Use the App

### Click "Start Detection"
- Allow camera access when asked
- Position face in front of camera
- Lighting matters! (good lighting = better accuracy)

### View Results
- **Big Text:** Current emotion (HAPPY, SAD, etc.)
- **Emoji:** Mood category (😊 Positive, 😞 Negative, etc.)
- **Confidence:** Accuracy percentage (0-100%)
- **Blue Box:** Detection box around your face
- **Stats:** Running count (happy: 45 | neutral: 23...)
- **Graph:** Real-time emotion trend chart (appears after 2-3 detections)

### Use the Buttons
- **Start:** Begin emotion detection from webcam
- **Stop:** Stop detection, keep results visible
- **Clear:** Reset statistics and emotion graph (useful for new session)

### View Emotion Trends
- Emotion graph shows last 50 detections over time
- Color-coded by emotion type
- Updates automatically as you make expressions
- Useful for seeing emotion patterns

---

## Common Issues & Fixes

### "Error loading models"
→ Delete `frontend/models/` folder and re-run Step 1

### "Camera access denied"
→ Click camera icon in browser address bar → Allow

### Port 5173 not working
→ Use port 8888 instead:
```bash
python -m http.server 8888
# Then go to: http://localhost:8888
```

### Emotion detection inaccurate
→ Improve lighting on your face
→ Make clearer expressions
→ Face directly at camera

---

## Optional: Enable Logging (Advanced)

Want to save emotion history? Open **another terminal:**

```bash
cd c:\Users\hp\Desktop\mood detection 2x\version-6\backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Now emotions are logged to backend at `http://localhost:8000/stats`

---

## Emotion Categories

| Your Face | Detected As | Shown As |
|-----------|------------|----------|
| Smiling 😊 | happy | 😊 Positive |
| Sad face 😢 | sad | 😞 Negative |
| Angry look 😠 | angry | 😠 Negative |
| Disgusted 🤢 | disgusted | 🤢 Negative |
| Fearful 😨 | fearful | 😨 Negative |
| Surprised 😮 | surprised | 😮 Surprised |
| Neutral 😐 | neutral | 😐 Neutral |

---

## Tips for Best Results

✅ **DO:**
- Use natural light from window/lamp
- Face camera directly
- Hold expression for 1-2 seconds
- Sit 1-2 feet from camera
- Make clear expressions

❌ **DON'T:**
- Use phone backlighting
- Wear sunglasses
- Sit in shadow
- Move too quickly
- Have extreme face angles

---

## How It Works (Simple Version)

1. **Browser captures** your face from webcam
2. **AI models detect** your emotion (happiness, sadness, etc.)
3. **Blue box** shows where your face is
4. **Stats update** with emotion count
5. **Everything stays** on your computer (private!)

---

## Troubleshooting Checklist

- [ ] Python installed? (`python --version`)
- [ ] Models downloaded? (Check `frontend/models/` has 6 files)
- [ ] Server running? (See `Serving HTTP...` message)
- [ ] Browser opened? (http://localhost:5173)
- [ ] Browser permission? (Allowed camera access)
- [ ] Good lighting? (Face clearly visible)
- [ ] Port 5173 free? (No other app using it)

---

## Terminal Commands Reference

| What | Command | Where |
|------|---------|-------|
| **Download models** | `powershell -ExecutionPolicy Bypass -File .\download-models.ps1` | `frontend` |
| **Start frontend** | `python -m http.server 5173` | `frontend` |
| **Start backend (optional)** | `pip install -r requirements.txt && uvicorn main:app --reload` | `backend` |
| **Stop server** | `Ctrl + C` | Any terminal |

---

## Directory Paths

```
c:\Users\hp\Desktop\mood detection 2x\version-6\
├── frontend/     ← Where you run the app from
├── backend/      ← Optional analytics server
└── DOCUMENTATION.md  ← Full technical docs
```

---

## 📱 Mobile & Tablet Users

**Good news:** Version-6 works on mobile devices!

### On Your Phone/Tablet:
1. Open browser (Chrome, Safari, Firefox)
2. Go to: `http://localhost:5173` (from same device)
   - **On same WiFi?** Use your computer's IP address instead
   - Example: `http://192.168.1.100:5173`
3. Allow camera permission
4. Use in landscape mode for best experience

### Portrait vs Landscape:
- **Portrait:** Full-width video, buttons stack
- **Landscape:** Wider video, better for emotion graph

### Touch Controls:
- All buttons are touch-friendly (large tap targets)
- No special gestures needed
- Works on phones and tablets

---

**Recommended order:**
1. ✅ Download models (5 min)
2. ✅ Start frontend (1 min)
3. ✅ Open browser (instant)
4. ✅ Grant camera permission
5. ✅ Start detection
6. 🎉 Have fun!

---

## Need Help?

### Still stuck on Step 1?
```bash
# Manual model download
# Go to: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
# Download these 6 files:
# - tiny_face_detector_model-weights_manifest.json
# - tiny_face_detector_model-shard1
# - face_landmark_68_model-weights_manifest.json
# - face_landmark_68_model-shard1
# - face_expression_model-weights_manifest.json
# - face_expression_model-shard1
# Place in: frontend/models/
```

### Port 5173 conflicts?
```bash
python -m http.server 8888
# Then go to: http://localhost:8888
```

### Need backend logging?
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```

---

## What's Running

When app is started:

```
Terminal 1: Frontend Server (http://localhost:5173)
            ├─ Serves HTML/CSS/JS
            ├─ Serves model files
            └─ Your React app runs here

Terminal 2 (Optional): Backend API (http://localhost:8000)
            ├─ Logs emotions
            ├─ Provides statistics
            └─ CORS enabled for frontend

Browser: The App
            ├─ Captures video
            ├─ Detects emotions (all client-side)
            └─ Draws detection boxes
```

---

## Performance

- **Model loading:** 2-5 seconds (first time)
- **Detection speed:** Updates every 100ms (10 FPS)
- **Accuracy:** 70-85% (depends on lighting)
- **Memory used:** ~200-300MB
- **CPU usage:** 10-30% (depends on computer)

---

## That's It! 🎉

You now have a working emotion detector running locally!

**Questions?** Check DOCUMENTATION.md for full technical details.

**Issues?** See Troubleshooting section above.

---

**Happy Detecting!** 🎭
