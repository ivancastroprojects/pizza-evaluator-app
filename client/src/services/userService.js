import Api from '@/services/Api'

export default {
  // --- User Management ---
  getUsers () {
    return Api.get('users') // Endpoint to get all non-manager users
  },
  updateUser (userData) {
    return Api.post('edit', userData) // 'edit' endpoint seems to handle user updates
  },
  deleteUser (username) {
    return Api.delete(`users?name=${username}`)
  },
  createUser (userData) {
    // Assuming the register endpoint can be used by admins to create users
    // Note: This might need a separate admin-specific endpoint in a real app
    return Api.post('register', userData)
  },

  // --- Manager Management ---
  getManagers () {
    return Api.get('managers')
  },
  updateManager (managerData) {
    return Api.post('edit-manager', managerData)
  },
  deleteManager (managerId) {
    return Api.delete(`managers/${managerId}`)
  },
  createManager (managerData) {
    return Api.post('managers/register', managerData)
  },

  // --- Voting System ---
  votePizza (voterUsername, pizzaName) {
    return Api.post('vote', { voterUsername, pizzaName })
  },
  getVotesLeft (voterUsername) {
    return Api.get(`votes-left/${voterUsername}`)
  },

  // pizzas data
  sendPizza (pizzaCount) {
    return Api.post('pizza', pizzaCount)
  },
  getPizza () {
    return Api.get('pizza')
  }
}
