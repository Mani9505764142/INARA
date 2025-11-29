// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// attach token on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kanha_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
