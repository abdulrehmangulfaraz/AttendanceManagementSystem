import axios from 'axios';

// Use environment variable for the API URL
// If VITE_API_URL is set (in Vercel), use it. Otherwise use localhost.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5047/api';

const api = axios.create({
    baseURL: baseURL
});

// Automatically attach JWT Token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;