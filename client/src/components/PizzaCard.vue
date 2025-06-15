<template>
  <div class="pizza-card">
    <div class="pizza-image-wrapper">
      <img :src="pizza.imageUrl || 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80'" :alt="pizza.name" class="pizza-image">
      <span class="pizza-brand-tag" :style="{ backgroundColor: getBrandColor(pizza.sourceName) }">{{ pizza.sourceName }}</span>
    </div>
    <div class="pizza-info">
      <h3>{{ pizza.name }}</h3>
      <p class="pizza-description">{{ pizza.description || 'A delicious pizza.' }}</p>
      <div class="pizza-card-footer">
        <div class="pizza-votes">
          <button @click="vote" class="heart-button" :class="{ 'voted': userVoted }" :disabled="!isUserLoggedIn">
            <span class="heart-icon">♥</span>
          </button>
          <span>{{ localVotes }}</span>
        </div>
        <a :href="pizza.websiteUrl" target="_blank" class="pizza-cart-link" rel="noopener noreferrer" title="Buy this pizza">
          <span class="cart-icon">🛒</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VoteService from '@/services/VoteService'

export default {
  name: 'PizzaCard',
  props: {
    pizza: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      localVotes: 0,
      userVoted: false // We'll need a way to determine this on load
    }
  },
  computed: {
    ...mapState({
      isUserLoggedIn: state => state.isUserLoggedIn,
      user: state => state.user
    })
  },
  watch: {
    pizza: {
      immediate: true,
      handler (newPizza) {
        this.localVotes = newPizza.votes || 0
        this.userVoted = newPizza.userVoted || false
      }
    }
  },
  methods: {
    async vote () {
      if (!this.isUserLoggedIn) {
        // Maybe prompt to login
        return
      }
      try {
        const response = await VoteService.castVote({
          voterUsername: this.user.name,
          pizzaName: this.pizza.name
        })
        // Update local state based on response
        this.localVotes = response.data.votes
        this.userVoted = response.data.action === 'voted'
        // Emit an event to notify parent components (like Nav) about the vote change
        this.$root.$emit('vote-changed')
      } catch (error) {
        console.error('Error voting:', error.response ? error.response.data.message : error.message)
        // Optionally, show a notification to the user
        alert(error.response ? error.response.data.message : 'An error occurred while voting.')
      }
    },
    getBrandColor (sourceName) {
      const colors = {
        "Domino's Pizza": '#006491', // Blue
        'Telepizza': '#D72B2F', // Red (as before)
        'Pizza Hut': '#00A160' // Green
      }
      return colors[sourceName] || this.generateRandomColor(sourceName)
    },
    generateRandomColor (seed) {
      // Simple hash function to get a consistent random color for a given string
      let hash = 0
      for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash)
      }
      let color = '#'
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF
        color += ('00' + value.toString(16)).substr(-2)
      }
      return color
    }
  }
}
</script>

<style scoped lang="scss">
.pizza-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: left;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.pizza-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.pizza-image-wrapper {
  width: 100%;
  padding-top: 66.66%; /* 3:2 aspect ratio */
  position: relative;
  background-color: #f0f0f0;
  overflow: hidden;
}

.pizza-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pizza-brand-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: var(--primary-red);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.pizza-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Makes the info section fill the space */
}

.pizza-info h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: var(--text-color-heading);
}

.pizza-description {
  font-size: 14px;
  color: var(--text-color-body);
  line-height: 1.5;
  margin-bottom: 20px;
  flex-grow: 1; /* Pushes footer down */
}

.pizza-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto; /* Aligns footer to the bottom */
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
}

.pizza-votes {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-color-heading);
}

.heart-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 8px;
  display: flex;
  align-items: center;
}

.heart-button:disabled .heart-icon {
  color: #ccc;
  cursor: not-allowed;
}

.heart-icon {
  color: #ddd; /* Default non-voted color */
  font-size: 24px;
  transition: color 0.2s, transform 0.2s;
}

.heart-button.voted .heart-icon {
  color: var(--primary-red);
  transform: scale(1.1);
}

.heart-button:not(:disabled):hover .heart-icon {
  color: var(--primary-red);
}

.cart-icon {
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s;
}

.cart-icon:hover {
  transform: scale(1.15);
}
</style>
