const jwt = require("jsonwebtoken");

const KEY = process.env.JWT_KEY || "secret";
const generateToken = (id) => {
  return jwt.sign({ id }, KEY, {
    expiresIn: "1h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, KEY, (err, decode) => {
    if (err) {
      return false;
    } else {
      return decode;
    }
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
