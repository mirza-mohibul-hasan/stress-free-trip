require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// API endpoint to generate itinerary
app.post("/generate-itinerary", async (req, res) => {
  try {
    const { startingPoint, destination, budget, duration } = req.body;

    if (!startingPoint || !destination || !budget || !duration) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const prompt = `
      Generate two travel itinerary options for a ${duration}-day trip from ${startingPoint} to ${destination} with a ${budget} budget.
      The response must be valid JSON in the following structure:

      {
        "ways": [
          {
            "name": "Way-01",
            "days": [
              { "day": 1, "transportation": ["..."], "accommodation": "...", "meals": ["..."], "activities": ["..."] },
              { "day": 2, "transportation": ["..."], "accommodation": "...", "meals": ["..."], "activities": ["..."] }
            ],
            "totalCost": "...",
            "summary": "...",
            "tips": ["...", "..."]
          },
          {
            "name": "Way-02",
            "days": [
              { "day": 1, "transportation": ["..."], "accommodation": "...", "meals": ["..."], "activities": ["..."] },
              { "day": 2, "transportation": ["..."], "accommodation": "...", "meals": ["..."], "activities": ["..."] }
            ],
            "totalCost": "...",
            "summary": "...",
            "tips": ["...", "..."]
          }
        ]
      }
    `;

    // Call Hugging Face API
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/bigscience/bloom",
      { inputs: prompt },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      }
    );

    console.log("Full API Response:", response.data); // Log full response

    // Ensure response has data
    const rawText = response.data?.generated_text;
    if (!rawText) {
      throw new Error("No generated text received from the AI model.");
    }

    console.log("Raw AI Response:", rawText);

    // Clean and parse the AI response
    const cleanedText = cleanAIResponse(rawText);
    const structuredResponse = tryParseJSON(cleanedText);

    if (!structuredResponse) {
      throw new Error("Failed to parse the AI response as JSON.");
    }

    res.status(200).json(structuredResponse);
  } catch (error) {
    console.error("Error generating itinerary:", error.message);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
});

// Helper function to clean AI response
function cleanAIResponse(text = "") {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Invalid JSON format in the AI response.");
  }
  return text.substring(jsonStart, jsonEnd + 1).trim();
}

// Helper function to safely parse JSON
function tryParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON Parsing Error:", error.message);
    return null;
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
