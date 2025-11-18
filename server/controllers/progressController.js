const Progress = require('../models/Progress');
const Course = require('../models/Course'); 

// mark a lesson as complete
const markLessonComplete = async (req, res) => {
    const { courseId, lessonId } = req.body;
    const userId = req.user._id;

    try {
        let progress = await Progress.findOneAndUpdate(
            { user: userId, course: courseId },
            { $addToSet: { completedLessons: lessonId } },
            { new: true, upsert: true }
        );

        res.json(progress);
    } catch (error) {
        console.error("Error marking lesson complete:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get progress for all enrolled courses
const getProgress = async (req, res) => {
    const userId = req.user._id;

    try {
        const progressRecords = await Progress.find({ user: userId })
            .populate({
                path: 'course',
                select: 'title lessons', 
                populate: {
                    path: 'lessons', 
                    select: '_id'
                }
            })
            .select('course completedLessons');
        res.json(progressRecords);

    } catch (error) {
        console.error("Error fetching progress:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    markLessonComplete,
    getProgress
};
