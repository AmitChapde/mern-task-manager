const ApiError = require("../utils/ApiError");

const allowRoles = (...roles) => {
  return (req, res, next) => {
    const allowedRoles = roles.map((role) => role.toLowerCase());
    const userRole = req.user?.role?.toLowerCase();

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }

    next();
  };
};

module.exports = allowRoles;
