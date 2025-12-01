import axios from "axios";

const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, ""); 
// removes trailing slash if user added it accidentally

const api = axios.create({
  baseURL: `${API}/api`,
  timeout: 30000, // give Render enough time (cold start)
});

export default api;
