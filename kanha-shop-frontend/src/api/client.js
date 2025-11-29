import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change to live URL after deploy
});

export default api;
