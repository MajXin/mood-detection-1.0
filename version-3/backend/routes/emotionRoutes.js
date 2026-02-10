const express = require('express');
const router = express.Router();
const emotionController = require('../controllers/emotionController');

// Save emotion
router.post('/', emotionController.saveEmotion);

// Get all emotions
router.get('/', emotionController.getAllEmotions);

// Get emotions for specific session
router.get('/:sessionId', emotionController.getSessionEmotions);

module.exports = router;
