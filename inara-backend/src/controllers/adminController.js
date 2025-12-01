// src/controllers/adminController.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

exports.adminLogin = async (req, res) => {
  try {
    const username = (req.body.username || "").trim();
    const password = (req.body.password || "").trim();

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: "Admin credentials not configured on server.",
      });
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { role: "admin", username: ADMIN_USERNAME },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ success: true, token });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during admin login",
    });
  }
};
