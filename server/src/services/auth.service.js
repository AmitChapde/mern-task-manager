const User = require("../models/user.model");
const demoAdmin = require("../config/demoAdmin");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const signup = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({ name, email, password });

  return {
    user: sanitizeUser(user),
    token: generateToken(user._id),
  };
};

const login = async ({ email, password }) => {
  if (
    email?.toLowerCase() === demoAdmin.email &&
    password === demoAdmin.password
  ) {
    return {
      user: {
        id: demoAdmin.id,
        name: demoAdmin.name,
        email: demoAdmin.email,
        role: demoAdmin.role,
      },
      token: generateToken(demoAdmin.id),
    };
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  return {
    user: sanitizeUser(user),
    token: generateToken(user._id),
  };
};

const getProfile = async (userId) => {
  if (userId === demoAdmin.id) {
    return {
      id: demoAdmin.id,
      name: demoAdmin.name,
      email: demoAdmin.email,
      role: demoAdmin.role,
    };
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUser(user);
};

module.exports = {
  signup,
  login,
  getProfile,
};
