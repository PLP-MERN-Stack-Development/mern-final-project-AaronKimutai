const express = require('express');
const { createLesson, getLessonById, updateLesson, deleteLesson } = require('../controllers/lessonController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/', requireAuth, createLesson);
router.get('/:id', requireAuth, getLessonById);
router.put('/:id', requireAuth, updateLesson);
router.delete('/:id', requireAuth, deleteLesson);

module.exports = router;