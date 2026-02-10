import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './EmotionDetector.css';

const EmotionDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [emotion, setEmotion] = useState('Loading...');
  const [confidence, setConfidence] = useState(null);
  const [stats, setStats] = useState({});
  const [sessionId] = useState(Date.now().toString());
  const emotionHistoryRef = useRef({});

  useEffect(() => {
    loadFaceAPI();
  }, []);

  const loadFaceAPI = async () => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js';
    script.onload = () => {
      console.log('✅ Face-API loaded');
      setEmotion('Ready! Click Start to begin');
    };
    document.body.appendChild(script);
  };

  const startDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 720, height: 560 } });
      videoRef.current.srcObject = stream;
      setIsRunning(true);
      setEmotion('Detecting...');

      videoRef.current.onplay = () => {
        performDetection();
      };
    } catch (err) {
      setEmotion('Camera access denied');
      console.error('Camera error:', err);
    }
  };

  const performDetection = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (typeof window.faceapi === 'undefined') {
      setTimeout(performDetection, 500);
      return;
    }

    // Load models once
    if (!window.modelsLoaded) {
      try {
        await Promise.all([
          window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          window.faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          window.faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        window.modelsLoaded = true;
      } catch (err) {
        console.error('Model loading error:', err);
        return;
      }
    }

    const displaySize = { width: video.width, height: video.height };
    window.faceapi.matchDimensions(canvas, displaySize);

    const detectionInterval = setInterval(async () => {
      if (!isRunning) {
        clearInterval(detectionInterval);
        return;
      }

      try {
        const detection = await window.faceapi
          .detectSingleFace(video, new window.faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detection) {
          const resized = window.faceapi.resizeResults(detection, displaySize);
          window.faceapi.draw.drawDetections(canvas, resized);

          const expressions = detection.expressions;
          const maxEmotion = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
          );

          const conf = (expressions[maxEmotion] * 100).toFixed(2);
          const mood = getMood(maxEmotion);

          setEmotion(`${maxEmotion.toUpperCase()} ${mood.text}`);
          setConfidence(conf);

          // Track emotion
          emotionHistoryRef.current[maxEmotion] = (emotionHistoryRef.current[maxEmotion] || 0) + 1;
          updateStats();

          // Save to backend
          saveEmotionToBackend(maxEmotion, conf, mood.text);
        }
      } catch (err) {
        console.error('Detection error:', err);
      }
    }, 200);
  };

  const saveEmotionToBackend = async (emotion, confidence, mood) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/emotions`, {
        emotion,
        confidence: parseFloat(confidence),
        mood,
        sessionId
      });
    } catch (err) {
      console.error('Error saving to backend:', err);
    }
  };

  const updateStats = () => {
    const total = Object.values(emotionHistoryRef.current).reduce((a, b) => a + b, 0);
    const newStats = Object.entries(emotionHistoryRef.current).map(([emotion, count]) => ({
      emotion,
      count,
      percentage: ((count / total) * 100).toFixed(1)
    }));
    setStats(newStats);
  };

  const stopDetection = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsRunning(false);
    setEmotion('Detection stopped');
  };

  const getMood = (emotion) => {
    const moodMap = {
      happy: { text: '😊 Positive', color: '#00ff00' },
      sad: { text: '😞 Negative', color: '#ff0000' },
      angry: { text: '😠 Negative', color: '#ff0000' },
      disgusted: { text: '🤢 Negative', color: '#ff0000' },
      fearful: { text: '😨 Negative', color: '#ff0000' },
      surprised: { text: '😮 Surprised', color: '#ffff00' },
      neutral: { text: '😐 Neutral', color: '#888888' }
    };
    return moodMap[emotion] || { text: '🤔 Unknown', color: '#888888' };
  };

  return (
    <div className="emotion-detector">
      <h1>🎭 Emotion Detection (MERN Stack)</h1>
      <p className="subtitle">Advanced facial expression analysis with AI & Database</p>

      <div className="controls">
        <button onClick={startDetection} disabled={isRunning}>
          ▶ Start Detection
        </button>
        <button onClick={stopDetection} disabled={!isRunning}>
          ⏹ Stop Detection
        </button>
      </div>

      <div className="video-container">
        <video ref={videoRef} autoPlay muted width="720" height="560"></video>
        <canvas ref={canvasRef}></canvas>
      </div>

      <div className="emotion-display">{emotion}</div>
      {confidence && <div className="confidence">Confidence: {confidence}%</div>}

      <div className="stats">
        <h3>📊 Session Statistics</h3>
        {stats.length > 0 ? (
          <div className="stats-list">
            {stats.map((stat) => (
              <div key={stat.emotion} className="stat-item">
                {stat.emotion}: {stat.count} ({stat.percentage}%)
              </div>
            ))}
          </div>
        ) : (
          <p>No detections yet. Start detection to see stats.</p>
        )}
      </div>
    </div>
  );
};

export default EmotionDetector;
