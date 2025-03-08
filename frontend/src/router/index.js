import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardHome from '../views/DashboardHome.vue';
import DashboardWork from '../views/DashboardWork.vue';
import DashboardTasks from '../views/DashboardTasks.vue';
import DashboardAwards from '../views/DashboardAwards.vue';
import DashboardSettings from '../views/DashboardSettings.vue';
import UserLayout from '../layouts/UserLayout.vue';
import Modal from "../views/Modal.vue";
import Color from "../views/Color.vue";
import CreateQuest from "../views/CreateQuest.vue";
import Event from "../views/Event.vue";
import Memo from "../views/Memo.vue";
import Done from "../views/Done.vue";

const routes = [
  { path: '/', component: LoginView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  {
    path: '/dashboard', 
    component: UserLayout,
    children: [
      { path: 'home', component: DashboardHome, name: 'home' },
      { path: 'work', component: DashboardWork, name: 'work' },
      { path: 'tasks', component: DashboardTasks, name: 'tasks' },
      { path: 'awards', component: DashboardAwards, name: 'awards' },
      { path: 'settings', component: DashboardSettings, name: 'settings' },
      { path: 'modal', component: Modal, name: 'modal' },
      { path: 'color', component: Color, name: 'color' },
      { path: 'createquest', component: CreateQuest, name: 'createquest' },
      { path: 'event', component: Event, name: 'event' },
      { path: 'memo', component: Memo, name: 'memo' },
      { path: 'done', component: Done, name: 'done' },
    ]
<<<<<<< HEAD
  },
=======
  },{
    base: '/vue-todolist'
  }
>>>>>>> gh-pages
];

const router = createRouter({
  history: createWebHistory('/vue-todolist/'),
  routes
});

export default router;
