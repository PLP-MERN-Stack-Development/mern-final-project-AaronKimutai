const mongoose = require('mongoose');

// define the Course schema
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
    },
    ],
    instructor: {
        type: String,
        required: true
    },
    },
    { timestamps: true} 
);

// create and export the Course model
const Course = mongoose.model('Course', courseSchema);

// export the Course model
module.exports = Course;