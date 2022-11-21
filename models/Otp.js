const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    code: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    varified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("otp", OtpSchema);
