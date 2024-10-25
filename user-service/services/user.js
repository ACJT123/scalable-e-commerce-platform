const User = require("../models/user");
const axios = require("axios");

const register = async (email, password) => {
  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const newUser = new User({ email, password });

  await newUser.save();

  const token = await _signToken(newUser._id);

  return token;
};

const _signToken = async (userId) => {
  const response = await axios.get("http://localhost:80/api/auth/sign", {
    headers: {
      userId,
    },
  });

  const token = response.data.token;

  return token;
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User does not exist");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = await _signToken(user._id);

  return token;
};

module.exports = {
  register,
  login,
};
