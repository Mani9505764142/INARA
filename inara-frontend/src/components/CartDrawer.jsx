// src/components/CartDrawer.jsx
import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    open,
    setOpen,
    items,
    removeItem,
    updateQty,
    getSubtotal,
    SHIPPING_CHARGE,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  // totals
  const subtotal = typeof getSubtotal === "function" ? Number(getSubtotal()) || 0 : 0;
  const shipping = items.length > 0 ? SHIPPING_CHARGE : 0;
  const total = subtotal + shipping;

  const handleQtyChange = (id, value) => {
    const qty = Number(value);
    if (!qty || qty < 1) {
      updateQty(id, 1);
      return;
    }
    updateQty(id, Math.floor(qty));
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setOpen(false);          // close drawer
    navigate("/checkout");   // go to checkout page
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          width: { xs: 320, sm: 420 },
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h6">Your cart</Typography>
          <IconButton onClick={() => setOpen(false)} aria-label="Close cart">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Box sx={{ flex: 1, overflow: "auto" }}>
          {items.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Your cart is empty.
            </Typography>
          ) : (
            <List>
              {items.map((it) => (
                <ListItem key={it.id} sx={{ alignItems: "flex-start" }}>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={it.image}
                      alt={it.title}
                      sx={{
                        width: 64,
                        height: 64,
                        mr: 1,
                        bgcolor: "background.paper",
                      }}
                    />
                  </ListItemAvatar>

                  <Box sx={{ flex: 1 }}>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 700 }}>
                          {it.title}
                        </Typography>
                      }
                      secondary={
                        <Typography color="text.secondary">
                          ₹{it.price}
                        </Typography>
                      }
                    />

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mt: 1,
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        type="number"
                        inputProps={{ min: 1 }}
                        size="small"
                        value={it.qty}
                        onChange={(e) =>
                          handleQtyChange(it.id, e.target.value)
                        }
                        sx={{ width: 96 }}
                      />
                      <Button color="inherit" onClick={() => removeItem(it.id)}>
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Totals */}
        <Box sx={{ px: 0, py: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1">Subtotal</Typography>
            <Typography variant="subtitle1">
              ₹{subtotal.toFixed(0)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Shipping
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {shipping > 0 ? `₹${shipping}` : "Free"}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Total
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ₹{total.toFixed(0)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            Checkout
          </Button>

          <Button variant="outlined" fullWidth onClick={() => clearCart()}>
            Clear cart
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
