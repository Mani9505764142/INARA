// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  
  withCredentials: true,                  // IMPORTANT for cookies
  timeout: 20000                          // increase timeout for render
});

export default api;
