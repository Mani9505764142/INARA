// src/components/Footer.jsx
import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#FCF6EE",
        color: "#222",
        mt: 8,
        pt: 6,
        pb: 3,
        overflowX: "hidden",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 4, md: 6 }, // IMPORTANT: aligns footer perfectly with product grid
          width: "100%",
          boxSizing: "border-box",
          mx: "auto",
        }}
      >
        <Grid container spacing={4}>
          {/* Left */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#7c1414" }}>
              INARA
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              hand made with love — handcrafted jewelry & traditional crafts.
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              {/* External social links left as anchors; replace href with real URLs */}
              <IconButton
                size="small"
                aria-label="Facebook"
                component="a"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                aria-label="Instagram"
                component="a"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                aria-label="Pinterest"
                component="a"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <PinterestIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Middle */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Shop
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              <Link
                component={RouterLink}
                to="/product"
                underline="none"
                color="inherit"
              >
                All products
              </Link>

              <Link
                component={RouterLink}
                to="/about"
                underline="none"
                color="inherit"
              >
                About us
              </Link>

              <Link
                component={RouterLink}
                to="/contact"
                underline="none"
                color="inherit"
              >
                Contact
              </Link>

              <Link
                component={RouterLink}
                to="/terms"
                underline="none"
                color="inherit"
              >
                Terms & Conditions
              </Link>
            </Box>
          </Grid>

          {/* Right */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Join our newsletter
            </Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>
              Get updates on new designs.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder="your@email.com"
                sx={{
                  flex: "1 1 200px",
                  minWidth: 0,
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
                inputProps={{ "aria-label": "newsletter email" }}
              />

              <Button
                variant="contained"
                sx={{
                  whiteSpace: "nowrap",
                  bgcolor: "#7c1414",
                  "&:hover": { bgcolor: "#6a0f0f" },
                }}
              >
                SUBSCRIBE
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Customer care
            </Typography>

            <Typography variant="body2">mahithat4@gmail.com</Typography>
            <Typography variant="body2">+91 8500162758</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 4 }} />

        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2">© 2025 INARA — hand made with love.</Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Link
              component={RouterLink}
              to="/privacy"
              underline="none"
              color="inherit"
            >
              Privacy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              underline="none"
              color="inherit"
            >
              Terms
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
