import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://vue-todolist-backend.onrender.com',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) {
    config.headers.Authorization = `Session ${sessionId}`;
  }
  console.log('Request Headers:', config.headers);
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;