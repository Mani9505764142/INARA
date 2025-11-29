// src/pages/ReturnPolicy.jsx
import React from "react";
import { Container, Typography, Box } from "@mui/material";

export default function ReturnPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Return Policy
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="body1">
          We want you to love your Kanha Creations purchase. If there is any
          issue with your order, please contact us within <strong>2 days</strong> of
          delivery.
        </Typography>

        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          1. Items eligible for return
        </Typography>
        <Typography variant="body2">
          • Only unused items in their original condition and packaging. <br />
          • Custom or personalized products are usually <strong>not</strong> eligible
          unless they arrived damaged or incorrect.
        </Typography>

        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          2. How to request a return
        </Typography>
        <Typography variant="body2">
          • Email us at <strong>mahithat4@gmail.com</strong> or WhatsApp{" "}
          <strong>+91 8500162758</strong>. <br />
          • Please include your <strong>Order ID</strong>, product name and
          photos of the issue (if damaged/incorrect item).
        </Typography>

        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          3. Refund / replacement
        </Typography>
        <Typography variant="body2">
          • After we review your request, we’ll confirm if it qualifies for a{" "}
          refund, replacement, or store credit. <br />
          • Refunds (if approved) are processed to the original payment method.
        </Typography>

        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          4. Shipping costs
        </Typography>
        <Typography variant="body2">
          • Original shipping charges are non-refundable. <br />
          • Return pickup / courier charges may apply depending on the case.
        </Typography>

        <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
          For any questions, just contact us – we prefer to solve issues
          personally rather than hide behind policy text.
        </Typography>
      </Box>
    </Container>
  );
}
