// src/middleware/adminAuth.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("⚠ JWT_SECRET is not set in environment. Admin auth will use a weak fallback.");
}

exports.requireAdminAuth = (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

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
    return next();
  } catch (err) {
    console.error("Admin auth error:", err);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
