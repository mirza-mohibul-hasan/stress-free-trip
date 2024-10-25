const express = require("express");
const {
  userRegister,
  userLogin,
  varifyOTP,
} = require("../controllers/authController");

const authRoutes = express.Router();

authRoutes.post("/register", userRegister);
authRoutes.post("/login", userLogin);
authRoutes.post("/varify-otp", varifyOTP);

module.exports = authRoutes;
