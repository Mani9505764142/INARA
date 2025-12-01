// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

import api from "../api/client";
import { useCart } from "../context/CartContext";

const SHIPPING_FEE = 40; // flat shipping

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsTotal =
    items?.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.qty || 0)), 0) || 0;
  const shippingFee = items && items.length > 0 ? SHIPPING_FEE : 0;
  const total = Number((itemsTotal + shippingFee).toFixed(2)); // rupees, number

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openRazorpayAndPay = async ({ orderDbId, rpOrder, key_id, customer }) => {
    if (!rpOrder || !key_id) {
      throw new Error("Missing payment order or key from server");
    }
    if (!window.Razorpay) {
      throw new Error(
        "Razorpay SDK not loaded. Ensure <script src='https://checkout.razorpay.com/v1/checkout.js'></script> is present in public/index.html"
      );
    }

    return new Promise((resolve) => {
      try {
        const options = {
          key: key_id,
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          name: "INARA",
          description: `INARA — Order ${orderDbId || ""}`,
          order_id: rpOrder.id,
          handler: async function (response) {
            try {
              setLoading(true);
              const verifyResp = await api.post("/payment/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              const verifyData = verifyResp.data || verifyResp;
              if (verifyResp.status === 200 && verifyData && verifyData.ok) {
                // Optionally pick returned orderId
                const finalOrderId = verifyData.orderId || orderDbId;
                clearCart();
                setLoading(false);
                navigate("/order-success", { state: { orderId: finalOrderId } });
                resolve({ ok: true });
                return;
              }

              // if verify returned non-ok
              console.error("Payment verification failed:", verifyData);
              setLoading(false);
              alert("Payment verification failed. Contact support.");
              resolve({ ok: false });
            } catch (err) {
              console.error("Post-payment finalize error:", err);
              setLoading(false);
              alert("Payment processed but finalization failed. Contact support.");
              resolve({ ok: false });
            }
          },
          prefill: {
            name: customer?.customerName || "",
            email: customer?.email || "",
            contact: customer?.phone || "",
          },
          theme: { color: "#0f172a" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (err) => {
          console.error("Payment failed:", err);
          alert("Payment failed: " + (err.error?.description || "Unknown"));
          setLoading(false);
          resolve({ ok: false });
        });
        rzp.open();
      } catch (err) {
        console.error("openRazorpay error:", err);
        setLoading(false);
        resolve({ ok: false, error: err });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!items || items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!form.customerName || !form.phone || !form.address || !form.pincode) {
      setError("Please fill all required fields.");
      return;
    }

    const itemsPayload = items.map((item) => ({
      productId: item.id,
      title: item.title,
      quantity: Number(item.qty || 0),
      price: Number(item.price || 0),
    }));

    // payload must include amount (in rupees), subtotal, total, shippingFee
    const payload = {
      items: itemsPayload,
      customerName: form.customerName,
      phone: form.phone,
      address: form.address,
      pincode: form.pincode,
      paymentMethod: "ONLINE",
      paymentStatus: "PENDING",
      shippingFee: Number(shippingFee),
      subtotal: Number(itemsTotal),
      total: Number(total),
      amount: Number(total), // server expects amount
    };

    try {
      setLoading(true);

      const resp = await api.post("/payment/create-order", payload, {
        headers: { "Content-Type": "application/json" },
      });

      // handle axios response vs fetch-like
      const data = resp && resp.data ? resp.data : resp;
      if (!resp || (resp.status && resp.status >= 400)) {
        // server returned an error code (axios throws for 4xx/5xx, but leave defensive)
        const msg = (data && data.error) || "Server error creating order";
        throw new Error(msg);
      }

      // server success shape expected: { success: true, orderId, order, key_id }
      const orderDbId = data.orderId || data._id || (data.order && data.order._id) || null;
      const rpOrder = data.order || null;
      const key_id = data.key_id || data.keyId || data.key || null;

      if (!rpOrder || !key_id || !orderDbId) {
        console.error("Unexpected create-order response:", data);
        throw new Error("Failed to create payment order on server");
      }

      // open Razorpay and finalize
      await openRazorpayAndPay({ orderDbId, rpOrder, key_id, customer: form });
    } catch (err) {
      console.error("Checkout error:", err);
      // if axios error shape contains response with JSON, prefer that message
      const message =
        err && err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : err.message || "Something went wrong while placing your order.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 800 }}>
        Checkout
      </Typography>

      <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Order summary
          </Typography>

          {(!items || items.length === 0) && (
            <Typography color="text.secondary">Your cart is empty.</Typography>
          )}

          {items && items.length > 0 && (
            <>
              {items.map((item) => (
                <Box
                  key={item.id}
                  sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
                >
                  <Typography>
                    {item.title} × {item.qty}
                  </Typography>
                  <Typography>₹{item.price * item.qty}</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography>Subtotal</Typography>
                <Typography>₹{itemsTotal}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography>Shipping</Typography>
                <Typography>₹{shippingFee}</Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <Typography>Total</Typography>
                <Typography>₹{total}</Typography>
              </Box>
            </>
          )}
        </Box>

        <Divider />

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delivery details
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Full name"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth required />
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              multiline
              minRows={3}
              fullWidth
              required
            />
            <TextField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} fullWidth required />
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading || !items || items.length === 0}>
            {loading ? "Processing..." : `Confirm & Pay ₹${total.toFixed(2)}`}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
