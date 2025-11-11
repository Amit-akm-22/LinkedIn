
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://linkedin-backend-k3cs.onrender.com/api/v1",
  withCredentials: true,
});
