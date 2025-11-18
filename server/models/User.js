const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
  },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  clerkId: { type: String, required: true, unique: true, sparse: true },
  role: { type: String, enum: ['admin', 'user', 'guest'], default: 'user' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: [] }],
    completedCourses: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: [] 
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
