const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://127.0.0.1:5001";

const PROPERTY_SERVICE_URL =
  process.env.PROPERTY_SERVICE_URL || "http://127.0.0.1:5002";

const RENTAL_SERVICE_URL =
  process.env.RENTAL_SERVICE_URL || "http://127.0.0.1:5003";


// USER SERVICE
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/api/auth${path}`
  })
);


// PROPERTY SERVICE
app.use(
  "/api/properties",
  createProxyMiddleware({
    target: PROPERTY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/api/properties${path}`
  })
);


// RENTAL SERVICE
app.use(
  "/api/rentals",
  createProxyMiddleware({
    target: RENTAL_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/api/rentals${path}`
  })
);


// TEST ROUTE
app.get("/", (req, res) => {
  res.json({
    message: "Kora API Gateway is running"
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);

  console.log("User Service:", USER_SERVICE_URL);
  console.log("Property Service:", PROPERTY_SERVICE_URL);
  console.log("Rental Service:", RENTAL_SERVICE_URL);
});