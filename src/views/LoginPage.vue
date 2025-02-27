<script>
import Vue3DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import axios from "axios";
import { GoogleLogin } from "vue3-google-login";

export default {
  name: "LoginPage",
  components: { Vue3DatePicker, GoogleLogin },
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
      selectedDate: null,
      errorMessage: "",
      loading: false,
      clientId: "78375814370-mavksrobfsrn55o2u4nnksjcojj4mfmm.apps.googleusercontent.com"
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = "";
      if (!this.email || !this.password) {
        this.errorMessage = "Please enter both email and password.";
        return;
      }
      try {
        this.loading = true;
        const response = await axios.post("http://localhost:3000/api/auth/login", {
          email: this.email,
          password: this.password,
          rememberMe: this.rememberMe,
        });
        if (response.data.token) {
          if (this.rememberMe) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);
          } else {
            sessionStorage.setItem("user", JSON.stringify(response.data.user));
            sessionStorage.setItem("token", response.data.token);
          }
          alert("Login Successful!");
          this.$router.push("/dashboard/home");
        }
      } catch (error) {
        console.error("Error during login:", error);
        this.errorMessage = error.response?.data?.message || "Invalid email or password.";
      } finally {
        this.loading = false;
      }
    },
    async onSuccess(response) {
      console.log("Google Login Success:", response);
      const { credential } = response; // รับ JWT Token จาก Google
      try {
        // ส่ง Token ไป Backend เพื่อทำ Authentication
        const backendResponse = await axios.post("http://localhost:3000/api/auth/google-login", { token: credential });

        // สมมติว่า Backend ส่งข้อมูลผู้ใช้กลับมา
        const userData = backendResponse.data.user;
        const userToken = backendResponse.data.token;

        // ✅ บันทึกข้อมูลผู้ใช้ลง localStorage หรือ sessionStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userToken);

        alert("Google Login Successful!");
        this.$router.push("/dashboard/home"); // ✅ พาผู้ใช้ไปที่หน้า Dashboard
      } catch (error) {
        console.error("Google Login Error:", error);
        this.errorMessage = "Google Login Failed!";
      }
    },
    onFailure(error) {
      console.log("Google Login Failed:", error);
      alert("Google Login Failed!");
    }
  },
  mounted() {
    if (localStorage.getItem("user") && localStorage.getItem("token")) {
      this.$router.push("/dashboard/home");
    }
  }
};
</script>

<template>
  <div class="login-page">
    <!-- ส่วนซ้าย -->
    <div class="login-left">
      <h1>Welcome to TaskHero UP</h1>
      <p>TaskHero is a gamified to-do list web</p>
      <div class="calendar">
        <Vue3DatePicker v-model="selectedDate" inline />
      </div>
    </div>

    <!-- ส่วนขวา -->
    <div class="login-right">
      <div class="login-box">
        <h2>SIGN IN</h2>
        <p>Sign in with your UP Account</p>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="@up.ac.th" required />
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

          <!-- ✅ ปุ่ม Google Login -->
          <GoogleLogin class="login-gg"
            :clientId="clientId"
            buttonText="Sign in with Google"
            @success="onSuccess"
            @failure="onFailure"
            :cookiePolicy="'none'"
            :isSignedIn="false"
          />
        </form>

        <!-- แสดงข้อความข้อผิดพลาด -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <!-- ลิงก์ไปหน้าสมัครสมาชิก -->
        <p class="signup-link">
          Don't have an account? <router-link to="/register">Sign up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* สไตล์การแสดงผลของหน้าจอ login */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.login-page {
  display: flex;
  height: 85vh;
  margin: 0;
  width: 100%;
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #e0c3fc, #8ec5fc);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 10px;
  text-align: center;
}

.login-left h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.login-left p {
  font-size: 18px;
  margin-bottom: 30px;
}

.calendar {
  background: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
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
  background: #8ec5fc;
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
  background: #ffffff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.3s ease;
}

.login-btn:hover {
  background: #6798dc;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

.signup-link {
  margin-top: 20px;
  font-size: 14px;
}

.signup-link a {
  color: #8ec5fc;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
