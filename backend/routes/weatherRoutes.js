const express = require("express");
const { getWeather } = require("../controllers/weatherController");

const weatherRoutes = express.Router();

weatherRoutes.post("/alerts", getWeather);

module.exports = weatherRoutes;
