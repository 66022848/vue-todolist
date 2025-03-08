<template>
  <div class="max-w-screen-xl mx-auto">
    <header v-if="showNavbar" class="navbar">
      <div class="navbar-left">
        <button @click="toggleSidebar" class="menu-toggle">
          <i class="fas fa-bars"></i>
        </button>
        <img src="@/assets/logo.png" alt="logo" class="logo" />
      </div>
      <div class="navbar-center">
        <input type="text" placeholder="Search..." class="search-bar" />
      </div>
      <div class="navbar-right">
        <div class="profile" v-if="user">
          <div class="profile-picture">
            <img :src="user.picture || defaultProfilePicture" alt="Profile Picture" />
          </div>
          <div class="profile-info">
            <span class="profile-name">
              <h1>{{ user.name || 'Unnamed User' }}</h1>
            </span>
            <small class="profile-role">
              <p>{{ user.email }}</p>
            </small>
          </div>
          <div class="dropdown" @click="toggleDropdown">
            <i class="fas fa-chevron-down"></i>
            <ul v-if="isDropdownOpen" class="dropdown-menu">
              <li @click="logout">Logout</li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <aside :class="['sidebar', { 'sidebar-open': isSidebarOpen }]">
      <nav class="menu">
        <ul>
          <li :class="{ active: selectedMenu === 'home' }">
            <router-link to="/dashboard/home" @click="selectMenu('home')"><i class="fas fa-home"></i></router-link>
          </li>
          <li :class="{ active: selectedMenu === 'work' }">
            <router-link to="/dashboard/work" @click="selectMenu('work')"><i class="fas fa-briefcase"></i></router-link>
          </li>
          <li :class="{ active: selectedMenu === 'tasks' }">
            <router-link to="/dashboard/tasks" @click="selectMenu('tasks')"><i class="fas fa-list"></i></router-link>
          </li>
          <li :class="{ active: selectedMenu === 'awards' }">
            <router-link to="/dashboard/awards" @click="selectMenu('awards')"><i class="fas fa-trophy"></i></router-link>
          </li>
          <li :class="{ active: selectedMenu === 'settings' }">
            <router-link to="/dashboard/settings" @click="selectMenu('settings')"><i class="fas fa-cog"></i></router-link>
          </li>
        </ul>
        <div class="plus-button">
          <router-link to="/dashboard/modal" @click="selectMenu('modal')">
            <i class="fa fa-plus-square" style="font-size:48px;color:orange"></i>
          </router-link>
        </div>
      </nav>
    </aside>

    <div :class="['content', { 'content-shifted': isSidebarOpen }]">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: "UserLayout",
  data() {
    return {
      user: null,
      isDropdownOpen: false,
      isSidebarOpen: false,
      selectedMenu: "home",
      defaultProfilePicture: '/src/assets/default-profile.png',
    };
  },
  computed: {
    showNavbar() {
      return this.$route.path !== "/login" && this.$route.path !== "/register" && this.$route.path !== "/dashboard/modal" && this.$route.path !== "/dashboard/color" && this.$route.path !== "/dashboard/createquest" && this.$route.path !== "/dashboard/event" && this.$route.path !== "/dashboard/memo" && this.$route.path !== "/dashboard/done";
    },
  },
  async mounted() {
    try {
      const response = await api.get('/api/user');
      console.log('API Response:', response.data);
      const userData = response.data.user;

      if (!userData) {
        this.$router.push('/login');
        return;
      }

      this.user = {
        name: userData.username || 'Unnamed User',
        email: userData.email,
        picture: userData.picture || null,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      this.$router.push('/login');
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    selectMenu(menu) {
      this.selectedMenu = menu;
      this.$router.push(`/dashboard/${menu}`);
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    async logout() {
      try {
        await api.post('/api/auth/logout');
        alert('Logged out successfully!');
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed');
      }
    },
  },
  watch: {
    $route(to) {
      if (to.name) {
        this.selectedMenu = to.name.replace("Dashboard", "").toLowerCase();
      }
    },
  },
};
</script>

<style scoped>
.dashboard { display: flex; height: 100vh; }
.sidebar { width: 60px; height: 100%; background-color: #111; color: white; position: fixed; top: 60px; left: -100px; transition: left 0.3s ease; z-index: 999; }
.sidebar.sidebar-open { left: 0; }
.sidebar .menu { display: flex; flex-direction: column; height: 95%; justify-content: space-between; }
.sidebar .menu ul { list-style: none; padding: 0; margin: 0; }
.sidebar .menu ul li { padding: 20px; text-align: center; cursor: pointer; background-color: transparent; color: rgb(255, 254, 254); }
.sidebar .menu ul li:hover { background-color: #444; }
.sidebar .menu ul li.active { background-color: #444; }
.sidebar .menu ul li:not(.active) a { background-color: transparent; color: white; }
.sidebar .menu ul li a { color: white; text-decoration: none; display: block; }
.sidebar .menu ul li a:hover { background-color: #444; }
.content { flex: 1; background: #f9f9f9; display: flex; flex-direction: column; margin-left: 5px; margin-top: 150px; transition: margin-left 0.3s ease, margin-top 0.3s ease; z-index: 1; }
.content-shifted { margin-left: 0px; }
.topbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background: white; }
.widgets { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; padding: 20px; }
.widget { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.sidebar-open + .content { margin-left: 250px; }
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background-color: white; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); position: fixed; top: 0; left: 0; right: 0; z-index: 1000; height: 60px; }
.navbar-left { display: flex; align-items: center; }
.navbar-left .menu-toggle { background: none; border: none; font-size: 20px; cursor: pointer; margin-right: 10px; color: #000000; z-index: 1100; }
.navbar-left .logo { height: 40px; }
.navbar-center { flex: 1; display: flex; justify-content: center; }
.navbar-center .search-bar { width: 50%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 20px; background: #ffffff; }
.navbar-right { display: flex; align-items: center; gap: 10px; }
.navbar-right .profile { display: flex; align-items: center; gap: 10px; background: #FFDFDF; padding: 5px 10px; border-radius: 25px; height: 40px; }
.navbar-right .profile-picture img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.navbar-right .profile-info { display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; height: 100%; }
.navbar-right .profile-info .profile-name { font-weight: bold; font-size: 10px; color: #000000; margin-top: auto; display: flex; justify-content: flex-end; }
.navbar-right .profile-info h1 { margin: 0; padding: 0; }
.navbar-right .profile-info .profile-role { font-size: 12px; color: #000000; }
.navbar-right .profile-info p { margin: 0; padding: 0; }
.navbar-right .dropdown { display: flex; align-items: center; cursor: pointer; }
.dropdown-menu { position: absolute; top: 100%; right: 0; background: white; list-style: none; padding: 10px; margin: 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; z-index: 1000; }
.dropdown-menu li { padding: 8px 12px; cursor: pointer; font-size: 14px; color: #333; }
.dropdown-menu li:hover { background-color: #f5f5f5; }
.plus-button { display: flex; justify-content: center; align-items: center; margin-bottom: 20px; }
</style>