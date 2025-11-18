const express = require('express');

const {getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse} = require('../controllers/courseController'); 
const {requireAuth} = require('../middlewares/authMiddleware');

const router = express.Router();

// public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// admin only routes
router.post('/', requireAuth, createCourse);

router.put('/:id', requireAuth, updateCourse);
router.delete('/:id', requireAuth, deleteCourse); 

module.exports = router;