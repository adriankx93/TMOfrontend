import axios from "axios";

// Create API instance with timeout and better error handling
const API = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api',
  timeout: 5000, // 5 second timeout
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add response interceptor for better error handling
API.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.log('API request timeout - backend may not be running');
    } else if (error.code === 'ERR_NETWORK') {
      console.log('Network error - backend may not be running');
    }
    return Promise.reject(error);
  }
);

export default API;
