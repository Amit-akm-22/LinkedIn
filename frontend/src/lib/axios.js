import axios from "axios";

export const axiosInstance = axios.create({
  // Backend Render API base URL
  baseURL: import.meta.env.VITE_API_URL || "https://linkedin-backend-k3cs.onrender.com/api/v1",
  withCredentials: true, // Include cookies for auth
});
