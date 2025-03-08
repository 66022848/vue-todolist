import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://vue-todolist-backend.onrender.com',
  withCredentials: false,
});

api.interceptors.request.use(config => {
  const sessionId = localStorage.getItem('sessionId');
  console.log('Interceptor - sessionId from localStorage:', sessionId);
  if (sessionId) {
    config.headers.Authorization = `Session ${sessionId}`;
    console.log('Authorization header set:', config.headers.Authorization);
  } else {
    console.log('No sessionId found in localStorage');
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;