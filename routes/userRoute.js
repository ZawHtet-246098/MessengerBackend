const express = require("express");
const passport = require("passport");

const { login, signup, getAllUsers } = require("../controllers/user.js");

const router = express.Router();

const CLIENT_URL = "http://localhost:3000/";

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.post("/login", login);
router.post("/signup", signup);
router.get("/getAllUsers", getAllUsers);


router.get(
  "/facebookAuth",
  passport.authenticate("facebook", { scope: ["profile"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "/success",
//     failureRedirect: "/fail",
//   })
// );

// router.get("/fail", (req, res) => {
//   res.send("Failed attempt");
// });

// router.get("/success", (req, res) => {
//   res.send("Success");
// });

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function (obj, done) {
//   done(null, obj);
// });

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID,
//       clientSecret: FACEBOOK_APP_SECRET,
//       callbackURL: "http://localhost:5000/user/facebook/callback",
//       profileFields: ["email", "name"],
//     },
//     function (accessToken, refreshToken, profile, done) {
//       const { email, first_name, last_name } = profile._json;
//       const userData = {
//         email,
//         firstName: first_name,
//         lastName: last_name,
//       };
//       // new userModel(userData).save();
//       console.log("====================================");
//       console.log(userData);
//       console.log("====================================");
//       done(null, profile);
//     }
//   )
// );

module.exports = router;
