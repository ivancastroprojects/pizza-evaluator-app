<template>
  <header class="site-header">
    <div class="container nav-container">
      <div class="logo-and-nav">
        <router-link to="/" class="logo">Pizza Evaluator</router-link>
        <nav class="main-nav">
          <ul class="nav-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/pizza">Pizzas</router-link></li>
            <li><router-link to="/reviews">Reviews</router-link></li>
            <li v-if="isManager"><router-link to="/users">Users</router-link></li>
          </ul>
        </nav>
      </div>
      <div class="header-actions">
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="performSearch"
            placeholder="Search for pizza..."
          >
        </div>
        <div class="action-icons">
          <!-- User Authentication Section -->
          <div v-if="!isUserLoggedIn" class="user-profile">
            <router-link to="/login" class="icon-link">
              <img :src="defaultAvatar" alt="Login" class="avatar">
            </router-link>
          </div>
          <div v-else class="user-profile-logged-in">
            <div class="user-info-votes">
              <span class="username">{{ user.name }}</span>
              <span v-if="!isManager" class="votes-left">{{ votesLeft }}/{{ maxVotes }}</span>
            </div>
            <img :src="userAvatar" alt="User Avatar" class="avatar">
            <button @click="logout" class="logout-button">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import defaultAvatar from '@/assets/default-avatar.png'
import UserService from '@/services/userService' // Import user service

export default {
  name: 'SiteHeader',
  data () {
    return {
      searchQuery: '',
      defaultAvatar,
      votesLeft: 0,
      maxVotes: 5
    }
  },
  computed: {
    isUserLoggedIn () {
      return this.$store.state.isUserLoggedIn
    },
    user () {
      return this.$store.state.user
    },
    isManager () {
      return this.isUserLoggedIn && this.user && this.user.role === 'manager'
    },
    userAvatar () {
      const baseUrl = 'http://localhost:8081'
      // Use user's avatar if available, otherwise use a default
      return this.user && this.user.avatarUrl
        ? `${baseUrl}${this.user.avatarUrl}`
        : this.defaultAvatar
    }
  },
  watch: {
    user (newUser) {
      if (newUser && !this.isManager) {
        this.fetchVotesLeft()
      }
    }
  },
  created () {
    // Listen for the global event emitted from PizzaCard
    this.$root.$on('vote-changed', this.fetchVotesLeft)
    // Initial fetch if user is already logged in
    if (this.isUserLoggedIn && !this.isManager) {
      this.fetchVotesLeft()
    }
  },
  beforeDestroy () {
    // Clean up the listener to prevent memory leaks
    this.$root.$off('vote-changed', this.fetchVotesLeft)
  },
  methods: {
    ...mapActions([
      'setUser',
      'setToken'
    ]),
    async fetchVotesLeft () {
      if (!this.user) return
      try {
        const response = await UserService.getVotesLeft(this.user.name)
        this.votesLeft = response.data.votesRemaining
        this.maxVotes = response.data.of
      } catch (error) {
        console.error('Failed to fetch votes left:', error)
      }
    },
    performSearch () {
      if (this.searchQuery.trim()) {
        this.$router.push({ name: 'Pizzas', query: { search: this.searchQuery } })
        this.searchQuery = '' // Clear input after search
      }
    },
    logout () {
      this.setToken(null)
      this.setUser(null)
      this.$router.push({ name: 'Home' }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error(err)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.site-header {
  background-color: var(--background-color, #fff);
  border-bottom: 1px solid var(--light-grey, #eaeaea);
  padding: 0 20px;
  height: 80px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-and-nav {
  display: flex;
  align-items: center;
}

.logo {
  font-weight: 800;
  font-size: 24px;
  color: var(--text-color-heading, #000);
  margin-right: 40px;
}

.nav-links {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  gap: 30px;
}

.nav-links a {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color-body, #5f5f5f);
  padding: 10px 0;
  transition: color 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-exact-active {
  color: var(--text-color-heading, #000);
  font-weight: 700;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-bar {
  position: relative;
}

.search-bar input {
  background-color: #F8F8F8;
  border: 1px solid var(--light-grey, #eaeaea);
  border-radius: 20px;
  padding: 8px 15px 8px 40px; /* Left padding for icon */
  width: 200px;
  font-family: var(--font-family-main);
  font-size: 14px;
}

/* Adding a search icon inside the search bar is a nice touch, can do later */

.action-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon-link svg,
.icon-link .avatar {
  display: block;
}

.user-profile .avatar {
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.user-profile-logged-in .avatar {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  object-fit: cover;
}

.user-profile-logged-in {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info-votes {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.username {
  font-weight: 600;
  color: var(--text-color-heading);
}

.votes-left {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-red);
  background-color: #fdecec;
  padding: 2px 6px;
  border-radius: 10px;
}

.logout-button {
  background-color: var(--primary-red);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #c02424;
}
</style>
