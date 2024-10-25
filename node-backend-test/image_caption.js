require("dotenv").config(); // Load .env variables
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = 3000;

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Endpoint to generate caption from an uploaded image
app.post("/caption", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded!" });
    }

    // Read the image and encode it in base64
    const image = fs.readFileSync(req.file.path, { encoding: "base64" });

    // Set up the API request to Hugging Face
    const url =
      "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning";
    const headers = {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    };

    // Prepare the payload
    const data = { inputs: image };

    // Send the API request
    const response = await axios.post(url, data, { headers });

    // Send the caption back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
