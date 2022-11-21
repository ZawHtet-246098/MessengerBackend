const express = require("express");

const {
  sendEmail,
  validationOTP,
  changePassword,
} = require("../controllers/passwordResetController");

const router = express.Router();

router.post("/sendmail", sendEmail);
router.post("/validateOTP", validationOTP);
router.post("/changepws", changePassword);

module.exports = router;
