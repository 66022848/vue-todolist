import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";  // เพิ่มการ import
import Dashboard from "../views/Dashboard.vue"; 
import DashboardHome from '../views/DashboardHome.vue';
import DashboardWork from '../views/DashboardWork.vue';
import DashboardTasks from '../views/DashboardTasks.vue';
import DashboardAwards from '../views/DashboardAwards.vue';
import DashboardSettings from '../views/DashboardSettings.vue';

const routes = [
  {
    path: "/login", 
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/register",  // เพิ่ม route สำหรับ RegisterPage
    name: "Register",
    component: RegisterPage,  // ใช้ RegisterPage.vue
  },
  {
    path: "/dashboard", 
    name: "Dashboard",
    component: Dashboard,
    children: [
      {
        path: "home",
        name: "DashboardHome",
        component: DashboardHome,
      },
      {
        path: "work",
        name: "DashboardWork",
        component: DashboardWork,
      },
      {
        path: "tasks",
        name: "DashboardTasks",
        component: DashboardTasks,
      },
      {
        path: "awards",
        name: "DashboardAwards",
        component: DashboardAwards,
      },
      {
        path: "settings",
        name: "DashboardSettings",
        component: DashboardSettings,
      },
    ],
  },
  {
    path: "/", 
    redirect: "/login",  // Redirect ไปยังหน้า login
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
