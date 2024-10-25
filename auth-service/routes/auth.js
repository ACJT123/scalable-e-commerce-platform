const express = require("express");
const router = express.Router();
const { sign, verify } = require("../services/jwt");

router.get("/sign", (req, res) => {
  const { userid } = req.headers;

  if (!userid) {
    return res.status(400).send("User ID is required");
  }

  try {
    const token = sign(userid);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/verify", (req, res) => {
  console.log(req.headers);
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
        // resign the token
        const { userId } = error.payload;
        const newToken = sign(userId);
        return res.status(200).json({ newToken });
      }
      case "JsonWebTokenError": {
        return res.status(401).send("Invalid token");
      }
    }
  }
});

module.exports = router;
