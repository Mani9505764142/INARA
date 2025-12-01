// src/controllers/adminController.js
const jwt = require("jsonwebtoken");

// Optional: existing token-returning login (keeps backward compatibility)
exports.adminLogin = async (req, res) => {
  try {
    const username = (req.body.username || "").trim();
    const password = (req.body.password || "").trim();

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Server misconfigured: admin creds or JWT_SECRET missing",
      });
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ role: "admin", username: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ success: true, token });
  } catch (err) {
    console.error("adminLogin error:", err);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// NEW: Cookie-based login handler (HttpOnly cookie)
exports.adminLoginCookie = async (req, res) => {
  try {
    const username = (req.body.username || "").trim();
    const password = (req.body.password || "").trim();

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Server misconfigured: admin creds or JWT_SECRET missing",
      });
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ role: "admin", username: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({ success: true, message: "Logged in" });
  } catch (err) {
    console.error("adminLoginCookie error:", err);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// Optional: logout that clears cookie
exports.adminLogout = async (req, res) => {
  try {
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (err) {
    console.error("adminLogout error:", err);
    return res.status(500).json({ success: false, message: "Server error during logout" });
  }
};
