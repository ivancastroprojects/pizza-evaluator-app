import api from './Api'

const VoteService = {
  /**
   * Cast a vote for a pizza.
   * @param {string} voterUsername - The username of the person voting.
   * @param {string} pizzaName - The name of the pizza being voted for.
   * @returns {Promise} The promise from the API call.
   */
  castVote (voteData) {
    return api.post('/vote', voteData)
  }
}

export default VoteService
