// src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminController");
const { verifyAdmin } = require("../middleware/authMiddleware");

// public
router.post("/login", adminLogin);

// example protected route (replace getOrders with your actual handler)
router.get("/orders", verifyAdmin, async (req, res) => {
  // If you already have a controller to fetch orders, replace this inline handler:
  // return getOrders(req, res);
  return res.json({ success: true, message: "Protected orders endpoint. Replace with real handler." });
});

module.exports = router;
