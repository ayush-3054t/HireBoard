import axios from "axios";

export const API_BASE_URL =
  "https://hireboard-o33f.onrender.com";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://hireboard-o33f.onrender.com/api",

  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
