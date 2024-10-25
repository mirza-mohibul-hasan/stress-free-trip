require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");

const globalErrHandle = require("./middlewares/globalErrHandle");
const authRoutes = require("./routes/authRoutes");
require("./config/dbConnector");

const app = express();

app.use(cors({ credentials: true }));
app.use(express.json());

//Authentication
app.use("/api/v1/auth", authRoutes);

// For error handling
app.use(globalErrHandle);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
