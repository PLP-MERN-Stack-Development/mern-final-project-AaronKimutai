const User = require('../models/User');
const Course = require('../models/Course'); 
const mongoose = require('mongoose');

// Get user profile 
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
        .select('-password')
        .populate('enrolledCourses'); 
        
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get enrolled courses 
const getEnrolledCourses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('enrolledCourses').populate('enrolledCourses');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.enrolledCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check if user is enrolled in a specific course
const checkEnrollment = async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).select('enrolledCourses');
        if (!user) {
            return res.status(404).json({ isEnrolled: false, message: 'User not found' });
        }
        
        const isEnrolled = user.enrolledCourses
            .map(id => id.toString())
            .includes(courseId.toString());

        res.json({ isEnrolled });
    } catch (error) {
        console.error("Error checking enrollment:", error);
        res.status(500).json({ isEnrolled: false, message: error.message });
    }
};

// enroll in a course 
const enrollCourse = async (req, res) => {
  const courseId = req.params.courseId;
  
  try {
    const user = await User.findById(req.user._id).select('-password').populate('enrolledCourses');
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    const courseToEnroll = await Course.findById(courseId);
    if (!courseToEnroll) {
        return res.status(404).json({ message: 'Course not found for enrollment.' });
    }

    if (user.enrolledCourses.some(id => id._id.toString() === courseId.toString())) {
        return res.status(200).json(user); 
    }

    user.enrolledCourses.push(courseId);
    await user.save();
    const updatedUser = await User.findById(req.user._id).select('-password').populate('enrolledCourses');
    res.json(updatedUser); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUser,
  getEnrolledCourses,
  enrollCourse,
  checkEnrollment,
};
