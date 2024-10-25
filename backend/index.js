require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");

const globalErrHandle = require("./middlewares/globalErrHandle");
const authRoutes = require("./routes/authRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const blogRoutes = require("./routes/blogRoutes");
const imageRoutes = require("./routes/imageRoutes");
require("./config/dbConnector");

const app = express();

app.use(cors({ credentials: true }));
app.use(express.json());

//Authentication
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/itinerary", itineraryRoutes);
app.use("/api/v1/weather", weatherRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/images", imageRoutes);

// For error handling
app.use(globalErrHandle);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
