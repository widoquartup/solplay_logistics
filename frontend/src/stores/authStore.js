// authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    refreshToken: localStorage.getItem('authRefreshToken') || null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    setToken(token) {
      this.token = token
      if (token) {
        localStorage.setItem('authToken', token)
      } else {
        localStorage.removeItem('authToken')
      }
    },
    setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken
      if (refreshToken) {
        localStorage.setItem('authRefreshToken', refreshToken)
      } else {
        localStorage.removeItem('authRefreshToken')
      }
    },
    logout() {
      this.setToken(null)
      this.setRefreshToken(null)
    }
  }
})
