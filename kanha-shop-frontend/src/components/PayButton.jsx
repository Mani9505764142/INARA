import React from "react";

export default function PayButton({ amountPaise = 50000, productName = "Kanha Shop Item" }) {
  const pay = async () => {
    try {
      // 1) create order on server
      const resp = await fetch(`${process.env.REACT_APP_API_BASE}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountPaise })
      });

      if (!resp.ok) throw new Error("Order creation failed");
      const { order, key_id } = await resp.json();

      // 2) open Razorpay Checkout
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Kanha Shop Demo",
        description: productName,
        order_id: order.id,
        handler: async function (response) {
          // 3) verify signature
          const verify = await fetch(`${process.env.REACT_APP_API_BASE}/api/payment/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          });

          const result = await verify.json();

          if (result.ok) {
            alert("Payment verified — " + response.razorpay_payment_id);
            window.location.href = `/payment-success?order=${order.id}&payment=${response.razorpay_payment_id}`;
          } else {
            alert("Verification failed: " + (result.error || "Unknown error"));
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: { color: "#2563eb" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment error: " + err.message);
    }
  };

  return (
    <button onClick={pay} className="btn btn-primary">
      Pay ₹{(amountPaise / 100).toFixed(2)}
    </button>
  );
}
