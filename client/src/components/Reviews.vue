<template>
  <div class="page-container container">
    <header class="page-header">
      <h1 class="page-title">Pizza Reviews & Recommendations</h1>
      <p class="page-subtitle">Find pizzas based on your favorite categories.</p>
    </header>

    <!-- Filter Tags -->
    <div class="filter-tags">
      <button
        v-for="tag in filters"
        :key="tag"
        @click="applyFilter(tag)"
        :class="{ 'filter-tag': true, 'active': activeFilter === tag }"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Pizzas Grid -->
    <div v-if="isLoading" class="loading-message">Loading pizzas...</div>
    <div v-if="!isLoading && error" class="error-message">{{ error }}</div>
    <div v-if="!isLoading && !error && pizzas.length === 0" class="no-pizzas-message">
      No pizzas found for the "<strong>{{ activeFilter }}</strong>" category.
    </div>

    <div v-if="!isLoading && !error && pizzas.length > 0" class="pizza-grid">
      <PizzaCard v-for="pizza in pizzas" :key="pizza.id" :pizza="pizza" />
    </div>
  </div>
</template>

<script>
import PizzaService from '../services/pizzaService'
import PizzaCard from './PizzaCard.vue'
import { mapState } from 'vuex'
import { pizzaFilters } from '@/config/filters'

export default {
  name: 'ReviewsPage',
  components: {
    PizzaCard
  },
  data () {
    return {
      pizzas: [],
      isLoading: true,
      error: null,
      filters: pizzaFilters,
      activeFilter: 'All'
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    }),
    filteredPizzas () {
      if (this.activeFilter === 'All') {
        return this.pizzas
      }
      return this.pizzas.filter(pizza => pizza.category === this.activeFilter)
    }
  },
  watch: {
    '$route.query.filter': {
      immediate: true,
      handler (newFilter) {
        this.applyFilter(newFilter || 'All')
      }
    }
  },
  methods: {
    applyFilter (filter) {
      this.activeFilter = filter
      this.fetchPizzas()
    },
    async fetchPizzas () {
      this.isLoading = true
      this.error = null
      try {
        const searchQuery = this.activeFilter === 'All' ? '' : this.activeFilter
        const username = this.user ? this.user.name : null
        const response = await PizzaService.fetchPizzas(searchQuery, username)
        this.pizzas = response.data.sort((a, b) => (b.votes || 0) - (a.votes || 0))
      } catch (err) {
        console.error('Error fetching pizzas for reviews:', err)
        this.error = 'Could not load pizzas. Please try again later.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 40px 20px;
}
.page-header {
  text-align: center;
  margin-bottom: 40px;
}
.page-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-color-heading);
  margin-bottom: 8px;
}
.page-subtitle {
  font-size: 18px;
  color: var(--text-color-body);
}
.filter-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 40px;
}
.filter-tag {
  padding: 10px 25px;
  border: 1px solid #ddd;
  border-radius: 30px;
  background-color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
.filter-tag:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}
.filter-tag.active {
  background-color: var(--primary-red);
  color: white;
  border-color: var(--primary-red);
}
.loading-message, .error-message, .no-pizzas-message {
  text-align: center;
  padding: 40px;
}
.pizza-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}
</style>
