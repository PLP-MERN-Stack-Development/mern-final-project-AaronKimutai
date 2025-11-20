const Chat = require("../models/Chat");

// Function to generate a simple response
const generateBotResponse = (message) => {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("quiz") || lowerMsg.includes("test")) {
        return "To complete a quiz, navigate to the Course Details page for the course, select the final lesson, and look for the 'Take Quiz' link if one is available for that course.";
    }
    if (lowerMsg.includes("enroll") || lowerMsg.includes("start learning")) {
        return "You can enroll in any course from the 'Courses' page. Click on the course you want and then use the 'Enroll Now' button.";
    }
    if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
        return "Hello! I am your E-Learning Assistant. How can I help you with your courses today?";
    }
    
    return "I am the E-Learning Assistant. I can help with general questions about courses, enrollment, and quizzes. Can you ask me something specific?";
};


// get all chats 
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 }); 
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// save a new chat
const createChat = async (req, res) => {
  const { userMessage } = req.body; 
    
    
    if (!userMessage) {
        return res.status(400).json({ message: "User message is required." });
    }
    

    const botResponse = generateBotResponse(userMessage);

  try {
    const newChat = await Chat.create({ userMessage, botResponse });
    res.status(201).json(newChat);
  } catch (error) {
    console.error("Database Error creating chat:", error.message); 
    res.status(500).json({ message: "Failed to save chat record due to a server error." });
  }
};

module.exports = { getAllChats, createChat };