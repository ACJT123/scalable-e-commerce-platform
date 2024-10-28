const User = require("../models/user");
const axios = require("axios");

const register = async (email, password) => {
  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const newUser = new User({ email, password });

  await newUser.save();

  return await _getTokens(user._id);
};

const _getTokens = async (userId) => {
  const response = await axios.get("http://nginx/api/auth/sign/", {
    headers: {
      userId,
    },
  });

  return response.data;
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

  return await _getTokens(user._id);
};

module.exports = {
  register,
  login,
};
