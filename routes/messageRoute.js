const express = require("express");

const {
  getMessages,
  addMessages,
} = require("../controllers/messagesController.js");

const router = express.Router();

router.post("/getMessages", getMessages);
router.post("/addMessage", addMessages);

module.exports = router;
