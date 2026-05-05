import axios from "axios";
import { getToken, removeToken } from "./token";

// Request interceptor to add token to Authorization header
axios.interceptors.request.use(
  (config) => {
    // Get token from sessionStorage/localStorage
    const token = getToken();
    
    // Add token to Authorization header if it exists
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Always include credentials for cookies (if backend uses them)
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If unauthorized, clear token
    if (error.response?.status === 401 || error.response?.status === 403) {
      removeToken();
      
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login" && 
          window.location.pathname !== "/sign-up" &&
          window.location.pathname !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axios;

