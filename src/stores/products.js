import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    total: 0,
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchProducts(limit = 30, skip = 0, search = '') {
      this.isLoading = true
      this.error = null
      
      try {
        let url = `https://dummyjson.com/products`
        
        if (search) {
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`
          if (limit !== 30 || skip !== 0) {
            url += `&limit=${limit}&skip=${skip}`
          }
        } else {
          url += `?limit=${limit}&skip=${skip}`
        }
        
        console.log('Fetching products:', url)
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Products response:', data)
        
        this.products = data.products
        this.total = data.total
      } catch (error) {
        console.error('Fetch products error:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    async fetchProductById(id) {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('Fetching product by ID:', id)
        const response = await fetch(`https://dummyjson.com/products/${id}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const product = await response.json()
        console.log('Product response:', product)
        return product
      } catch (error) {
        console.error('Fetch product by ID error:', error)
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
        console.log('Adding product:', payload)
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
          console.error('Add product error response:', errorData)
          throw new Error(errorData.message || 'Failed to add product')
        }
        
        const newProduct = await response.json()
        console.log('Product added successfully:', newProduct)
        this.products.unshift(newProduct)
        this.total += 1
        return newProduct
      } catch (error) {
        console.error('Add product error:', error)
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
        console.log('Updating product:', id, payload)
        const response = await fetch(`https://dummyjson.com/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(payload),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Update product error response:', errorData)
          throw new Error(errorData.message || 'Failed to update product')
        }
        
        const updatedProduct = await response.json()
        console.log('Product updated successfully:', updatedProduct)
        
        const index = this.products.findIndex(p => p.id == id)
        if (index !== -1) {
          this.products[index] = updatedProduct
        }
        return updatedProduct
      } catch (error) {
        console.error('Update product error:', error)
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
        
        console.log('Deleting product:', id)
        const response = await fetch(`https://dummyjson.com/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
          },
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Delete product error response:', errorData)
          throw new Error(errorData.message || 'Failed to delete product')
        }
        
        const deletedProduct = await response.json()
        console.log('Product deleted successfully:', deletedProduct)
        
        this.products = this.products.filter(p => p.id != id)
        this.total -= 1
      } catch (error) {
        console.error('Delete product error:', error)
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchCategories() {
      try {
        console.log('Fetching categories')
        const response = await fetch('https://dummyjson.com/products/categories')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const categories = await response.json()
        console.log('Categories response:', categories)
        return categories
      } catch (error) {
        console.error('Fetch categories error:', error)
        throw error
      }
    },
  },
})