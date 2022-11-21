const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const pathToKey = path.join(__dirname + "./../keypair", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf-8");

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

function issueJWT(user) {
  const _id = user._id;

  const payload = {
    sub: user,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: "30d",
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: "30d",
  };
}

function validatePws(password, hash, salt) {
  let hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash == hashVerify;
}

module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.validatePws = validatePws;
