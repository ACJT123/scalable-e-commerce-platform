const jwt = require("jsonwebtoken");

const generateToken = (tokenType, userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: tokenType === "access" ? "1h" : "7d",
  });
};

const verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  verify,
  generateToken,
};
