// src/controllers/adminController.js
const jwt = require("jsonwebtoken");

// FAIL FAST: ensure required env vars exist in production
if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  // In non-production you might allow defaults, but in production we must insist.
  console.warn(
    "WARNING: ADMIN_USERNAME or ADMIN_PASSWORD not set in environment. " +
      "Set them on your host (Render) immediately."
  );
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

exports.adminLogin = async (req, res) => {
  try {
    const username = (req.body.username || "").trim();
    const password = (req.body.password || "").trim();

    // Use env values directly so they can be rotated without code changes
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    // If envs are missing, reject login (prevents fallback to unsafe defaults)
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      return res.status(500).json({
        success: false,
        message:
          "Server misconfiguration: admin credentials not configured. Contact admin.",
      });
    }

    // simple single-admin check
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        role: "admin",
        username: ADMIN_USERNAME,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // consistent response shape
    return res.json({ success: true, token });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
};

