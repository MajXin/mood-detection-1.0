const Emotion = require('../models/Emotion');

// Get emotion statistics
exports.getStats = async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    let query = {};
    if (sessionId) {
      query.sessionId = sessionId;
    }

    const emotions = await Emotion.find(query);

    const stats = {
      totalDetections: emotions.length,
      emotionCount: {},
      moodCount: {},
      averageConfidence: 0,
      sessionId: sessionId || 'all'
    };

    let totalConfidence = 0;

    emotions.forEach(e => {
      stats.emotionCount[e.emotion] = (stats.emotionCount[e.emotion] || 0) + 1;
      stats.moodCount[e.mood] = (stats.moodCount[e.mood] || 0) + 1;
      totalConfidence += e.confidence;
    });

    if (emotions.length > 0) {
      stats.averageConfidence = (totalConfidence / emotions.length).toFixed(2);
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get recent emotions with stats
exports.getRecentStats = async (req, res) => {
  try {
    const { minutes = 60 } = req.query;
    
    const timeLimit = new Date(Date.now() - minutes * 60000);
    const recentEmotions = await Emotion.find({ timestamp: { $gte: timeLimit } });

    const stats = {
      timeRange: `Last ${minutes} minutes`,
      totalDetections: recentEmotions.length,
      emotions: {},
      moods: {},
      topEmotion: null,
      topMood: null
    };

    recentEmotions.forEach(e => {
      stats.emotions[e.emotion] = (stats.emotions[e.emotion] || 0) + 1;
      stats.moods[e.mood] = (stats.moods[e.mood] || 0) + 1;
    });

    // Find top emotion and mood
    if (Object.keys(stats.emotions).length > 0) {
      stats.topEmotion = Object.keys(stats.emotions).reduce((a, b) =>
        stats.emotions[a] > stats.emotions[b] ? a : b
      );
      stats.topMood = Object.keys(stats.moods).reduce((a, b) =>
        stats.moods[a] > stats.moods[b] ? a : b
      );
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching recent stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
