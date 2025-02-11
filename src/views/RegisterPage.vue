<template>
  <div class="register-page">
    <!-- ส่วนซ้าย -->
    <div class="register-left">
      <h1>Welcome to TaskHero UP</h1>
      <p>TaskHero is a gamified to-do list web</p>
      <div class="calendar">
        <Vue3DatePicker v-model="selectedDate" inline />
      </div>
    </div>

    <!-- ส่วนขวา -->
    <div class="register-right">
      <div class="register-box">
        <h2>Sign Up</h2>
        <p>Create your account</p>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="@up.ac.th" required />
          </div>
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" placeholder="Your username" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" placeholder="********" required />
          </div>
          <div class="form-options">
            <label>
              <input type="checkbox" v-model="agreeToTerms" /> I agree to the terms and conditions
            </label>
          </div>
          <button type="submit" class="register-btn" :disabled="!agreeToTerms || !email || !username || !password">Sign Up</button>
        </form>
        <!-- แสดงข้อความข้อผิดพลาด -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue3DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import axios from "axios";

export default {
  name: "RegisterPage",
  components: { Vue3DatePicker },
  data() {
    return {
      email: "",
      username: "",
      password: "",
      agreeToTerms: false,
      selectedDate: null,
      errorMessage: "",
      loading: false, // เพิ่มตัวแปรสำหรับการโหลด
    };
  },
  methods: {
    async handleRegister() {
      this.errorMessage = ""; // ล้างข้อความผิดพลาดก่อน
      if (!this.email || !this.username || !this.password) {
        this.errorMessage = "Please fill in all the fields.";
        return;
      }

      try {
        this.loading = true; // ตั้งสถานะเป็นกำลังโหลด
        await axios.post("http://localhost:3000/api/auth/register", {
          email: this.email,
          username: this.username,
          password: this.password,
        });

        alert("Registration Successful! You can now log in.");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error during registration:", error);
        this.errorMessage = error.response?.data?.message || "Something went wrong!";
      } finally {
        this.loading = false; // เมื่อเสร็จแล้ว
      }
    }
  }
};
</script>
  
  <style scoped>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  .register-page {
    display: flex;
    height: 85vh;
    margin: 0;
    width: 100%;
  }
  
  .register-left {
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
  
  .register-left h1 {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  .register-left p {
    font-size: 18px;
    margin-bottom: 30px;
  }
  
  .calendar {
    background: rgba(255, 255, 255, 0.2);
    padding: 15px;
    border-radius: 10px;
    backdrop-filter: blur(10px);
  }
  
  .register-right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
  }
  
  .register-box {
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
  
  .register-btn {
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
  
  .register-btn:hover {
    background: #6798dc;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
    font-size: 14px;
  }
  </style>
  