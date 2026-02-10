const video = document.getElementById('video');
const emotionText = document.getElementById('emotion');
const confidenceText = document.getElementById('confidence');
const statsDiv = document.getElementById('stats');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

let detectionActive = false;
let emotionHistory = {};
let detectionInterval = null;

// Safety check
if (typeof faceapi === "undefined") {
    console.error("❌ face-api.js not loaded");
    emotionText.innerText = "Error: face-api.js not loaded";
}

// Load models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
])
.then(() => {
    console.log("✅ Models loaded");
    emotionText.innerText = "Ready! Click Start to begin";
    startBtn.disabled = false;
})
.catch(err => {
    console.error("❌ Model loading error:", err);
    emotionText.innerText = "Error loading models";
});

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: { width: 720, height: 560 } })
        .then(stream => {
            video.srcObject = stream;
            detectionActive = true;
            startBtn.disabled = true;
            stopBtn.disabled = false;
        })
        .catch(err => {
            console.error("❌ Camera error:", err);
            emotionText.innerText = "Camera access denied. Please allow camera permissions.";
        });
}

function stopVideo() {
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    detectionActive = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    if (detectionInterval) clearInterval(detectionInterval);
    emotionText.innerText = "Detection stopped";
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    detectionInterval = setInterval(async () => {
        if (!detectionActive) return;

        try {
            const detection = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (detection) {
                const resized = faceapi.resizeResults(detection, displaySize);
                faceapi.draw.drawDetections(canvas, resized);

                const expressions = detection.expressions;
                const maxEmotion = Object.keys(expressions).reduce((a, b) =>
                    expressions[a] > expressions[b] ? a : b
                );

                const confidence = (expressions[maxEmotion] * 100).toFixed(2);
                const mood = getMood(maxEmotion);

                emotionText.innerText = `Emotion: ${maxEmotion.toUpperCase()}`;
                confidenceText.innerText = `Confidence: ${confidence}%`;

                // Track emotion history
                emotionHistory[maxEmotion] = (emotionHistory[maxEmotion] || 0) + 1;
                updateStats();
            } else {
                emotionText.innerText = "No face detected";
                confidenceText.innerText = "";
            }
        } catch (err) {
            console.error("Detection error:", err);
        }
    }, 200);
});

function updateStats() {
    const total = Object.values(emotionHistory).reduce((a, b) => a + b, 0);
    const stats = Object.entries(emotionHistory)
        .map(([emotion, count]) => `${emotion}: ${count} (${((count/total)*100).toFixed(1)}%)`)
        .join(" | ");
    statsDiv.innerText = stats;
}

function getMood(emotion) {
    const moodMap = {
        "happy": { text: "Positive 😊", color: "#00ff00" },
        "sad": { text: "Negative 😞", color: "#ff0000" },
        "angry": { text: "Negative 😠", color: "#ff0000" },
        "disgusted": { text: "Negative 🤢", color: "#ff0000" },
        "fearful": { text: "Negative 😨", color: "#ff0000" },
        "surprised": { text: "Surprised 😮", color: "#ffff00" },
        "neutral": { text: "Neutral 😐", color: "#888888" }
    };
    return moodMap[emotion] || { text: "Unknown 🤔", color: "#888888" };
}

startBtn.addEventListener('click', startVideo);
stopBtn.addEventListener('click', stopVideo);
