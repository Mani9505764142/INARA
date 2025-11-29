// src/controllers/adminController.js
const jwt = require("jsonwebtoken");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "kanhaadmin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "StrongAdmin@123";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // simple single-admin check
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        role: "admin",
        username: ADMIN_USERNAME,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
