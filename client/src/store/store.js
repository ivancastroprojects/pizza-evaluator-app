import Vue from 'vue'
import Vuex from 'vuex'
import UserService from '../services/userService'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    userVotesRemaining: 3
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      state.isUserLoggedIn = !!token
    },
    setUser (state, user) {
      state.user = user
    },
    SET_VOTES_REMAINING (state, count) {
      state.userVotesRemaining = count
    }
  },
  actions: {
    setToken ({ commit }, token) {
      commit('setToken', token)
    },
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    async fetchVotesRemaining ({ commit, state }) {
      if (!state.user) return
      try {
        const response = await UserService.getVotesLeft(state.user.name)
        commit('SET_VOTES_REMAINING', response.data.votesRemaining)
      } catch (error) {
        console.error('Error fetching votes remaining:', error)
      }
    },
    async voteRegistered ({ commit }, newVotesRemaining) {
      commit('SET_VOTES_REMAINING', newVotesRemaining)
    }
  },
  getters: {
    userVotesRemaining: state => state.userVotesRemaining
  }
})
