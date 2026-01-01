import axios from 'axios';

// 1. Set the Base URL (Matches your .NET launchSettings.json)
const api = axios.create({
    baseURL: 'http://localhost:5047/api' 
});

// 2. Automatically attach JWT Token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;