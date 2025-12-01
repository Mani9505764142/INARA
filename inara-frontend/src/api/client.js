import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  // Example: "https://inara-sazc.onrender.com/api"
  timeout: 15000,
  withCredentials: false
});

export default api;
