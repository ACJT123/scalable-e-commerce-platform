const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const { login, register } = require("../services/user");

router.use(cookieParser());

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and Password are required");
  }

  try {
    const token = await login(email, password);

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.status(200).json({ accessToken: token.accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and Password are required");
  }

  try {
    await register(email, password);

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
