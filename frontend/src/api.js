import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://vue-todolist-backend.onrender.com',
  withCredentials: true,
  timeout: 15000, // เพิ่ม timeout เป็น 15 วินาที
});

api.interceptors.request.use(
  (config) => {
    const sessionId = localStorage.getItem('sessionId');
    console.log('Interceptor - sessionId จาก localStorage:', sessionId);
    if (sessionId) {
      config.headers.Authorization = `Session ${sessionId}`;
      console.log('ตั้งค่า Authorization header:', config.headers.Authorization);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('ข้อผิดพลาด API:', error.response.status, error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem('sessionId');
        window.location.href = '/vue-todolist/login';
      }
    } else if (error.request) {
      console.error('ข้อผิดพลาด Network:', error.message);
    } else {
      console.error('ข้อผิดพลาด:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;