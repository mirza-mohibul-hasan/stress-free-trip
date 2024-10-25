const express = require("express");
const generateItinerary = require("../controllers/itineraryController");

const itineraryRoutes = express.Router();

itineraryRoutes.post("/generate-itinerary", generateItinerary);

module.exports = itineraryRoutes;
