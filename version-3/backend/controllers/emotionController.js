const Emotion = require('../models/Emotion');

// Save emotion detection
exports.saveEmotion = async (req, res) => {
  try {
    const { emotion, confidence, mood, sessionId } = req.body;

    const newEmotion = new Emotion({
      emotion,
      confidence,
      mood,
      sessionId
    });

    const savedEmotion = await newEmotion.save();
    res.status(201).json({ 
      success: true, 
      message: 'Emotion saved successfully', 
      data: savedEmotion 
    });
  } catch (error) {
    console.error('Error saving emotion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all emotions for a session
exports.getSessionEmotions = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const emotions = await Emotion.find({ sessionId }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: emotions
    });
  } catch (error) {
    console.error('Error fetching emotions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all emotions
exports.getAllEmotions = async (req, res) => {
  try {
    const emotions = await Emotion.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json({
      success: true,
      data: emotions
    });
  } catch (error) {
    console.error('Error fetching emotions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
