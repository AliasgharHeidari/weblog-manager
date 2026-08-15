import api from './api'

class AuthService {
  async register(username, email, password) {
    const response = await api.post('/auth/register', { username, email, password })
    return response.data
  }

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  }

  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  }

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  }
}

export default new AuthService()
