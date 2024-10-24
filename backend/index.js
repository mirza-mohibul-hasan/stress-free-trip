require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");

const globalErrHandle = require("./middlewares/globalErrHandle");
const authRoutes = require("./routes/authRoutes");
require("./config/dbConnector");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Session
app.use(
  session({
    key: "key",
    secret: "stress-free-trip",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 300000,
    },
  })
);

//Authentication
app.use("/api/v1/auth", authRoutes);

// For error handling
app.use(globalErrHandle);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
