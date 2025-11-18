const mongoose = require('mongoose');

// Define the lesson schema
const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    vidUrl: {
        type: String
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    },
    { timestamps: true}
);

// Create and export the Lesson model
const Lesson = mongoose.model('Lesson', lessonSchema);

// Export the Lesson model
module.exports = Lesson;
