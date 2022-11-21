const express = require("express");

const testone = async (req, res) => {
  console.log("====================================");
  console.log("req.header");
  console.log("====================================");
  res.status(200).json({
    success: true,
    message: "welcome main route",
  });
};

module.exports = testone;
