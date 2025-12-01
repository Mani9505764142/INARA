import axios from "axios";

/**
 * Resolve API base URL:
 * - If VITE_API_URL is set (e.g. during dev or CI) use it (trim trailing slashes).
 * - Otherwise use relative '/api' so same-origin deployments (Netlify + Render proxied calls)
 *   work without needing a build-time env var.
 */
const raw = (import.meta.env.VITE_API_URL || "").toString().trim();
const apiRoot = raw ? raw.replace(/\/+$/, "") : ""; // remove trailing slash(es)
const baseURL = apiRoot ? `${apiRoot}/api` : "/api";

const api = axios.create({
  baseURL,
  timeout: 30000, // long enough for cold backends
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default api;
