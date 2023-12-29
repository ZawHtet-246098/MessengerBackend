const FacebookStrategy = require("passport-facebook");
const passport = require("passport");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

const FACEBOOK_APP_ID = "707710300713123";
const FACEBOOK_APP_SECRET = "6707944c6777f7f93a3869395cae9410";

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:5000/user/facebook/callback",
      profileFields: ["email", "name"],
    },
    function (accessToken, refreshToken, profile, done) {
      const { email, first_name, last_name } = profile._json;
      const userData = {
        email,
        firstName: first_name,
        lastName: last_name,
      };
      // new userModel(userData).save();
      console.log("====================================");
      console.log(userData);
      console.log("====================================");
      done(null, profile);
    }
  )
);
