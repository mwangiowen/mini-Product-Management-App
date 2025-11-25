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
        console.log('Attempting login with:', credentials)

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

        console.log('Response status:', response.status)
        console.log('Response headers:', response.headers)

        if (!response.ok) {
          const errorText = await response.text()
          console.log('Error response:', errorText)
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        console.log('Response data:', data)

        // DummyJSON returns accessToken, not token
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
        console.error('Login error:', error)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new Error('Network error - please check your internet connection')
        }
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
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
  },
})
