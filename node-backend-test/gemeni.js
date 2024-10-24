require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
const app = express();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// API endpoint to generate structured itinerary with multiple ways
app.post("/generate-itinerary", async (req, res) => {
  try {
    const { startingPoint, destination, budget, duration } = req.body;

    // Validate input
    if (!startingPoint || !destination || !budget || !duration) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Design the prompt to request multiple ways of traveling
    const prompt = `
      Provide two different ways to travel for a ${duration}-day low-cost trip from ${startingPoint} to ${destination}, Bangladesh. 
      Each way should include:
      - Daily itinerary with transportation, accommodation, meals, and activities.
      - Total estimated cost for each way.
      Format the response as follows:

      {
        "ways": [
          {
            "name": "Way-01",
            "days": [
              { "day": 1, "transportation": ["..."], "accommodation": "...", "meals": ["..."], "activities": ["..."] },
              ...
            ],
            "totalCost": "...",
            "summary": "...",
            "tips": ["...", "..."]
          },
          {
            "name": "Way-02",
            "days": [
              { "day": 1, "transportation": ["..."], "accommodation": "...", "meals": ["..."], "activities": ["..."] },
              ...
            ],
            "totalCost": "...",
            "summary": "...",
            "tips": ["...", "..."]
          }
        ]
      }
    `;

    // Call the Generative AI model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);

    const response = await result.response;
    const rawText = response.text();

    console.log("Raw AI Response:", rawText); // Log the raw response

    // Clean and parse the AI response into structured JSON
    const cleanedText = cleanAIResponse(rawText);
    const structuredResponse = tryParseJSON(cleanedText);

    if (!structuredResponse) {
      throw new Error("Failed to parse the AI response as JSON.");
    }

    // Send the structured JSON response
    res.status(200).json(structuredResponse);
  } catch (error) {
    console.error("Error generating itinerary:", error.message);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
});

// Helper function to clean AI response by removing code fences
function cleanAIResponse(text) {
  return text.replace(/```(?:json)?|```/g, "").trim(); // Remove code fences
}

// Helper function to try parsing text as JSON
function tryParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON Parsing Error:", error.message);
    return null; // Return null if parsing fails
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
