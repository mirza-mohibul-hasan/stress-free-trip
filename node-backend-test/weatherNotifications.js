require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Function to get coordinates using Nominatim API
async function getCoordinates(location) {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: { q: location, format: "json", limit: 1 },
      }
    );

    if (response.data.length === 0) {
      console.error(`Location not found: ${location}`);
      return null;
    }

    const { lat, lon } = response.data[0];
    return { lat, lon };
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    return null;
  }
}

// Function to get weather alerts from Open-Meteo API
async function getWeatherAlerts(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast`;
    const response = await axios.get(url, {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true,
      },
    });

    const weather = response.data.current_weather;
    const summary = `${weather.temperature}°C with windspeed of ${weather.windspeed} m/s`;

    return {
      summary,
      temperature: weather.temperature,
      windspeed: weather.windspeed,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return null;
  }
}

// Weather alerts endpoint
app.post("/weather-alerts", async (req, res) => {
  try {
    const { destination } = req.body;

    if (!destination) {
      return res.status(400).json({ error: "Destination is required." });
    }

    const coords = await getCoordinates(destination);
    if (!coords) {
      return res.status(500).json({ error: "Failed to fetch coordinates." });
    }

    const weatherData = await getWeatherAlerts(coords.lat, coords.lon);
    if (!weatherData) {
      return res.status(500).json({ error: "Failed to fetch weather data." });
    }

    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching weather alerts:", error.message);
    res.status(500).json({ error: "Failed to fetch weather alerts." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
