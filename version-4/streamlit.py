import streamlit as st
import cv2
import numpy as np
from deepface import DeepFace
from streamlit_webrtc import webrtc_streamer, VideoTransformerBase

# -------------------- Page Config --------------------
st.set_page_config(
    page_title="Facial Mood Detector",
    page_icon="😐",
    layout="centered"
)

st.title("😐 Facial Mood Detector")
st.write("Real-time emotion detection using webcam (Streamlit)")

# -------------------- Load Face Cascade --------------------
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

# -------------------- Video Processing Class --------------------
class EmotionDetector(VideoTransformerBase):
    def transform(self, frame):
        # Convert frame to OpenCV format
        img = frame.to_ndarray(format="bgr24")

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        rgb = cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)

        # Detect faces
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )

        for (x, y, w, h) in faces:
            face_roi = rgb[y:y+h, x:x+w]

            try:
                # Emotion analysis
                result = DeepFace.analyze(
                    face_roi,
                    actions=['emotion'],
                    enforce_detection=False
                )
                emotion = result[0]['dominant_emotion']

                # Draw bounding box & label
                cv2.rectangle(img, (x, y), (x+w, y+h), (0, 0, 255), 2)
                cv2.putText(
                    img,
                    emotion,
                    (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.9,
                    (0, 0, 255),
                    2
                )

            except Exception:
                pass

        return img

# -------------------- Webcam Stream --------------------
webrtc_streamer(
    key="emotion-detector",
    video_transformer_factory=EmotionDetector,
    media_stream_constraints={"video": True, "audio": False},
)

st.markdown(
    """
    ---
    **Detected emotions:** happy, sad, angry, neutral, fear, surprise, disgust  
    Built using **OpenCV + DeepFace + Streamlit**
    """
)
