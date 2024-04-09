import { useAuth } from "@/services/auth";
import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 2000,
})

const { session } = useAuth();
http.interceptors.request.use((config) => {
  if (session.value) {
    config.headers.Authorization = `Bearer ${session.value.access_token}`;
  }

  return config;
})
