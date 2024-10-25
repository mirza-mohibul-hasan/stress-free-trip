require("dotenv").config(); // Load environment variables
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Example trip data (you can replace this with user input dynamically)
const tripData = {
  user_name: "Asif",
  trip_destination: "Saint Martin",
  trip_start_date: "2024-12-01",
  trip_end_date: "2024-12-07",
  transport: "Bus from Dhaka to Cox's Bazar, then a boat to Saint Martin",
  accommodation:
    "Saint Martin Resort - Mid-range, with a beautiful view of the ocean",
  meals: [
    { day: 1, meal: "Local seafood dinner at Coral View Restaurant" },
    { day: 3, meal: "Beachside BBQ at Saint Martin Beach" },
    {
      day: 5,
      meal: "Lunch at Island Cafe, specializing in tropical fruits and seafood",
    },
  ],
  activities: [
    {
      day: 1,
      activity: "Arrival in Saint Martin, beach walk, and sunset viewing.",
    },
    {
      day: 2,
      activity: "Snorkeling in the coral reefs and a tour of the island.",
    },
    { day: 3, activity: "Boat ride around the island and BBQ dinner." },
    { day: 4, activity: "Relaxation at the resort and island hike." },
    {
      day: 5,
      activity: "Trip to Chera Dwip, a small island off Saint Martin.",
    },
    { day: 6, activity: "Free day to explore or relax." },
    { day: 7, activity: "Departure from Saint Martin back to Dhaka." },
  ],
  notable_events: [
    { event: "Unexpected rainstorm on Day 4 during the island hike." },
    { event: "Spotted dolphins during the boat ride on Day 3." },
    { event: "A local festival on Day 6 with music and dancing." },
  ],
};

// Helper function to generate a prompt for the Hugging Face API
function generatePrompt(data) {
  return `
    Create a personalized travel blog for ${data.user_name}'s trip to ${data.trip_destination}.
    The trip took place from ${data.trip_start_date} to ${data.trip_end_date}.
    Include sections on:
    1. Transport and accommodation details.
    2. Daily activities with meals.
    3. Notable events that occurred during the trip.
    4. Conclusion summarizing the experience.
  `;
}

// Function to generate blog content using Hugging Face API
async function generateBlogContent(prompt) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  const url = `https://api-inference.huggingface.co/models/gpt2`;

  try {
    const response = await axios.post(
      url,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    return response.data[0].generated_text;
  } catch (error) {
    console.error("Error generating blog content:", error.message);
    throw new Error("Failed to generate blog content.");
  }
}

// Save the generated blog as a Markdown file
function saveBlog(content) {
  const filename = `trip_blog_${Date.now()}.md`;
  fs.writeFileSync(filename, content);
  console.log(`Blog saved as ${filename}`);
  return filename;
}

// API endpoint to generate and save the blog
app.post("/generate-blog", async (req, res) => {
  try {
    const data = req.body || tripData; // Use request body or default trip data
    const prompt = generatePrompt(data);

    const blogContent = await generateBlogContent(prompt);
    const filename = saveBlog(blogContent);

    res.status(200).json({
      message: "Blog generated successfully!",
      filename,
      preview: blogContent,
    });
  } catch (error) {
    console.error("Error generating blog:", error.message);
    res.status(500).json({ error: "Failed to generate blog." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
