const express = require("express");
const { generateBlog } = require("../controllers/blogController");

const blogRoutes = express.Router();

blogRoutes.post("/generate", generateBlog);

module.exports = blogRoutes;
