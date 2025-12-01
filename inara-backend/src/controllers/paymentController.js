// src/controllers/paymentController.js
const crypto = require("crypto");
const razorpay = require("../config/razorpay");

const toNumber = (v) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.trim());
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
};

exports.createOrder = async (req, res) => {
  try {
    let { amount } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({ error: "Amount required (in rupees or paise)" });
    }

    // Accept either paise (e.g. 84000) OR rupees (e.g. 840).
    // Heuristic: if value > 1000 assume it's already paise; otherwise assume rupees.
    const n = toNumber(amount);
    if (!Number.isFinite(n) || n <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Convert to paise if it looks like rupees (<= 100000 maybe rupees)
    let amountInPaise = n;
    if (n < 1000) {
      // treat as rupees
      amountInPaise = Math.round(n * 100);
    } else {
      // probably already in paise
      amountInPaise = Math.round(n);
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID || null
    });
  } catch (err) {
    console.error("createOrder failed:", err && (err.stack || err.message || err));
    return res.status(500).json({ error: err && err.message ? err.message : "Order creation failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ ok: false, error: "Missing params" });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");
    if (expected === razorpay_signature) return res.json({ ok: true });
    return res.status(400).json({ ok: false, error: "Invalid signature" });
  } catch (err) {
    console.error("verifyPayment failed:", err && (err.stack || err.message || err));
    return res.status(500).json({ error: err && err.message ? err.message : "Verification failed" });
  }
};
