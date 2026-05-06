import axios from 'axios';

// Single Axios instance used by all components.
// Automatically attaches the JWT token to every request.
const api = axios.create({
  baseURL: '/api',  // Uses the Next.js proxy rewrite in dev; direct URL in prod
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000  // 30s timeout for AI endpoints
});

// Request interceptor: attach Bearer token from localStorage before every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('lms_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-redirect to /login if token expires
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lms_token');
        localStorage.removeItem('lms_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
