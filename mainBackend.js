const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authMiddleware = require("./middleware/AuthMiddleware.js");
require("dotenv").config();

const app = express();

const userRoute = require("./routes/userRoute.js");
const protestedRoute = require("./routes/protestedRoute.js");
const resetPasswordRoute = require("./routes/resetPassword.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Your backend journey is started!!",
  });
});

app.use("/user", userRoute);
app.use("/protestedroute", authMiddleware, protestedRoute);
app.use("/resetPassword", resetPasswordRoute);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNNECTION_URL)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server is Running on port ${PORT} and db is connected`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
