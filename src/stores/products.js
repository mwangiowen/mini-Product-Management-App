import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchProducts() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch('https://dummyjson.com/products')
        const data = await response.json()
        this.products = data.products
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    async fetchProductById(id) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`)
        return await response.json()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async addProduct(payload) {
      const authStore = useAuthStore()
      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch('https://dummyjson.com/products/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(payload),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to add product')
        }
        
        const newProduct = await response.json()
        this.products.unshift(newProduct)
        return newProduct
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateProduct(id, payload) {
      const authStore = useAuthStore()
      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(payload),
        })
        
        const updatedProduct = await response.json()
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = updatedProduct
        }
        return updatedProduct
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteProduct(id) {
      const authStore = useAuthStore()
      this.isLoading = true
      this.error = null
      
      try {
        if (!id || id === 'undefined') {
          throw new Error('Invalid product ID')
        }
        
        const response = await fetch(`https://dummyjson.com/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
          },
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Failed to delete product`)
        }
        
        this.products = this.products.filter(p => p.id != id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})