// src/controllers/paymentController.js
const crypto = require("crypto");
const razorpay = require("../config/razorpay");

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) return res.status(400).json({ error: "Amount required (in paise)" });

    const options = { amount: Number(amount), currency: "INR", receipt: `rcpt_${Date.now()}`, payment_capture: 1 };
    const order = await razorpay.orders.create(options);
    return res.json({ order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("Order Error:", err);
    return res.status(500).json({ error: "Order creation failed" });
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
    console.error("Verify Error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
};
