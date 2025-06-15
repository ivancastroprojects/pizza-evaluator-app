import api from './Api'

const PizzaService = {
  /**
   * Creates a new pizza.
   * @param {object} pizzaData - The data for the new pizza.
   * @param {string} pizzaData.name - The name of the pizza.
   * @param {string} pizzaData.ingredients - The ingredients of the pizza.
   * @param {string} pizzaData.imageUrl - The URL of the pizza image.
   * @param {number} pizzaData.price - The price of the pizza.
   * @returns {Promise} The promise from the API call.
   */
  createPizza (pizzaData) {
    return api.post('/pizzas', pizzaData)
  },

  /**
   * Fetches all pizzas.
   * @param {string} searchQuery - Optional search query.
   * @param {string} username - Optional username.
   * @returns {Promise} The promise from the API call, resolving with pizza data.
   */
  fetchPizzas (searchQuery = '', username = null) {
    const params = {}
    if (searchQuery) {
      params.search = searchQuery
    }
    if (username) {
      params.username = username
    }
    return api.get('/pizzas', { params })
  },

  /**
   * Updates the votes for a pizza.
   * @param {number|string} pizzaId - The ID of the pizza.
   * @param {number} votes - The new vote count.
   * @returns {Promise} The promise from the API call.
   */
  updatePizzaVotes (pizzaId, votes) {
    return api.put(`/pizzas/${pizzaId}`, { votes })
  },

  /**
   * Updates an existing pizza.
   * @param {number|string} pizzaId - The ID of the pizza to update.
   * @param {object} pizzaData - The new data for the pizza.
   * @returns {Promise} The promise from the API call.
   */
  updatePizza (pizzaId, pizzaData) {
    return api.put(`/pizzas/${pizzaId}`, pizzaData)
  },

  /**
   * Deletes a pizza.
   * @param {number|string} pizzaId - The ID of the pizza to delete.
   * @returns {Promise} The promise from the API call.
   */
  deletePizza (pizzaId) {
    return api.delete(`/pizzas/${pizzaId}`)
  },

  /**
   * Submits a pizza suggestion.
   * @param {object} suggestionData - The suggestion data.
   * @param {string} suggestionData.name - The name of the pizza.
   * @param {string} suggestionData.sourceName - The brand of the pizza.
   * @param {string} suggestionData.description - A description for the pizza.
   * @param {string} suggestionData.submittedBy - The name of the user submitting.
   * @returns {Promise} The promise from the API call.
   */
  suggestPizza (suggestionData) {
    return api.post('/pizzas/suggest', suggestionData)
  }
  // Add other pizza-related methods here later (e.g., updatePizza, deletePizza)
}

export default PizzaService
