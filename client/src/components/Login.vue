<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop" alt="Pizza Banner" class="pizza-banner">
      </div>
      <div class="auth-body">
        <div class="avatar-container">
          <img :src="avatarPreview" alt="Avatar" class="avatar-preview">
        </div>
        <h1 class="auth-title">Log in or sign up</h1>
        <div class="form-container">
          <form @submit.prevent="login">
            <div class="input-group">
              <input id="name" type="text" v-model="name" required placeholder="Username" @blur="fetchAvatar">
            </div>
            <div class="input-group">
              <input id="password" type="password" v-model="password" required placeholder="Password">
            </div>
            <div v-if="error" class="error-message">{{ error }}</div>
            <button type="submit" class="auth-button">Continue</button>
          </form>
          <p class="auth-disclaimer">
            By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
          <div class="register-prompt">
            Don't have an account? <router-link to="/register">Register here</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import defaultAvatar from '@/assets/default-avatar.png'

export default {
  data () {
    return {
      name: '',
      password: '',
      error: null,
      avatarPreview: defaultAvatar
    }
  },
  methods: {
    async login () {
      this.error = null
      try {
        const response = await AuthenticationService.login({
          name: this.name,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token || 'fake_token_for_now')
        this.$store.dispatch('setUser', response.data.user)
        this.$router.push({ name: 'Home' })
      } catch (error) {
        this.error = error.response ? error.response.data.error : 'Failed to log in.'
        console.error(error)
      }
    },
    async fetchAvatar () {
      if (!this.name) {
        this.avatarPreview = defaultAvatar
        return
      }
      try {
        const response = await AuthenticationService.getAvatar(this.name)
        if (response.data.avatarUrl) {
          this.avatarPreview = `http://localhost:8081${response.data.avatarUrl}`
        }
      } catch (error) {
        // If user not found (404) or other error, revert to default avatar
        this.avatarPreview = defaultAvatar
      }
    }
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px); /* Adjust for header height */
  background-color: #F9F9F9;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  background-color: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
}

.auth-header {
  height: 150px;
  overflow: hidden;
}

.pizza-banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.auth-body {
  padding: 40px;
  text-align: center;
}

.avatar-container {
  margin-bottom: 20px;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
  margin: 0 auto;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group input {
  width: 100%;
  padding: 16px;
  background-color: #F3F3F3;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #E67E22;
  box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.2);
}

.auth-button {
  width: 100%;
  padding: 16px;
  margin-top: 10px;
  border: none;
  background-color: #E67E22;
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.auth-button:hover {
  background-color: #D35400;
  transform: translateY(-2px);
}

.auth-disclaimer {
  margin-top: 20px;
  font-size: 12px;
  color: #888;
}

.auth-disclaimer a {
  color: #555;
  text-decoration: underline;
}

.error-message {
  color: #c0392b;
  margin-bottom: 15px;
  padding: 12px;
  background-color: #fbe9e7;
  border-radius: 8px;
  font-size: 14px;
}

.register-prompt {
  margin-top: 25px;
  color: #555;
  font-size: 14px;
}

.register-prompt a {
  color: #E67E22;
  text-decoration: none;
  font-weight: 600;
}

.register-prompt a:hover {
  text-decoration: underline;
}

.form-container {
  max-width: 350px;
  margin: 0 auto;
}
</style>
