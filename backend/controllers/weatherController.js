const axios = require("axios");
const appError = require("../utils/appError");

const getWeather = async (req, res, next) => {
  try {
    const { destination } = req.body;

    if (!destination) {
      return next(appError("Destination is required.", 400));
    }

    const coords = await getCoordinates(destination);
    if (!coords) {
      return next(appError("Failed to fetch coordinates.", 500));
    }

    const weatherData = await getWeatherAlerts(coords.lat, coords.lon);
    if (!weatherData) {
      return next(appError("Failed to fetch weather data.", 500));
    }

    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching weather alerts:", error.message);
    return next(appError("Failed to fetch weather alerts.", 500));
  }
};

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

module.exports = { getWeather };
