const video = document.getElementById('video');
const emotionText = document.getElementById('emotion');

// Safety check
if (typeof faceapi === "undefined") {
    console.error("❌ face-api.js not loaded");
}

// Load models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
])
.then(() => {
    console.log("✅ Models loaded");
    startVideo();
})
.catch(err => {
    console.error("❌ Model loading error:", err);
});

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("❌ Camera error:", err);
        });
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
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

            emotionText.innerText =
                `Emotion: ${maxEmotion.toUpperCase()} | Mood: ${getMood(maxEmotion)}`;
        }
    }, 200);
});

function getMood(emotion) {
    if (emotion === "happy") return "Positive 😊";
    if (emotion === "sad" || emotion === "angry" || emotion === "disgusted")
        return "Negative 😞";
    return "Neutral 😐";
}
