import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://vue-todolist-backend.onrender.com',
});

api.interceptors.request.use(config => {
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) {
    config.headers.Authorization = `Bearer ${sessionId}`;
  }
  return config;
}, error => Promise.reject(error));

export default api;
