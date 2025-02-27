<template>
  <div id="app">
    <!-- Navbar -->
    <header v-if="showNavbar" class="navbar">
      <div class="navbar-left">
        <button @click="toggleSidebar" class="menu-toggle">
          <i class="fas fa-bars"></i>
        </button>
        <img src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp" alt="Logo" class="logo" />
      </div>
      <div class="navbar-center">
        <input type="text" placeholder="Search..." class="search-bar" />
      </div>
      <div class="navbar-right">
        <div class="profile">
          <div class="profile-picture">
            <img
              src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
              alt="Profile"
            />
          </div>
          <div class="profile-info">
            <span class="profile-name">Sunisa Inpia</span>
            <small class="profile-role">Product Manager</small>
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

    <!-- Sidebar -->
    <aside v-if="showNavbar" :class="['sidebar', { 'sidebar-open': isSidebarOpen }]">
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
      </nav>
    </aside>

    <!-- Dynamic Content -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "MainApp",
  data() {
    return {
      isSidebarOpen: false,
      selectedMenu: "home", // ค่าเริ่มต้น
      isDropdownOpen: false,
    };
  },
  computed: {
    showNavbar() {
      return this.$route.path !== "/login" && this.$route.path !== "/register"; // เพิ่ม /register
    },
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
    logout() {
      alert("Logged out successfully!");
      this.$router.push("/login");
    },
  },
  watch: {
    $route(to) {
      if (to.name) {
        this.selectedMenu = to.name.replace("Dashboard", "").toLowerCase();
      }
    }
  }
};
</script>


<style scoped>
/* CSS สไตล์ */
.dashboard {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 80px; /* กำหนดความกว้างของ Sidebar */
  background: #111;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  position: fixed;
  top: 60px; /* กำหนดให้ Sidebar เริ่มใต้ Navbar (สมมติว่า Navbar มีความสูง 60px) */
  left: 0;
  bottom: 0;
  transform: translateX(-100%); /* เริ่มต้น Sidebar นอกจอ */
  transition: transform 0.3s ease; /* ใช้ transition เพื่อการเคลื่อนไหวที่นุ่มนวล */
  z-index: 100; /* ตั้งค่าให้ Sidebar อยู่ต่ำกว่า Navbar */
}

.sidebar.sidebar-open {
  transform: translateX(0); /* เมื่อเปิด Sidebar จะถูกเลื่อนกลับเข้ามาที่ตำแหน่งเดิม */
}

.sidebar .menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar .menu ul li {
  padding: 20px;
  text-align: center;
  cursor: pointer;
  background-color: transparent;
  color: white;
}

.sidebar .menu ul li:hover {
  background-color: #444;
}

/* เพิ่ม active เมื่อลิงก์ที่ถูกเลือก */
.sidebar .menu ul li.active {
  color: white;
}

/* เมื่อไม่มีการเลือกเมนู */
.sidebar .menu ul li:not(.active) a {
  background-color: transparent;
  color: white;
}

.sidebar .menu ul li a {
  color: white;
  text-decoration: none;
  display: block;
}

.sidebar .menu ul li a:hover {
  background-color: #444;
}

.add-btn {
  margin-top: auto;
  margin-bottom: 20px;
  background: #f56;
  color: white;
  font-size: 24px;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

/* ปรับ z-index ของ main content ให้แสดงอยู่เหนือ Sidebar และอยู่ใต้ Navbar */
.content {
  flex: 1;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  margin-left: 80px; /* เพิ่มระยะห่างจาก Sidebar */
  margin-top: 60px; /* ระยะห่างจาก Navbar (สมมติว่า Navbar มีความสูง 60px) */
  transition: margin-left 0.3s ease, margin-top 0.3s ease;
  z-index: 0; /* ตั้ง z-index ของ content ต่ำกว่าทั้ง sidebar และ navbar */
}

/* เมื่อเปิด Sidebar เนื้อหาจะถูกเลื่อนขวาเพิ่มอีก */
.sidebar-open + .content {
  margin-left: 80px; /* เมื่อเปิด Sidebar, เนื้อหาจะถูกเลื่อนขวาเพิ่มอีก */
}

/* ปรับ z-index ของ main content ให้แสดงอยู่เหนือ Sidebar และ Navbar */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: white;
}

.widgets {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
}

.widget {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.sidebar-open + .content {
  margin-left: 80px; /* เมื่อเปิด Sidebar */
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* ตั้ง z-index ของ Navbar อยู่สูงสุด */
}

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-left .menu-toggle {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  margin-right: 10px;
  color: #000000;
}

.navbar-left .logo {
  height: 40px;
}

.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.navbar-center .search-bar {
  width: 50%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #ffffff
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.navbar-right .profile {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FFDFDF;
  padding: 5px 10px;
  border-radius: 25px;
}

.navbar-right .profile-picture img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.navbar-right .profile-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.navbar-right .profile-info .profile-name {
  font-weight: bold;
  font-size: 14px;
  color : #000000;
}

.navbar-right .profile-info .profile-role {
  font-size: 12px;
  color: #000000;
}

.navbar-right .dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  list-style: none;
  padding: 10px;
  margin: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 1000;
}

.dropdown-menu li {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.dropdown-menu li:hover {
  background-color: #ffffff;
}

</style>