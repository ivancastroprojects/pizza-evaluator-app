<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-body">
        <div class="form-container">
          <h1 class="auth-title">Create your account</h1>

          <!-- Avatar Uploader -->
          <div class="avatar-uploader">
            <label for="avatar-input">
              <img :src="avatarPreview" alt="Avatar" class="avatar-preview">
              <span class="avatar-edit-icon">+</span>
            </label>
            <input id="avatar-input" type="file" @change="handleFileChange" accept="image/*" style="display: none;">
          </div>

          <form @submit.prevent="register">
            <div class="input-group">
              <input id="name" type="text" v-model="name" required placeholder="Username">
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
          <div class="login-prompt">
            Already have an account? <router-link to="/login">Log in</router-link>
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
      avatar: null,
      avatarPreview: defaultAvatar, // Default avatar
      error: null
    }
  },
  methods: {
    handleFileChange (event) {
      const file = event.target.files[0]
      if (file) {
        this.avatar = file
        this.avatarPreview = URL.createObjectURL(file)
      }
    },
    async register () {
      this.error = null
      const formData = new FormData()
      formData.append('name', this.name)
      formData.append('password', this.password)
      if (this.avatar) {
        formData.append('avatar', this.avatar)
      }

      try {
        const response = await AuthenticationService.register(formData)
        this.$store.dispatch('setUser', response.data.user)
        this.$router.push({ name: 'Home' })
      } catch (error) {
        this.error = error.response ? error.response.data.error : 'An unexpected error occurred during registration.'
        console.error('Registration error:', error)
      }
    }
  }
}
</script>

<style scoped>
/* Inherit all styles from Login and add specifics for avatar */
.auth-page, .auth-card, .auth-body, .auth-title, .input-group, .auth-button, .auth-disclaimer, .error-message, .login-prompt {
  /* These styles are assumed to be identical to Login.vue and are omitted for brevity */
}

/* New Avatar Styles */
.avatar-uploader {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 25px auto;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

.avatar-uploader label {
  cursor: pointer;
}

.avatar-edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background-color: #E67E22;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  border: 2px solid white;
  transition: transform 0.2s;
  }

.form-container {
  max-width: 350px;
  margin: 0 auto;
}

form {
  /* Remove specific centering from form itself */
  max-width: none;
  margin: 0;
}

.avatar-edit-icon:hover {
  transform: scale(1.1);
}

/* Reusing Login styles */
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
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

.auth-body {
  padding: 40px;
  text-align: center;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px; /* Adjusted margin */
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

.login-prompt {
  margin-top: 25px;
  color: #555;
  font-size: 14px;
}

.login-prompt a {
  color: #E67E22;
  text-decoration: none;
  font-weight: 600;
}

.login-prompt a:hover {
  text-decoration: underline;
}
</style>
