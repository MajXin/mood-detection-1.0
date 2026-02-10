# MERN Emotion Detection App

A full-stack real-time emotion detection application using the MERN stack (MongoDB, Express, React, Node.js).

## 🎯 Features

- **Real-time Emotion Detection**: Uses face-api.js to detect facial expressions
- **7 Emotion Categories**: Happy, Sad, Angry, Disgusted, Fearful, Surprised, Neutral
- **Confidence Scoring**: Shows detection confidence percentage
- **Session Tracking**: Tracks emotion history per session
- **Analytics Dashboard**: View emotion statistics and trends
- **MongoDB Backend**: Persistent storage of emotion data
- **REST API**: Full API for emotion data management

## 📁 Project Structure

```
mood-detection-mern/
│
├── backend/
│   ├── controllers/
│   │   ├── emotionController.js
│   │   └── statsController.js
│   ├── models/
│   │   └── Emotion.js
│   ├── routes/
│   │   ├── emotionRoutes.js
│   │   └── statsRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmotionDetector.js
│   │   │   ├── EmotionDetector.css
│   │   │   ├── Dashboard.js
│   │   │   └── Dashboard.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm start  # or npm run dev for development
```

The server will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React app will run on `http://localhost:3000`

## 📡 API Endpoints

### Emotions
- `POST /api/emotions` - Save detected emotion
- `GET /api/emotions` - Get all emotions
- `GET /api/emotions/:sessionId` - Get session-specific emotions

### Statistics
- `GET /api/stats` - Get overall statistics
- `GET /api/stats/recent?minutes=60` - Get recent statistics

## 🎨 UI/UX Improvements

- Modern gradient background
- Responsive design
- Real-time emotion tracking
- Statistical visualization
- Start/Stop controls
- Session-based data tracking
- Clean, modern interface

## 🔧 Configuration

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/mood-detection
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📊 Emotion Categories

| Emotion | Emoji | Mood |
|---------|-------|------|
| Happy | 😊 | Positive |
| Sad | 😞 | Negative |
| Angry | 😠 | Negative |
| Disgusted | 🤢 | Negative |
| Fearful | 😨 | Negative |
| Surprised | 😮 | Surprised |
| Neutral | 😐 | Neutral |

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose (ODM)
- CORS

### Frontend
- React 18
- Axios (HTTP Client)
- CSS3
- face-api.js (ML library)

## 📝 License

MIT License
