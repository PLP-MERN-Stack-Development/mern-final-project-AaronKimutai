const Course = require('../models/Course');
const Lesson = require('../models/Lesson'); 
const Quiz = require('../models/Quiz'); 
const QuizResult = require('../models/quizResult'); 
const Progress = require('../models/Progress'); 

// get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('lessons');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get course by id
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('lessons');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// create a new course by admin only
const createCourse = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as an admin to create a course' });
    }

    const { title, description, category, instructor } = req.body;
    try {
      const newCourse = await Course.create ({ title, description, category, instructor });
      res.status(201).json(newCourse);
    } catch (error) {
      res.status(500).json({ message: error.message }); 
    }
};


// update a course by admin only
const updateCourse = async (req, res) =>{
    // Check for admin role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as an admin to update a course' });
    }
    
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true} 
        );
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// delete a course by admin only
const deleteCourse = async (req, res) =>{ 
    // Check for admin role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as an admin to delete a course' });
    }
    const courseId = req.params.id;

    try {
       const courseToDelete = await Course.findByIdAndDelete(courseId);
       if (!courseToDelete) {
         return res.status(404).json({message: 'Course not found'});
       } 
       
        await Lesson.deleteMany({ course: courseId });
        await Quiz.deleteMany({ course: courseId });
        await QuizResult.deleteMany({ course: courseId });
        await Progress.deleteMany({ course: courseId });
        
       res.json({ message: 'Course and all associated content deleted successfully' });
    } catch (error) {
       res.status(500).json({ message: error.message}); 
    }
};

// export controller functions
module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};
