// src/components/FooterNewsletter.jsx
import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const endpoint = "https://formspree.io/f/xpwnzyae";

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ type: "error", message: "Enter a valid email." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setEmail("");
        setStatus({ type: "success", message: "Subscribed!" });
      } else setStatus({ type: "error", message: "Failed." });
    } catch {
      setStatus({ type: "error", message: "Network error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 0, display: "flex", flexDirection: "column", gap: 0.4 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0, fontSize: 14 }}>Join our newsletter</Typography>
      <Typography color="text.secondary" sx={{ mb: 0, fontSize: 12 }}>Get updates on new designs.</Typography>

      <Box component="form" onSubmit={submit} sx={{ display: "flex", gap: 1, alignItems: "center", flexDirection: { xs: "column", sm: "row" } }}>
        <TextField
          placeholder="your@email.com"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ flex: { xs: "1 1 auto", sm: "0 0 220px" }, "& .MuiInputBase-root": { py: 0.4 }, "& fieldset": { borderRadius: 4 } }}
        />

        <Button type="submit" variant="contained" size="small" disabled={loading} sx={{ minWidth: 84, px: 1.2, height: 34, backgroundColor: "#7e2626", "&:hover": { backgroundColor: "#6a1f1f" } }}>
          {loading ? "..." : "Subscribe"}
        </Button>
      </Box>

      {status && <Alert severity={status.type} sx={{ mt: 0.6, fontSize: 12, py: 0.3 }}>{status.message}</Alert>}
    </Box>
  );
}
