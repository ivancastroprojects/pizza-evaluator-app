import Api from '@/services/Api'

export default {
  register (credentials) {
    return Api.post('register', credentials)
  },
  login (credentials) {
    return Api.post('login', credentials)
  },
  getAvatar (username) {
    return Api.get(`user-avatar/${username}`)
  }
}
