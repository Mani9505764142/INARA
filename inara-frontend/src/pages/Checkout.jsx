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

  // subtotal, shipping, total
  const itemsTotal =
    items?.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0) ||
    0;
  const shippingFee = items && items.length > 0 ? SHIPPING_FEE : 0;
  const total = itemsTotal + shippingFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Opens Razorpay checkout and handles responses.
  const openRazorpayAndPay = async ({ orderDbId, amountPaise, customer }) => {
    try {
      // 2) create razorpay order via backend
      const payOrderResp = await api.post(
        "/payment/create-order",
        { amount: amountPaise },
        { headers: { "Content-Type": "application/json" } }
      );

      const { order, key_id } = payOrderResp.data || payOrderResp; // support axios or fetch shapes
      if (!order || !key_id) throw new Error("Failed to create payment order");

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK not loaded. Ensure <script src='https://checkout.razorpay.com/v1/checkout.js'></script> is present in public/index.html"
        );
      }

      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        // Brand shown in the Razorpay modal header — changed to INARA
        name: "INARA",
        // Short description that appears under the name
        description: `INARA — Order ${orderDbId || ""}`,
        // Optional: add an image/logo URL if you have one (uncomment and set your URL)
        // image: "https://your-cdn.com/path/to/inara-logo.png",
        order_id: order.id, // razorpay order id
        handler: async function (response) {
          // called when payment succeeds
          try {
            setLoading(true);
            // 4) verify on server
            const verifyResp = await api.post("/payment/verify-payment", response);
            const verifyResult = verifyResp.data || verifyResp;

            if (verifyResult && verifyResult.ok) {
              // 5) patch your DB order as paid (new endpoint)
              if (orderDbId) {
                await api.patch(`/orders/${orderDbId}/pay`, {
                  paymentId: response.razorpay_payment_id,
                  paymentOrderId: response.razorpay_order_id,
                  paymentSignature: response.razorpay_signature,
                  paymentStatus: "PAID",
                });
              }

              clearCart();
              navigate("/order-success", { state: { orderId: orderDbId || "" } });
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Post-payment finalize error:", err);
            alert("Payment processed but finalization failed. Contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: customer?.customerName || "",
          email: customer?.email || "",
          contact: customer?.phone || "",
        },
        theme: {
          color: "#0f172a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (err) => {
        console.error("Payment failed:", err);
        alert("Payment failed: " + (err.error?.description || "Unknown"));
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("openRazorpay error:", err);
      setLoading(false);
      throw err;
    }
  };

  // Submit (create DB order first -> open Razorpay)
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
      quantity: item.qty,
      price: item.price,
    }));

    // IMPORTANT: use uppercase enum values (backend expects PENDING/PAID/etc)
    const payload = {
      items: itemsPayload,
      customerName: form.customerName,
      phone: form.phone,
      address: form.address,
      pincode: form.pincode,
      paymentMethod: "ONLINE",
      paymentStatus: "PENDING", // <-- correct enum
      shippingFee,
      subtotal: itemsTotal,
      total: total,
    };

    try {
      setLoading(true);

      // 1) create order record on server (status: PENDING)
      const res = await api.post("/orders", payload);
      const created = res.data || res;
      // try to pick different shapes returned by different implementations
      const orderDbId =
        created.orderId || created._id || created.id || (created.order && created.order._id);

      if (!orderDbId) {
        console.error("Unexpected order create response:", created);
        throw new Error("Failed to create order on server");
      }

      // amount in paise (integer)
      const amountPaise = Math.round(Number(total) * 100);

      // 2..n) open Razorpay -> verify -> finalize
      await openRazorpayAndPay({ orderDbId, amountPaise, customer: form });
      // finish handled by handler
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Something went wrong while placing your order.");
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
            <TextField label="Full name" name="customerName" value={form.customerName} onChange={handleChange} fullWidth required />
            <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth required />
            <TextField label="Address" name="address" value={form.address} onChange={handleChange} multiline minRows={3} fullWidth required />
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
