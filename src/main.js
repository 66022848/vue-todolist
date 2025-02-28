import { createApp } from 'vue'
import App from './App.vue'
import "./style.css"; // ใช้ TailwindCSS
import router from "./router"; // นำเข้า router
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

createApp(App).use(router).mount('#app')
