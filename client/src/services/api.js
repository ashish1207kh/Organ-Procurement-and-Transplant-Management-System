import axios from 'axios';

// Get backend API URL from environment variable or fallback to production backend / local dev
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // If running on local development (localhost:5173), target local Express backend port 5000
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  // In production (Render/Vercel deployment), target the deployed Render backend service
  return 'https://organ-procurement-and-transplant.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token to Authorization Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('optm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized / Expired Tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('optm_token');
      localStorage.removeItem('optm_user');
      localStorage.removeItem('optm_profile');
    }
    return Promise.reject(error);
  }
);

export default api;
