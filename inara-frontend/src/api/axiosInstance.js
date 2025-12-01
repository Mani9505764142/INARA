// src/api/axiosInstance.js
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "https://inara-sazc.onrender.com";

const http = axios.create({
  baseURL: API,
  timeout: 15000,
  withCredentials: true, // remove if you don't use cookies
});

export default http;
