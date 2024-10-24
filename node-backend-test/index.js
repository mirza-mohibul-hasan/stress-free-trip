const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// Main route to generate itinerary
app.post("/generate-itinerary", async (req, res) => {
  const { destination, budget, duration = 1 } = req.body;

  if (!destination || !budget) {
    return res
      .status(400)
      .json({ error: "Destination and budget are required." });
  }

  try {
    const transport = await getRouteDetails("Dhaka", destination);
    const weather = await getWeather(destination);
    const meals = await generateMealSuggestions(destination);
    const accommodations = await generateAccommodationSuggestions(
      destination,
      budget
    );
    const description = await generateItineraryDescription(
      destination,
      budget,
      duration
    );

    const totalCost = estimateTotalCost(transport.distance, budget, duration);

    res.status(200).json({
      destination,
      transport,
      weather,
      meals,
      accommodations,
      totalCost,
      description,
    });
  } catch (error) {
    console.error("Error generating itinerary:", error.message);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
});

// Generate meal suggestions using AI
async function generateMealSuggestions(destination) {
  const prompt = `List three popular meals in ${destination}, formatted as "Dish Name - Restaurant Type - Price in BDT".`;

  try {
    const response = await callTextGenerationModel(prompt);
    const meals = parseSuggestions(response);

    if (meals.length === 0) throw new Error("No valid meal suggestions found.");
    return meals;
  } catch (error) {
    console.error("Error generating meals:", error.message);
    return [
      { name: "Grilled Fish", place: "Beachside Cafe", price: 300 },
      { name: "Coconut Rice", place: "Local Diner", price: 150 },
      { name: "Seafood Platter", place: "Ocean View Restaurant", price: 500 },
    ];
  }
}

// Generate accommodation suggestions using AI
async function generateAccommodationSuggestions(destination, budget) {
  const prompt = `Suggest two ${budget} accommodations in ${destination}, formatted as "Accommodation Name - Location - Price in BDT".`;

  try {
    const response = await callTextGenerationModel(prompt);
    const accommodations = parseSuggestions(response);

    if (accommodations.length === 0)
      throw new Error("No valid accommodation suggestions found.");
    return accommodations;
  } catch (error) {
    console.error("Error generating accommodations:", error.message);
    return budget === "budget"
      ? [{ name: "Budget Inn", place: "City Center", price: 1000 }]
      : [{ name: "Seaside Resort", place: "Beachfront", price: 5000 }];
  }
}

// Generate itinerary description using AI
async function generateItineraryDescription(destination, budget, duration) {
  const prompt = `Create a ${duration}-day travel itinerary for ${destination} with a ${budget} budget. Include transportation, meals, and accommodation.`;

  try {
    const response = await callTextGenerationModel(prompt);
    return response.trim();
  } catch (error) {
    console.error("Error generating itinerary description:", error.message);
    return "Enjoy a wonderful trip with exciting activities, delicious meals, and comfortable accommodations!";
  }
}

// Call text-generation model (e.g., GPT-Neo or Bloom)
async function callTextGenerationModel(prompt) {
  const url =
    "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B";

  try {
    const response = await axios.post(
      url,
      { inputs: prompt },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      }
    );

    console.log("Generated Text:", response.data[0].generated_text);
    return response.data[0].generated_text;
  } catch (error) {
    console.error("Text Generation Error:", error.message);
    return "Fallback text content due to generation failure.";
  }
}

// Parse AI-generated suggestions into structured data
function parseSuggestions(response) {
  console.log("Parsing response:", response); // Debugging output

  return response
    .split("\n")
    .map((line) => {
      const [name, place, price] = line.split("-").map((item) => item.trim());
      if (!name || !place) return null;
      return { name, place, price: parseFloat(price) || "N/A" };
    })
    .filter((item) => item);
}

// Fetch route details using OpenStreetMap API
async function getRouteDetails(origin, destination) {
  const url = "https://nominatim.openstreetmap.org/search";
  const [originData, destinationData] = await Promise.all([
    axios.get(url, { params: { q: origin, format: "json", limit: 1 } }),
    axios.get(url, { params: { q: destination, format: "json", limit: 1 } }),
  ]);

  const distance = calculateDistance(
    originData.data[0].lat,
    originData.data[0].lon,
    destinationData.data[0].lat,
    destinationData.data[0].lon
  );

  return { distance: `${distance.toFixed(2)} km`, mode: "Bus or Ferry" };
}

// Calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Fetch weather information from OpenWeatherMap API
async function getWeather(destination) {
  const url = `https://api.openweathermap.org/data/2.5/weather`;
  const response = await axios.get(url, {
    params: {
      q: destination,
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric",
    },
  });

  return {
    temperature: `${response.data.main.temp}°C`,
    description: response.data.weather[0].description,
  };
}

// Estimate total trip cost
function estimateTotalCost(distance, budget, duration) {
  const transportCost = parseFloat(distance) * 0.5;
  const accommodationCost = (budget === "budget" ? 1000 : 5000) * duration;
  const mealCost = 1000 * duration;
  return transportCost + accommodationCost + mealCost;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
