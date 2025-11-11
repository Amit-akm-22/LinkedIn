import axios from "axios";

export const axiosInstance = axios.create({
  // ✅ Direct backend API base URL (Render)
  baseURL: "https://linkedin-backend-k3cs.onrender.com/api/v1",
  withCredentials: true, // Include cookies for authentication
});

