const express = require('express');
const { markLessonComplete, getProgress } = require('../controllers/progressController');
const { requireAuth } = require('../middlewares/authMiddleware'); 

const router = express.Router();

// Get overall progress for all courses 
router.get('/', requireAuth, getProgress);

// mark a specific lesson as complete
router.post('/complete', requireAuth, markLessonComplete);

module.exports = router;
