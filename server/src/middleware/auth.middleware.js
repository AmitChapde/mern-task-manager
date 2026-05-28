const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const demoAdmin = require("../config/demoAdmin");
const ApiError = require("../utils/ApiError");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id === demoAdmin.id) {
      req.user = {
        id: demoAdmin.id,
        role: demoAdmin.role,
      };
      return next();
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    req.user = {
      id: user._id,
      role: user.role,
    };
    next();
  } catch (error) {
    next(error.name === "JsonWebTokenError" ? new ApiError(401, "Invalid token") : error);
  }
};

module.exports = protect;
