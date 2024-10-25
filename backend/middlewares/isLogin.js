const User = require("../models/User");
const appError = require("../utils/appError");
const { verifyToken } = require("../utils/authToken");
const getTokenFromHeader = require("../utils/getToken");

const isLogin = async (req, res, next) => {
  // get token from request headers
  const token = getTokenFromHeader(req);
  if (!token) {
    return next(appError("Please provide a token"), 404);
  }

  // verify token
  const { id } = verifyToken(token);
  const user = await User.findById(id);

  if (!user) {
    return next(appError("Expired/Invalid Token. Please Log in again", 406));
  }
  req.user = id;
  next();
};

module.exports = isLogin;
