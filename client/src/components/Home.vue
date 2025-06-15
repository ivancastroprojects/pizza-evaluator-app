<template>
  <div class="home-page">
    <!-- 1. Hero Section -->
    <section class="hero-section">
      <div class="hero-background-image"></div>
      <div class="container hero-content">
        <h1 class="hero-title">Find Your Perfect Pizza</h1>
        <p class="hero-subtitle">Explore a variety of pizzas from top brands like Domino's, Telepizza, and Pizza Hut. Compare ratings and reviews to discover your ideal slice.</p>
        <div class="main-search-bar">
          <input type="text" v-model="searchQuery" @keyup.enter="search" placeholder="Search by name or ingredient...">
          <button @click="search" class="search-button">Search</button>
        </div>
      </div>
    </section>

    <!-- 2. Top Rated Pizzas Section -->
    <section class="pizza-section container" v-if="topRatedPizzas.length > 0">
      <h2 class="section-title">Top Rated Pizzas</h2>
      <div class="pizza-grid">
        <PizzaCard v-for="pizza in topRatedPizzas" :key="pizza.id" :pizza="pizza" />
      </div>
      <div class="see-all-container">
        <router-link to="/pizza" class="see-all-button">View all pizzas</router-link>
      </div>
    </section>

    <!-- 3. Pizza Recommendations Section -->
    <section class="pizza-section container" v-if="recommendedPizzas.length > 0">
      <h2 class="section-title">Pizza Recommendations</h2>
      <div class="filter-tags">
        <button v-for="tag in filterTags" :key="tag" @click="goToReviews(tag)" class="filter-tag">{{ tag }}</button>
      </div>
      <div class="pizza-grid">
        <PizzaCard v-for="pizza in recommendedPizzas" :key="pizza.id" :pizza="pizza" />
      </div>
      <div class="see-all-container">
        <router-link to="/reviews" class="see-all-button">View Recommendations</router-link>
      </div>
    </section>

    <!-- Loading or empty state -->
    <div v-if="isLoading" class="container loading-state">
      <p>Loading pizzas...</p>
    </div>
    <div v-if="!isLoading && allPizzas.length === 0" class="container">
      <p>No pizzas found. Please add some in the management panel.</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PizzaService from '@/services/pizzaService'
import PizzaCard from './PizzaCard.vue'
import { pizzaFilters } from '@/config/filters'

export default {
  name: 'HomePage',
  components: {
    PizzaCard
  },
  data () {
    return {
      allPizzas: [],
      filterTags: pizzaFilters.filter(f => f !== 'All').slice(0, 5), // Show first 5 categories from config
      isLoading: true,
      searchQuery: ''
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    }),
    // Top rated: sorted by votes, filtered by search, then take top 3
    topRatedPizzas () {
      const filtered = this.allPizzas.filter(pizza => {
        const searchTerm = this.searchQuery.toLowerCase()
        if (!searchTerm) return true
        const nameMatch = pizza.name.toLowerCase().includes(searchTerm)
        const descMatch = pizza.description ? pizza.description.toLowerCase().includes(searchTerm) : false
        return nameMatch || descMatch
      })

      return filtered
        .sort((a, b) => (b.votes || 0) - (a.votes || 0))
        .slice(0, 3)
    },
    // Recommendations: for now, just show other pizzas (e.g., from index 3 to 6)
    recommendedPizzas () {
      // This is a placeholder logic. You might want a more complex recommendation system later.
      return this.allPizzas.slice(3, 6)
    }
  },
  async created () {
    try {
      const username = this.user ? this.user.name : null
      const response = await PizzaService.fetchPizzas('', username)
      this.allPizzas = response.data
    } catch (error) {
      console.error('Error fetching pizzas for home page:', error)
      // Optionally, set an error message to display to the user
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    search () {
      if (this.searchQuery.trim()) {
        this.$router.push({ name: 'Pizzas', query: { search: this.searchQuery } })
      }
    },
    goToReviews (filter) {
      this.$router.push({ path: '/reviews', query: { filter } })
    }
  }
}
</script>

<style scoped lang="scss">
.home-page {
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  margin-bottom: 60px;
}

.hero-background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  filter: brightness(0.6);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 10px;
  color: #fff;
}

.hero-subtitle {
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto 30px auto;
  color: #f0f0f0;
}

.main-search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 30px;
  padding: 5px;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.main-search-bar input {
  border: none;
  outline: none;
  padding: 10px 20px;
  font-size: 16px;
  flex-grow: 1;
  background: transparent;
  color: var(--text-color-body);
}

.search-button {
  background-color: var(--primary-red, #E12E2E);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 30px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #c02424;
}

/* Pizza Sections */
.pizza-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 30px;
  text-align: left;
}

.pizza-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.pizza-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: left;
}

.pizza-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

.pizza-image-wrapper {
  width: 100%;
  padding-top: 66.66%; /* 3:2 aspect ratio */
  position: relative;
  background-color: #f0f0f0;
  border-radius: 12px;
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

.pizza-info {
  padding: 20px 5px;
}

.pizza-info h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: var(--text-color-heading);
}

.pizza-info p {
  font-size: 14px;
  color: var(--text-color-body);
  margin: 0;
}

/* Filter Tags */
.filter-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.filter-tag {
  background-color: #f0f0f0;
  border: 1px solid #e0e0e0;
  color: var(--text-color-body);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 14px;
  font-weight: 500;
}

.filter-tag:hover {
  background-color: #e0e0e0;
}

.filter-tag.active {
  background-color: var(--text-color-heading);
  color: #fff;
  border-color: var(--text-color-heading);
}

.see-all-container {
  text-align: center;
  margin-top: 40px;
}

.see-all-button {
  background-color: var(--primary-red);
  color: white;
  padding: 15px 40px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 700;
  font-size: 18px;
  transition: background-color 0.3s, transform 0.3s;
  display: inline-block;
}

.see-all-button:hover {
  background-color: #c02424;
  transform: translateY(-2px);
}
</style>
