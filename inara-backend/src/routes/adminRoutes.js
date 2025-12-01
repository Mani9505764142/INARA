// src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const {
  adminLogin,        // optional token-returning login (keeps backward compatibility)
  adminLoginCookie,  // new cookie-based login
  adminLogout        // clears cookie
} = require("../controllers/adminController");

const { requireAdminAuth } = require("../middleware/adminAuth");

// PUBLIC - token-based login (optional)
router.post("/login", adminLogin);

// PUBLIC - cookie-based login (recommended)
router.post("/login-cookie", adminLoginCookie);

// PUBLIC - logout (clears cookie)
router.post("/logout", adminLogout);

// PROTECTED - example route; replace with real handlers
router.get("/orders", requireAdminAuth, async (req, res) => {
  return res.json({
    success: true,
    message: "Protected orders endpoint. Replace with real handler.",
  });
});

module.exports = router;
