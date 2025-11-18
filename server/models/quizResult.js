const mongoose = require('mongoose');

// create a quiz result schema
const quizResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    scorePercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    submittedAnswers: [{ 
        questionIndex: Number, 
        selectedOptionIndex: Number 
    }],
    passed: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);
module.exports = QuizResult;
