import axios from "axios";
import { getToken } from "./authService";

const createApiInstance = (baseURL = "http://localhost:3001/") => {
  const api = axios.create({
    baseURL: baseURL,
  });

  api.interceptors.request.use(
    (config) => {
      const token = getToken(); 
      console.log("Token para requisição:", token); 

      if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
};

export default createApiInstance;
