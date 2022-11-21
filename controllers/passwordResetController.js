const nodemailer = require("nodemailer");

const Users = require("../models/user");
const otpModel = require("../models/Otp");

const utils = require("../utils/generateHashPassword.js");

const sendEmail = async (req, res, next) => {
  const { email: emailTo } = req.body;
  try {
    const user = await Users.findOne({ email: emailTo });
    if (!user)
      return res.status(409).json({
        success: false,
        msg: "Could not found user which match with this email!!",
      });

    // const otpCode = `${Math.floor(1000 + Math.random() * 90)}`;
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    console.log(OTP);

    var transport = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "zhtet1535@gmail.com",
        pass: "vrqznypdmowdvjum",
      },
    });

    let info = await transport.sendMail({
      from: '"zawMessenger" <zhtet1535@gmail.com>',
      to: emailTo,
      subject: "Password reset",
      html: `
      <p><b>Hi ${user.firstName} ${user.lastName},</b></p>
            <p>We received a request to access your account through your email.</p>
            <p>Your verification code is :</p>
            <h2><strong>${OTP}</strong></h2>
            <p>Enter the code in the input box.</p>
            <i>The code will expires in 1 day.</i>
      `,
    });

    const savedOtp = new otpModel({
      email: emailTo,
      code: OTP,
    });

    await savedOtp.save();

    return res.status(200).json({
      success: true,
      msg: "Email sent successfully!!",
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

const validationOTP = async (req, res, next) => {
  const { otp, email } = req.body;

  console.log("====================================");
  console.log(otp);
  console.log(email);
  console.log("====================================");

  try {
    const otpData = await otpModel.findOne({
      $and: [{ code: otp }, { email: email }],
    });
    if (!otpData)
      return res.status(404).json({ success: false, msg: "Invalid OTP!!" });

    const createdDateOTP = otpData.createdAt;
    const currentDateOTP = new Date();
    console.log(createdDateOTP);
    console.log(currentDateOTP);

    const msToTime = (ms) => ({
      hours: Math.trunc(ms / 3600000),
      minutes: Math.trunc(
        (ms / 3600000 - Math.trunc(ms / 3600000)) * 60 +
          (((ms / 3600000 - Math.trunc(ms / 3600000)) * 60) % 1 != 0 ? 1 : 0)
      ),
    });
    const duration = msToTime(Math.abs(currentDateOTP - createdDateOTP));

    console.log(duration);
    console.log(msToTime(currentDateOTP));
    console.log(msToTime(createdDateOTP));

    if (duration.hours < 24) {
      const otpData = await otpModel.updateOne(
        { $and: [{ code: otp }, { email: email }] },
        { $set: { varified: true } },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, msg: "OTP varification fuccessful!!" });
    } else {
      return res.status(500).json({ success: false, msg: "Invalid OTP" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

const changePassword = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const isOtpValidated = await otpModel.findOne({ email: email });
    if (isOtpValidated && isOtpValidated.varified) {
      const saltAndHash = utils.genPassword(password);
      const updatedPws = {};
      updatedPws.salt = saltAndHash.salt;
      updatedPws.password = saltAndHash.hash;

      const updateInMongo = await Users.updateOne(
        { email: email },
        { $set: updatedPws },
        { new: true }
      );

      await otpModel.deleteOne({ email: email });
      return res.status(200).json({
        success: true,
        msg: `User with the email of ${email} has successfully updated password!`,
      });
    } else {
      return res
        .status(404)
        .json({
          success: false,
          msg: "You are not authorized to change password without validating otp first !!",
        });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      msg: "Something is wrong and please try again later!!",
    });
  }

  // console.log(email, password);
};

module.exports = { sendEmail, validationOTP, changePassword };
