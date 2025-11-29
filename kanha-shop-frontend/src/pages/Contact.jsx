// src/pages/Contact.jsx
import React, { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const WHATSAPP_NUMBER = "+918500162758"; // international format
const DISPLAY_NUMBER = "+91 85001 62758";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const openWhatsApp = () => {
    // Prefilled message — keeps it short and professional
    const message = encodeURIComponent(
      "Hi INARA — I want a custom design / colour. Please assist."
    );
    // Use wa.me which works in web and mobile
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${message}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback: prompt
      // eslint-disable-next-line no-alert
      alert(`Please copy this number: ${DISPLAY_NUMBER}`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 6, md: 8 },
        display: "flex",
        alignItems: "start",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            mb: 1,
            color: "primary.main",
          }}
        >
          Contact us
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          For quick responses and custom design requests, please contact our
          specialised design team on WhatsApp only. We respond faster there.
        </Typography>

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            p: { xs: 3, md: 4 },
            backdropFilter: "blur(4px)",
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>WhatsApp</Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {DISPLAY_NUMBER}
            </Typography>

            <Typography sx={{ fontSize: 13, color: "text.secondary", maxWidth: 560 }}>
              Send us a short message describing your custom requirement (design,
              colour, quantity) and our design team will reply with feasibility,
              ETA and pricing.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              onClick={openWhatsApp}
              sx={{
                textTransform: "none",
                background: "linear-gradient(180deg, #25D366 0%, #16A34A 100%)",
                "&:hover": { filter: "brightness(0.95)" },
                px: 3,
                py: 1.2,
                fontWeight: 700,
              }}
            >
              Message on WhatsApp
            </Button>

            <Tooltip title="Copy number">
              <IconButton
                aria-label="Copy WhatsApp number"
                onClick={copyNumber}
                sx={{
                  border: "1px solid rgba(0,0,0,0.06)",
                  bgcolor: "transparent",
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        <Snackbar
          open={copied}
          message="WhatsApp number copied to clipboard"
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          autoHideDuration={2000}
          onClose={() => setCopied(false)}
        />
      </Container>
    </Box>
  );
}
