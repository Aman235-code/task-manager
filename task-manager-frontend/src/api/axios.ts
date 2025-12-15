import axios from "axios";

// Base URL of your backend API
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // to send HttpOnly cookies for JWT
});

// Optional: Interceptors for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
