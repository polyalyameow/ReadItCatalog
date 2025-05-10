import axios from "axios";

const API_URL = "http://localhost:8080/api/";


const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 &&
      originalRequest?.url !== "/auth/login") {
      localStorage.removeItem("token");
      localStorage.setItem("sessionExpired", "true");
    }
    return Promise.reject(error);
  }
);


export default api;
