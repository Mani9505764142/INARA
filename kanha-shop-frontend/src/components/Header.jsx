import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { getCount, setOpen } = useCart();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "6px solid #7e2626" }}
    >
      {/* Keep container alignment consistent across the site */}
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between", px: 0 }}>
          
          {/* Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link
              component={RouterLink}
              to="/"
              underline="none"
              sx={{ display: "inline-block" }}
              title="INARA — Home"
              aria-label="Go to home"
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: "#7e2626",
                }}
              >
                INARA
              </Typography>
            </Link>
          </Box>

          {/* Cart */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => setOpen(true)}
              aria-label="Open cart"
              title="Open cart"
            >
              <Badge badgeContent={getCount()} color="secondary">
                <ShoppingCartIcon sx={{ color: "#7e2626" }} />
              </Badge>
            </IconButton>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
