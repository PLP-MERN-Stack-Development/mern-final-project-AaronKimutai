const express = require("express");
const { getAllChats, createChat } = require("../controllers/chatController");

const router = express.Router();

router.get("/", getAllChats);
router.post("/", createChat);

module.exports = router;
