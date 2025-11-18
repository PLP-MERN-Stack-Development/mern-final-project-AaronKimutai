const mongoose = require('mongoose');

// Schema for a single question within the Quiz
const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }], 
    correctAnswerIndex: { type: Number, required: true } 
});

// Main Quiz Schema
const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        unique: true, 
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
    },
    questions: [questionSchema], // array of questions
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
