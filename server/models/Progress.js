const mongoose = require('mongoose');

// Define the progress schema
const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
    }],
}, { timestamps: true });

progressSchema.index({ user: 1, course: 1 }, { unique: true });

// Create and export the Progress model
module.exports = mongoose.model('Progress', progressSchema);

