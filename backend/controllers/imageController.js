const axios = require("axios");
const fs = require("fs");
const appError = require("../utils/appError");

const createCaption = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(appError("No image uploaded!", 400));
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
    return next(appError("Something went wrong!", 500));
  }
};

module.exports = { createCaption };
