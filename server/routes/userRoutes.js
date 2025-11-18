const express = require('express');
const { 
    getUser, 
    getEnrolledCourses, 
    enrollCourse,
    checkEnrollment 
} = require('../controllers/userController'); 
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', requireAuth, getUser);
router.get('/me/courses', requireAuth, getEnrolledCourses);
router.post('/enroll/:courseId', requireAuth, enrollCourse);

// dedicated status check route
router.get('/check-enrollment/:courseId', requireAuth, checkEnrollment); 

module.exports = router;

