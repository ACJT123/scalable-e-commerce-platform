const express = require("express");
const router = express.Router();
const { sign, verify } = require("../services/jwt");

router.post("/sign", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  try {
    const token = sign(userId);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/verify", (req, res) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(400).send("Token is required");
  }

  try {
    token = token.split(" ")[1];
    const decoded = verify(token);

    res.status(200).json({ decoded });
  } catch (error) {
    console.error(error);

    switch (error.name) {
      case "TokenExpiredError": {
        return res.status(401).send("Token expired");
      }
      case "JsonWebTokenError": {
        return res.status(401).send("Invalid token");
      }
    }
  }
});

module.exports = router;
