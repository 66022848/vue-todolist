<template>
  <div class="login-page">
    <div class="login-left"></div>
    <div class="login-right">
      <div class="login-box">
        <h2>SIGN IN</h2>
        <p>Sign in with your UP Account</p>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="Email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" placeholder="********" required />
          </div>
          <div class="form-options">
            <label>
              <input type="checkbox" v-model="rememberMe" /> Remember me
            </label>
          </div>
          <button type="submit" class="login-btn">Sign in</button>
          <button type="button" @click="googleLogin" class="login-gg">
            <img src="@/assets/gglogo.png" alt="Google" class="google-logo" />
            Login with Google
          </button>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <div class="signup-link">
          <p>Don't have an account? <button @click="goToRegister">Sign up</button></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      errorMessage: '',
      API_BASE_URL: import.meta.env.VITE_API_URL || 'https://vue-todolist-backend.onrender.com',
    };
  },
  mounted() {
    this.checkSession();
    // จัดการ Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId');
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
      console.log('เก็บ sessionId จาก Google callback:', sessionId);
      this.$router.push('/dashboard/home');
      // ลบ query string ออกจาก URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },
  methods: {
    async checkSession() {
      try {
        const response = await api.get('/api/user');
        if (response.data.user) {
          this.$router.push('/dashboard/home');
        }
      } catch (error) {
        console.log('ไม่พบ session ที่ใช้งาน:', error.message);
      }
    },
    googleLogin() {
      window.location.href = `${this.API_BASE_URL}/api/auth/google`;
    },
    goToRegister() {
      this.$router.push('/register');
    },
    async handleLogin() {
      try {
        this.errorMessage = '';
        const response = await api.post('/api/auth/login', {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem('sessionId', response.data.sessionId);
        console.log('Login successful, sessionId:', response.data.sessionId);
        this.$router.push('/dashboard/home');
      } catch (error) {
        console.error('ข้อผิดพลาดการเข้าสู่ระบบ:', error.response?.data || error.message);
        this.errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      }
    },
  },
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.login-page {
  display: flex;
  height: 100vh;
  width: 100%;
}

.login-left {
  flex: 1;
  background: url('@/assets/loginleft2.png') no-repeat center center/cover;
}

.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
}

.login-box {
  width: 100%;
  max-width: 380px;
  text-align: center;
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

p {
  color: #666;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #8ec5fc;
  box-shadow: 0 0 4px rgba(142, 197, 252, 0.8);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  padding: 10px;
  background: #C9B6D7;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.3s ease;
}

.login-gg {
  width: 100%;
  padding: 10px;
  background: #ffffff;
  color: rgb(0, 0, 0);
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: background 0.3s ease;
}

.google-logo {
  width: 16px;
  height: 16px;
}

.signup-link button {
  background: none;
  border: none;
  color: #C9B6D7;
  cursor: pointer;
  font-size: 14px;
}

.signup-link button:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>