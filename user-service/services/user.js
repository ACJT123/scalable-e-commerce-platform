const User = require("../models/user");
const { signToken } = require("../libs/jwt");

const register = async (email, password) => {
  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const newUser = new User({ email, password });

  await newUser.save();

  const token = signToken({ email });

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

  const token = signToken({ email });

  return token;
};

module.exports = {
  register,
  login,
};
