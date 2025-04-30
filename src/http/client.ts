import axios from "axios";
import { useAuthStore } from "../store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKENDAPI_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});
const refreshToken = async () => {
  await axios.post(`${import.meta.env.VITE_BACKENDAPI_URL}/auth/refresh`, {
    withCredentials: true,
  });
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        const headers = { ...originalRequest.headers };
        await refreshToken();
        return api.request({ ...originalRequest, headers });
      } catch (error) {
        console.error("Token refresh failed", error);
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
