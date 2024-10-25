const express = require("express");
const multer = require("multer");

const { createCaption } = require("../controllers/imageController");

const imageRoutes = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

imageRoutes.post("/caption", upload.single("image"), createCaption);

module.exports = imageRoutes;
