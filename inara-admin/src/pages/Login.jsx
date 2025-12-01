// src/pages/Login.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // cookie-based login endpoint (server sets HttpOnly cookie)
      const res = await api.post("/admin/login-cookie", { username, password });

      // if server responded non-OK, axios will throw — but double-check:
      if (res.data?.success) {
        // onLogin can be used to update parent state (optional)
        if (typeof onLogin === "function") onLogin();

        // navigate to admin dashboard
        navigate("/admin/dashboard");
      } else {
        // show server-provided message if any
        throw new Error(res.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Network or server error";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Kanha Admin Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Username"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
