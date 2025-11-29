// src/hooks/useAuth.js
import { useEffect, useState } from "react";

const TOKEN_KEY = "kanha_admin_token";

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);

  const login = (newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return { token, login, logout, loading, setLoading };
}
