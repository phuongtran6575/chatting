import axios from "axios";

export const axiosAPI = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAPI.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
    console.log("Access token FE gửi:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosAPI.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);
