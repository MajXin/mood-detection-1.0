const mongoose = require('mongoose');

const emotionSchema = new mongoose.Schema({
  emotion: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'disgusted', 'fearful', 'surprised', 'neutral'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  mood: {
    type: String,
    enum: ['Positive', 'Negative', 'Surprised', 'Neutral'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Emotion', emotionSchema);
