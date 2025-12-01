// src/middleware/adminAuth.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("⚠ WARNING: JWT_SECRET is not set in environment. Using fallback.");
}

exports.requireAdminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "Missing auth token" });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET || "dev-secret");
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    if (!payload || payload.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    req.admin = payload;
    next();
  } catch (err) {
    console.error("Admin auth error:", err.message);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
