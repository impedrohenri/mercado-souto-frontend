import axios from "axios";
import { URL_API } from "@/api/index.routes";

export const axiosInterceptor = axios.create({
  baseURL: URL_API,
});


axiosInterceptor.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user@token"))
        ?.split("=")[1];
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log("Request config:", token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInterceptor.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      
    }
    return Promise.reject(error);
  }
);
