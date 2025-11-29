// src/pages/OrderSuccess.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function OrderSuccessPage() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          bgcolor: "#fffaf3",
          boxShadow: 2,
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ fontSize: 64, color: "success.main", mb: 2 }}
        />
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>
          Order placed!
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Thank you for ordering from Inara Creations.
        </Typography>

        {orderId && (
          <Typography sx={{ mb: 3 }}>
            Your order ID: <strong>{orderId}</strong>
          </Typography>
        )}

        <Typography color="text.secondary" sx={{ mb: 4, fontSize: 14 }}>
          Our team will contact you on WhatsApp / Phone to confirm the order and
          delivery time.
        </Typography>

        <Button
          component={Link}
          to="/"
          variant="contained"
          sx={{ mb: 1 }}
          fullWidth
        >
          Back to home
        </Button>

        <Button
          component={Link}
          to="/product"
          variant="outlined"
          fullWidth
        >
          Continue shopping
        </Button>
      </Box>
    </Container>
  );
}
