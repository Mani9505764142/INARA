// src/app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// ROUTES – all inside src/routes
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// CORS: allow credentials and only your frontends
app.use(cors({
  origin: [
    "https://inara-shop.netlify.app",
    "https://inara-admin.netlify.app"
  ],
  credentials: true
}));

// Body parsing + cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes (mounted under /api in server.js)
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", paymentRoutes);

// Simple health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
