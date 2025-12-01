// src/api/client.js
import axios from "axios";

// Backend API base URL comes from Netlify build env
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // CRITICAL — send & receive cookies
  timeout: 15000,
});

// Optional: normalize axios error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Network or server error";
    return Promise.reject({ ...error, message: msg });
  }
);

export default api;
