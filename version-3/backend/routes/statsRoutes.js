const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Get stats (all or for session)
router.get('/', statsController.getStats);

// Get recent stats
router.get('/recent', statsController.getRecentStats);

module.exports = router;
