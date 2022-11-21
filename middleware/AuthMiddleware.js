const jsonwebtoken = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const pathToKey = path.join(__dirname + "/../keypair", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf-8");

async function authMiddleware(req, res, next) {
  if (!req.header.authorization) {
    res.status(401).json({ success: false, msg: "You have no authorization" });
  } else {
    const tokenParts = req.header.authorization.split(" ");

    if (
      tokenParts[0] === "Bearer" &&
      tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
    ) {
      try {
        const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
          algorithms: ["RS256"],
        });
        req.jwt = verification;
        next();
      } catch (error) {
        return res
          .status(401)
          .json({ success: false, msg: "You have no authorization" });
      }
    } else {
      return res
        .status(401)
        .json({ success: false, msg: "You have no authorization" });
    }
  }
}

module.exports = authMiddleware;
