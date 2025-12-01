// src/middleware/adminAuth.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("⚠ WARNING: JWT_SECRET is not set. Token validation will not be secure.");
}

exports.requireAdminAuth = (req, res, next) => {
  try {
    let token = null;

    // 1) Check Authorization header
    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }

    // 2) If no header token → check cookie
    if (!token && req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Missing authentication token",
      });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (!payload || payload.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: admin access only",
      });
    }

    req.admin = payload; // attach admin info
    next();
  } catch (err) {
    console.error("AdminAuth Error:", err);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

