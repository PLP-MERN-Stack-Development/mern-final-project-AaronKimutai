const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');


// load env vars
dotenv.config();

if (!process.env.CLERK_SECRET_KEY) {
    console.warn('Warning: CLERK_SECRET_KEY is not defined. Clerk authentication will fail.');
}

// connect to database
connectDB();

require('./models/User'); 
require('./models/Course');
require('./models/Lesson'); 
require('./models/Chat');
require('./models/Quiz');
require('./models/quizResult');
require('./models/Progress');

// initialize express app
const app = express();

// middlewares
app.use(express.json());
app.use(cors({
  origin: ["https://final-project-e-learning-platform-6.vercel.app/"],
  credentials: true
}));

app.use(ClerkExpressWithAuth());


// import routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes')); 
app.use('/api/progress', require('./routes/progressRoutes')); 
app.use('/api/quizzes', require('./routes/quizRoutes'));

// error handling middleware
app.use(errorHandler);


// sample route for testing
app.get('/', (req, res) =>{
    res.send('Server is running');
});

// define PORT
const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;