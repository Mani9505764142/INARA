// src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminController");
const { requireAdminAuth } = require("../middleware/adminAuth");

// public
router.post("/login", adminLogin);

// protected (example)
router.get("/orders", requireAdminAuth, async (req, res) => {
  return res.json({
    success: true,
    message: "Protected orders endpoint. Replace with real handler."
  });
});

module.exports = router;
