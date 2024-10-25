const express = require("express");
const router = express.Router();
const { verify, generateToken } = require("../services/jwt");

router.get("/sign", (req, res) => {
  const { userid } = req.headers;

  if (!userid) {
    return res.status(400).send("User ID is required");
  }

  try {
    const accessToken = generateToken("access", userid);
    const refreshToken = generateToken("refresh", userid);

    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/refresh", (req, res) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(400).send("Token is required");
  }

  try {
    const { userId } = verify(token);

    const newToken = generateToken("access", userId);
    res.status(200).json({
      accessToken: newToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/verify", (req, res) => {
  let token = req.header("Authorization");

  console.log("token", token);

  if (!token) {
    return res.status(400).send("Token is required");
  }

  try {
    token = token.split(" ")[1];
    const decoded = verify(token);

    res.status(200).json({ userId: decoded.userId });
  } catch (error) {
    console.error(error);

    switch (error.name) {
      case "TokenExpiredError" || "JsonWebTokenError": {
        return res.status(401).send("Invalid token");
      }
    }
  }
});

module.exports = router;
