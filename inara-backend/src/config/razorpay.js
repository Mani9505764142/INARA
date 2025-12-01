// src/config/razorpay.js
const Razorpay = require("razorpay");

const id = process.env.RAZORPAY_KEY_ID || "";
const secret = process.env.RAZORPAY_KEY_SECRET || "";

if (!id || !secret) {
  console.warn("⚠️ Razorpay keys missing or empty in environment. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
} else {
  // safe masked log: shows partial id and lengths only (no full secret)
  console.log(`ℹ️ Razorpay key loaded: id=${id.slice(0,7)}... len=${id.length}, secret_len=${secret.length}`);
}

const razorpay = new Razorpay({
  key_id: id,
  key_secret: secret,
});

module.exports = razorpay;
