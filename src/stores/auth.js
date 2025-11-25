import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    // small per-user preferences persisted separately
    preferences: JSON.parse(localStorage.getItem('userPreferences') || 'null') || {
      allowNotifications: true,
      emailUpdates: true,
      twoFactor: false,
      darkMode: false,
    },
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        console.log('🔐 Attempting login with:', { username: credentials.username, password: '***' })

        const response = await fetch('https://dummyjson.com/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
            expiresInMins: 30,
          }),
        })

        console.log('📡 Login response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error('❌ Login error response:', errorData)
          throw new Error(errorData.message || `Login failed with status ${response.status}`)
        }

        const data = await response.json()
        console.log('✅ Login successful:', {
          id: data.id,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        })

        this.token = data.accessToken
        this.user = {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          image: data.image,
          refreshToken: data.refreshToken,
        }

        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('user', JSON.stringify(this.user))

        return data
      } catch (error) {
        console.error('❌ Login error:', error)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new Error('Network error - please check your internet connection')
        }
        throw error
      }
    },

    logout() {
      console.log('🚪 Logging out user')
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userPreferences')
    },

    restoreSession() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      const preferences = localStorage.getItem('userPreferences')
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        if (preferences) this.preferences = JSON.parse(preferences)
      }
    },

    // Update just preferences and persist
    updatePreferences(newPrefs) {
      this.preferences = { ...this.preferences, ...newPrefs }
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences))
    },

    // Set user (useful for demo seeding)
    setUser(userObj, token) {
      this.user = userObj
      if (token) this.token = token
      localStorage.setItem('user', JSON.stringify(this.user))
      if (token) localStorage.setItem('token', token)
    },

    // Seed a demo Emily Johnson user (for local development)
    setDemoUser() {
      const demo = {
        id: 1,
        username: 'emilys',
        email: 'emily.johnson@x.dummyjson.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        gender: 'female',
        image: 'https://dummyjson.com/icon/emilys/128',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJlbWlseXMiLCJlbWFpbCI6ImVtaWx5LmpvaG5zb25AeC5kdW1teWpzb24uY29tIiwiZmlyc3ROYW1lIjoiRW1pbHkiLCJsYXN0TmFtZSI6IkpvaG5zb24iLCJnZW5kZXIiOiJmZW1hbGUiLCJpbWFnZSI6Imh0dHBzOi8vZHVtbXlqc29uLmNvbS9pY29uL2VtaWx5cy8xMjgiLCJpYXQiOjE3NjQwNDk1NjIsImV4cCI6MTc2NjY0MTU2Mn0.5u2iAxwAVPR9wnub6HjLMkFSDeQEC1FqLqxRp632m2Q',
      }

      const prefs = {
        allowNotifications: true,
        emailUpdates: true,
        twoFactor: false,
        darkMode: false,
      }

      this.setUser(demo, demo.refreshToken)
      this.preferences = prefs
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences))
    },

    async getCurrentUser() {
      if (!this.token) {
        throw new Error('No token available')
      }

      try {
        console.log('👤 Getting current user info')
        const response = await fetch('https://dummyjson.com/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
          credentials: 'include',
        })

        if (!response.ok) {
          console.error('❌ Failed to get current user, status:', response.status)
          throw new Error('Failed to get current user')
        }

        const userData = await response.json()
        console.log('✅ Current user data:', userData)
        this.user = userData
        localStorage.setItem('user', JSON.stringify(this.user))
        return userData
      } catch (error) {
        console.error('❌ Get current user error:', error)
        throw error
      }
    },

    async refreshToken() {
      if (!this.user?.refreshToken) {
        throw new Error('No refresh token available')
      }

      try {
        console.log('🔄 Refreshing auth token')
        const response = await fetch('https://dummyjson.com/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: this.user.refreshToken,
            expiresInMins: 30,
          }),
          credentials: 'include',
        })

        if (!response.ok) {
          console.error('❌ Failed to refresh token, status:', response.status)
          throw new Error('Failed to refresh token')
        }

        const data = await response.json()
        console.log('✅ Token refreshed successfully')
        this.token = data.accessToken
        if (data.refreshToken) {
          this.user.refreshToken = data.refreshToken
        }
        
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        return data
      } catch (error) {
        console.error('❌ Refresh token error:', error)
        this.logout()
        throw error
      }
    },
  },
})
