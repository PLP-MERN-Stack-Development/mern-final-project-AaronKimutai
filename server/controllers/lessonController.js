const Lesson = require('../models/Lesson');
const Course = require('../models/Course'); 
const Progress = require('../models/Progress'); 

// Create a new lesson and link it to a course 
const createLesson = async (req, res) => {
    // Check for admin role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as an admin.' });
    }

    const { title, content, vidUrl, courseId } = req.body;

    try {
        const newLesson = await Lesson.create({ title, content, vidUrl, course: courseId });

        const course = await Course.findById(courseId);
        if (!course) {
            await Lesson.findByIdAndDelete(newLesson._id); 
            return res.status(404).json({ message: 'Course not found to link the lesson.' });
        }

        course.lessons.push(newLesson._id);
        await course.save();

        res.status(201).json(newLesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get a single lesson by ID 
const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found.' });
        }
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a lesson by ID 
const updateLesson = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as an admin.' });
    }
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedLesson) {
            return res.status(404).json({ message: 'Lesson not found.' });
        }
        res.json({ message: 'Lesson updated successfully!', lesson: updatedLesson });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// delete a lesson by ID 
const deleteLesson = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as an admin.' });
    }
    const lessonId = req.params.id;

    try {
        const lesson = await Lesson.findByIdAndDelete(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found.' });
        }
        
        await Course.updateOne({ lessons: lessonId }, { $pull: { lessons: lessonId } });
        await Progress.updateMany({}, { $pull: { completedLessons: lessonId } });

        res.json({ message: 'Lesson deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createLesson,
    getLessonById,
    updateLesson,
    deleteLesson
};
