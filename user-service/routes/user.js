const express = require("express");
const router = express.Router();
const { login, register } = require("../services/user");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and Password are required");
  }

  try {
    const token = await login(email, password);

    res.status(200).json({ token });
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
    const token = await register(email, password);

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
