const UserSchema = require("../models/user.js");
const Utils = require("../utils/generateHashPassword.js");

const login = async (req, res) => {
  console.log(req.body);
  UserSchema.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ success: false, msg: "User is not found!!!" });
      }

      const isValidate = Utils.validatePws(
        req.body.password,
        user.password,
        user.salt
      );
      console.log("====================================");
      console.log(isValidate);
      console.log("====================================");

      const { _id, firstName, lastName, email } = user;

      if (isValidate) {
        const genToken = Utils.issueJWT(user);
        return res.status(200).json({
          success: true,
          _id,
          firstName,
          lastName,
          email,
          token: genToken.token,
          expires: genToken.expires,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, msg: "Wrong password!!" });
      }
    })
    .catch((err) => next(err));
};

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);

  UserSchema.findOne({ email }).then((user) => {
    if (user) {
      return res
        .status(409)
        .json({ success: false, msg: "user is already existed" });
    } else {
      const saltAndhash = Utils.genPassword(password);
      const salt = saltAndhash.salt;
      const hashPws = saltAndhash.hash;

      const newUser = new UserSchema({
        firstName,
        lastName,
        email,
        password: hashPws,
        salt,
      });

      newUser
        .save()
        .then((user) => {
          const jwt = Utils.issueJWT(user);

          const { firstName, lastName, email, _id } = user;
          return res.status(201).json({
            success: true,
            _id,
            firstName,
            lastName,
            email,
            token: jwt.token,
            expires: jwt.expires,
          });
        })
        .catch((err) => console.log("err"));
    }
  });
};

module.exports = { login, signup };
