import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // This sends cookies automatically
});

// Remove the token interceptor since we're using cookies now
// The browser will automatically send the httpOnly cookie with every request