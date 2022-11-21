const express = require("express");

const testone = require("../controllers/protestedRoute.js");

const router = express.Router();

router.get("/testone", testone);

module.exports = router;
