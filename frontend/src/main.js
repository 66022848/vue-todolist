import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCalendarAlt, faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import api from './src/api';

library.add(faCalendarAlt, faCalendar, faClock);

const app = createApp(App);

app.config.globalProperties.$api = api;

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.mount('#app');
