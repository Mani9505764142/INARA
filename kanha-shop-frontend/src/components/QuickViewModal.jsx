// src/components/QuickViewModal.jsx
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

export default function QuickViewModal({ open, onClose, product, onAdd }) {
  if (!product) return null;

  const { title, price, image, description } = product;

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 5 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <Box sx={{ flex: "0 0 48%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box
              component="img"
              src={image}
              alt={title}
              sx={{ width: "100%", height: { xs: 220, sm: 240 }, objectFit: "cover", borderRadius: 1 }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Price:</strong> ₹{price}
            </Typography>

            {description ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {description}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No description available.
              </Typography>
            )}

            {/* Optional extra details could go here */}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onAdd && onAdd();
            onClose && onClose();
          }}
        >
          Add to cart
        </Button>
      </DialogActions>
    </Dialog>
  );
}
