const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const quizController = require('../controllers/quizController');

router.use(requireAuth); 

// admin routes
router.post('/', quizController.createQuiz);
router.put('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);

// --- Public routes ---

router.get('/quizresults', quizController.getAllUserQuizResults); 


router.get('/course/:courseId', quizController.getQuizByCourseId);
router.post('/:quizId/submit', quizController.submitQuiz);
router.get('/:quizId/result', quizController.getQuizResult);
router.post('/complete-course/:courseId', quizController.markCourseComplete);

module.exports = router;
