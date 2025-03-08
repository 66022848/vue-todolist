<template>
  <div class="login-page">

    <div class="login-left">

    </div>

    <div class="login-right">
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
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p class="signup-link">
          Already have an account? <router-link to="/login">Sign In</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: "RegisterPage",
  data() {
    return {
      email: '',
      username: '',
      password: '',
      agreeToTerms: false,
      errorMessage: '',
    };
  },
  methods: {
    async handleRegister() {
      this.errorMessage = '';
      if (!this.email || !this.username || !this.password) {
        this.errorMessage = 'Please fill in all the fields.';
        return;
      }
      if (!this.agreeToTerms) {
        this.errorMessage = 'You must agree to the terms and conditions.';
        return;
      }

      try {
        const response = await api.post(
          '/api/auth/register',
          {
            email: this.email,
            username: this.username,
            password: this.password,
          }
        );

        console.log('Register successful:', response.data);
        alert('Registration successful! You can now log in.');
        this.$router.push('/login');
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Registration failed';
        console.error('Register error:', error);
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
  background: #C9B6D7;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.3s ease;
}

.register-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.signup-link a {
  color: #C9B6D7;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>