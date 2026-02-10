# Quick Start Guide - MERN Emotion Detection

## 📋 Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas cloud)
- npm or yarn
- Modern web browser with webcam

## ⚙️ Database Setup (MongoDB)

### Option 1: Local MongoDB
```bash
# Windows: Download and install from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB service
mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `.env` in backend folder:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mood-detection
```

## 🚀 Running the Application

### Terminal 1: Start Backend Server
```bash
cd backend
npm install
npm start
```
Expected output:
```
✅ MongoDB connected
🚀 Server is running on port 5000
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm install
npm start
```
Expected output:
```
Compiled successfully!
You can now view mood-detection-frontend in the browser.
Open http://localhost:3000
```

## 🎮 Using the Application

1. **Detection Tab**
   - Click "Start Detection" to begin
   - Allow camera access when prompted
   - The app will detect your facial expressions in real-time
   - Emotions and confidence scores update continuously

2. **Analytics Tab**
   - View all-time statistics
   - Select time range (30 min, 1 hour, 4 hours, 24 hours)
   - See emotion distribution and trends
   - Data is saved to MongoDB

## 🔍 Troubleshooting

### Camera Not Working
- Check browser permissions
- Use Chrome/Firefox for best compatibility
- Ensure camera is not in use by another app

### Backend Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5000
```
Solution: Make sure backend is running on Terminal 1

### MongoDB Connection Error
```
❌ MongoDB connection error
```
Solution: 
- Ensure MongoDB service is running
- Check MONGODB_URI in .env file
- Verify MongoDB credentials if using Atlas

### Models Not Loading
- Check browser console for errors
- Ensure internet connection (models download from CDN)
- Clear browser cache

## 📊 API Testing (Optional)

### Test Backend with curl/Postman

```bash
# Save emotion
curl -X POST http://localhost:5000/api/emotions \
  -H "Content-Type: application/json" \
  -d '{
    "emotion": "happy",
    "confidence": 95.5,
    "mood": "Positive",
    "sessionId": "test-session-1"
  }'

# Get all emotions
curl http://localhost:5000/api/emotions

# Get stats
curl http://localhost:5000/api/stats

# Get recent stats (last 60 mins)
curl "http://localhost:5000/api/stats/recent?minutes=60"
```

## 🎯 Next Steps / Enhancements

1. Add user authentication
2. Cloud deployment (Heroku, Vercel, AWS)
3. Real-time notifications
4. Export emotion history as CSV
5. Advanced analytics with charts
6. Dark/Light mode toggle
7. Multiple language support

## 📞 Support

For issues, check:
- MongoDB status
- Node.js version (node -v)
- Port availability (5000, 3000)
- Browser console for errors

## 🔐 Security Tips

- Never commit .env files to git
- Use environment variables for sensitive data
- Enable CORS only for trusted domains
- Use HTTPS in production
- Validate all user inputs on backend
