const Quiz = require('../models/Quiz');
const QuizResult = require('../models/quizResult'); 
const User = require('../models/User'); 
const Progress = require('../models/Progress'); 
const Course = require('../models/Course'); 
const mongoose = require('mongoose');

const PASSING_THRESHOLD = 70;

// ADMIN CRUD & CREATION FUNCTIONS 
const createQuiz = async (req, res) => {
    const { title, course, questions } = req.body; 

    if (!course || !questions || questions.length === 0) {
        return res.status(400).json({ message: 'Course ID and quiz questions are required.' });
    }

    try {
        const existingQuiz = await Quiz.findOne({ course });
        if (existingQuiz) {
             return res.status(400).json({ message: 'A quiz already exists for this course.' });
        }

        const newQuiz = await Quiz.create({
            title: title,
            course: course,
            questions: questions,
        });

        res.status(201).json({ message: 'Quiz created successfully!', quiz: newQuiz });
    } catch (error) {
        console.error("Error creating quiz:", error.message);
        res.status(500).json({ message: 'Failed to create quiz due to validation or server error.' });
    }
};

const updateQuiz = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as an admin.' });
    }
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found.' });
        }
        res.json({ message: 'Quiz updated successfully!', quiz: updatedQuiz });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteQuiz = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as an admin.' });
    }
    const quizId = req.params.id;
    try {
        const quiz = await Quiz.findByIdAndDelete(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found.' });
        }
        
        await QuizResult.deleteMany({ quiz: quizId });

        res.json({ message: 'Quiz and all associated results deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// public access functions

const getQuizByCourseId = async (req, res) => {
    const { courseId } = req.params;

    try {
        const quiz = await Quiz.findOne({ course: courseId }); 
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found for this course.' });
        }

        let existingResult = await QuizResult.findOne({ 
            user: req.user._id,
            quiz: quiz._id
        });
        
        if (existingResult && !existingResult.passed) {
             await QuizResult.deleteOne({ _id: existingResult._id });
             existingResult = null; 
        }

        const quizQuestionsForFrontend = quiz.questions.map(q => ({
            _id: q._id, 
            questionText: q.questionText,
            options: q.options,
        }));

        res.json({
            quiz: { 
                _id: quiz._id,
                title: quiz.title,
                course: quiz.course,
                questions: quizQuestionsForFrontend,
                fullQuestions: existingResult ? quiz.questions : undefined
            },
            result: existingResult
        });

    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ message: 'Failed to retrieve quiz data.' });
    }
};

const submitQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { submittedAnswers } = req.body; 

    if (!submittedAnswers || submittedAnswers.length === 0) {
        return res.status(400).json({ message: 'No answers submitted.' });
    }

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found.' });
        }
        
        const existingResult = await QuizResult.findOne({
            user: req.user._id,
            quiz: quizId
        });

        if (existingResult) {
            return res.status(400).json({ message: 'Quiz already submitted.', result: existingResult });
        }

        let correctCount = 0;
        const totalQuestions = quiz.questions.length;

        for (const userAnswer of submittedAnswers) {
            const question = quiz.questions[userAnswer.questionIndex];
            if (question && userAnswer.selectedOptionIndex === question.correctAnswerIndex) {
                correctCount++;
            }
        }

        const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
        const passed = scorePercentage >= PASSING_THRESHOLD;

        const newResult = await QuizResult.create({
            user: req.user._id,
            quiz: quizId,
            course: quiz.course,
            scorePercentage: scorePercentage,
            submittedAnswers: submittedAnswers,
            passed: passed,
        });

        res.status(201).json({
            message: passed ? 'Quiz submitted successfully. You passed!' : 'Quiz submitted successfully. You did not pass.',
            result: newResult,
            scorePercentage: scorePercentage,
            passed: passed,
            fullQuestions: quiz.questions 
        });

    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ message: 'Failed to submit quiz due to a server error.' });
    }
};

const getQuizResult = async (req, res) => {
    const { quizId } = req.params;

    try {
        const result = await QuizResult.findOne({
            user: req.user._id,
            quiz: quizId
        }).populate('quiz'); 

        if (!result) {
            return res.status(404).json({ message: 'Result not found.' });
        }
        
        res.json({
            result: result,
            fullQuestions: result.quiz.questions
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve quiz result.' });
    }
};

const markCourseComplete = async (req, res) => {
    const { courseId } = req.params;

    try {
        const quiz = await Quiz.findOne({ course: courseId });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found for this course.' });
        }

        const result = await QuizResult.findOne({
            user: req.user._id,
            quiz: quiz._id
        });
        
        if (!result || !result.passed) {
            return res.status(403).json({ message: 'Course is not complete: Quiz not passed or taken.' });
        }

        const courseDetails = await Course.findById(courseId).populate('lessons');
        const progressRecord = await Progress.findOne({
            user: req.user._id,
            course: courseId
        });

        const totalLessons = courseDetails.lessons.length;
        const completedLessonsCount = progressRecord ? progressRecord.completedLessons.length : 0;
        
        if (completedLessonsCount < totalLessons) {
            return res.status(403).json({ message: 'Course is not complete: All lessons have not been marked complete.' });
        }

        const user = await User.findById(req.user._id);

        if (!user.completedCourses.includes(courseId)) {
            user.completedCourses.push(courseId);
            await user.save();
        }

        res.json({ message: 'Course marked as complete!', completed: true });

    } catch (error) {
        console.error("Error marking course complete:", error);
        res.status(500).json({ message: 'Failed to mark course complete.' });
    }
};


const getAllUserQuizResults = async (req, res) => {
    try {
        const results = await QuizResult.find({ user: req.user._id })
            .populate('course', 'title'); 
        
        res.json(results);
    } catch (error) {
        console.error("Error fetching all quiz results:", error);
        res.status(500).json({ message: 'Failed to retrieve quiz results history.' });
    }
};


module.exports = {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getQuizByCourseId,
    submitQuiz,
    getQuizResult,
    markCourseComplete,
    getAllUserQuizResults, 
};
