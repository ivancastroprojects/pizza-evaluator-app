<template>
  <div class="page-container container">
    <header class="page-header">
      <h1 class="page-title">All Pizzas</h1>
      <p class="page-subtitle">Discover and compare all available pizzas, sorted by popularity.</p>
    </header>

    <!-- Suggestion Button and Form -->
    <div v-if="user" class="suggestion-section">
      <button @click="showSuggestionForm = !showSuggestionForm" class="btn-suggest">
        {{ showSuggestionForm ? 'Cancelar' : 'Sugerir una Pizza' }}
      </button>
      <form v-if="showSuggestionForm" @submit.prevent="submitSuggestion" class="suggestion-form">
        <h3>¡Propón una nueva pizza!</h3>
        <input type="text" v-model="suggestion.name" placeholder="Nombre de la pizza" required>
        <input type="text" v-model="suggestion.sourceName" placeholder="Marca (ej. Domino's)" required>
        <textarea v-model="suggestion.description" placeholder="Añade una descripción (opcional)"></textarea>
        <button type="submit">Enviar Sugerencia</button>
      </form>
    </div>

    <!-- Search Bar -->
    <div class="search-wrapper">
      <input type="text" v-model="searchQuery" placeholder="Search by name or ingredient..." class="search-input">
    </div>

    <div v-if="isLoading" class="loading-message">Loading pizza statistics...</div>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="!isLoading && !error && sortedPizzas.length === 0" class="no-pizzas-message">
      No pizzas found for your search. Try another term!
    </div>

    <div v-if="!isLoading && !error && sortedPizzas.length > 0" class="pizza-grid">
      <PizzaCard v-for="pizza in sortedPizzas" :key="pizza.id" :pizza="pizza" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PizzaService from '../services/pizzaService'
import PizzaCard from './PizzaCard.vue'

export default {
  name: 'PizzasPage',
  components: {
    PizzaCard
  },
  data () {
    return {
      pizzas: [],
      isLoading: true,
      error: null,
      searchQuery: this.$route.query.search || '',
      showSuggestionForm: false,
      suggestion: {
        name: '',
        sourceName: '',
        description: ''
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    }),
    sortedPizzas () {
      return [...this.pizzas].sort((a, b) => (b.votes || 0) - (a.votes || 0))
    }
  },
  watch: {
    searchQuery () {
      this.fetchPizzas()
    }
  },
  async mounted () {
    await this.fetchPizzas()
  },
  methods: {
    async submitSuggestion () {
      if (!this.suggestion.name || !this.suggestion.sourceName) {
        alert('Por favor, completa el nombre y la marca de la pizza.')
        return
      }
      try {
        await PizzaService.suggestPizza({
          ...this.suggestion,
          submittedBy: this.user.name
        })
        alert('¡Gracias por tu sugerencia! La revisaremos pronto.')
        this.showSuggestionForm = false
        this.suggestion.name = ''
        this.suggestion.sourceName = ''
        this.suggestion.description = ''
      } catch (error) {
        console.error('Error submitting suggestion:', error)
        alert('Hubo un error al enviar tu sugerencia. Por favor, inténtalo de nuevo.')
      }
    },
    async fetchPizzas () {
      this.isLoading = true
      this.error = null
      try {
        const username = this.user ? this.user.name : null
        const response = await PizzaService.fetchPizzas(this.searchQuery, username)
        this.pizzas = response.data
      } catch (err) {
        console.error('Error fetching pizzas:', err)
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
  padding-top: 40px;
  padding-bottom: 40px;
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

.loading-message,
.error-message,
.no-pizzas-message {
  text-align: center;
  font-size: 1.2em;
  padding: 40px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-top: 20px;
  color: var(--text-color-body);
}

.error-message {
  color: #d93025;
  background-color: #fbe9e7;
  border: 1px solid #d93025;
}

.pizza-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.search-wrapper {
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-input {
  width: 100%;
  padding: 15px 20px;
  font-size: 16px;
  border-radius: 30px;
  border: 1px solid #ddd;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-input:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 0 3px rgba(225, 46, 46, 0.2);
}

.suggestion-section {
  max-width: 600px;
  margin: 0 auto 30px auto;
  text-align: center;
}

.btn-suggest {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 25px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 20px;
}

.btn-suggest:hover {
  background-color: #0056b3;
}

.suggestion-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  text-align: left;
}

.suggestion-form h3 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--text-color-heading);
}

.suggestion-form input,
.suggestion-form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box; /* Important */
}

.suggestion-form textarea {
  resize: vertical;
  min-height: 80px;
}

.suggestion-form button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;
}

.suggestion-form button:hover {
  background-color: #218838;
}
</style>
