const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const propertyRoutes = require("./routes/propertyRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Property API routes
app.use("/api/properties", propertyRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Kora Property Service is running"
  });
});

const PORT = process.env.PORT || 5002;

// Start server only after MongoDB connects
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Property Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();