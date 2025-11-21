import axios from "axios";

// ✅ Replace with your ACTUAL Render backend URL
export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:5000/api/v1" 
    : "https://linkedin-backend-f1os.onrender.com/api/v1", // ⚠️ Replace with your actual URL
  withCredentials: true, // ✅ MUST be true to send cookies cross-origin
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 and we're not already on login page, redirect
    if (error.response?.status === 401 && !window.location.pathname.includes("/login")) {
      console.log("❌ 401 Unauthorized - redirecting to login");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
