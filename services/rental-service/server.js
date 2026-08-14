const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rentalRoutes = require("./routes/rentalRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rentals", rentalRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Kora Rental Service is running"
  });
});

const PORT = process.env.PORT || 5003;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Rental Service running on port ${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();