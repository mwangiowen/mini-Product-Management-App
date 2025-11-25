<template>
  <div class="min-h-screen bg-gray-50">
    <Toast ref="toast" :message="toastMessage" :type="toastType" />
    <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div class="mb-4 sm:mb-6">
        <div class="flex items-start sm:items-center gap-4 mb-4">
          <button @click="$router.go(-1)" class="text-zinc-600 hover:text-zinc-900 mt-1 sm:mt-0">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-zinc-900">Add New Product</h1>
            <p class="text-sm text-zinc-500 mt-1 sm:mt-2">Enter the details below to add a new item to your inventory.</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div class="border-b pb-4">
          <h2 class="text-sm font-semibold text-zinc-900">Product Information</h2>
        </div>

        <div>
          <label for="title" class="block text-sm font-medium text-zinc-700">Title *</label>
          <input id="title" v-model="form.title" type="text" required class="mt-1 block w-full px-3 py-2 border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-300" />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-zinc-700">Description</label>
          <textarea id="description" v-model="form.description" rows="3" class="mt-1 block w-full px-3 py-2 border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-300"></textarea>
        </div>

        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label for="price" class="block text-sm font-medium text-zinc-700">Price</label>
            <input id="price" v-model.number="form.price" type="number" step="0.01" min="0" placeholder="$ 0.00" class="mt-1 block w-full px-3 py-2 border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-300" />
          </div>

          <div>
            <label for="stock" class="block text-sm font-medium text-zinc-700">Stock Quantity</label>
            <input id="stock" v-model.number="form.stock" type="number" min="0" placeholder="Enter stock quantity" class="mt-1 block w-full px-3 py-2 border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-300" />
          </div>
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-zinc-700">Category</label>
          <select id="category" v-model="form.category" class="mt-1 block w-full px-3 py-2 border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-300">
            <option value="">Select a category</option>
            <option>Apparel</option>
            <option>Electronics</option>
            <option>Groceries</option>
          </select>
        </div>

        <div class="border-t pt-4">
          <h3 class="text-sm font-semibold text-zinc-900 mb-2">Media</h3>

          <label class="block w-full border-2 border-dashed border-zinc-200 rounded-lg p-8 text-center bg-zinc-50 cursor-pointer hover:border-indigo-300">
            <div v-if="!form.thumbnail" class="flex flex-col items-center gap-2 text-sm text-zinc-500">
              <svg class="h-8 w-8 text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v14M5 10l7-7 7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <div>Click to upload or drag and drop</div>
              <div class="text-xs text-zinc-400">SVG, PNG, JPG or GIF (MAX: 800x400px)</div>
            </div>
            <div v-else class="flex flex-col items-center gap-3">
              <img :src="form.thumbnail" alt="Preview" class="h-20 w-20 object-cover rounded-lg border" />
              <div class="text-sm text-green-600 font-medium">{{ uploadedFileName }}</div>
              <div class="text-xs text-zinc-400">Click to change image</div>
            </div>
            <input type="file" accept="image/*" @change="handleUpload" class="hidden" />
          </label>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4">
          <router-link to="/products" class="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-center">Cancel</router-link>
          <button type="submit" :disabled="loading" class="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50" style="background-color: #000080">{{ loading ? 'Saving...' : 'Save Product' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import Toast from '../components/Toast.vue'

const router = useRouter()
const productStore = useProductStore()
const toast = ref(null)
const toastMessage = ref('')
const toastType = ref('info')

const form = ref({
  title: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  thumbnail: '',
  brand: '',
  sku: ''
})

const loading = ref(false)
const error = ref('')
const uploadedFileName = ref('')

const handleSubmit = async () => {
  if (!form.value.title.trim()) {
    error.value = 'Title is required'
    toastMessage.value = 'Title is required'
    toastType.value = 'error'
    toast.value?.show()
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log('📦 Submitting new product:', form.value)
    const result = await productStore.addProduct(form.value)
    console.log('✅ Product added successfully:', result)
    
    toastMessage.value = 'Product added successfully!'
    toastType.value = 'success'
    toast.value?.show()
    
    setTimeout(() => {
      router.push('/products')
    }, 1500)
  } catch (err) {
    console.error('❌ Failed to add product:', err)
    error.value = err.message || 'Failed to add product'
    toastMessage.value = err.message || 'Failed to add product'
    toastType.value = 'error'
    toast.value?.show()
  } finally {
    loading.value = false
  }
}

const handleUpload = (e) => {
  const f = e.target.files?.[0]
  if (!f) return
  
  console.log('🖼️ Uploading image:', f.name, 'Size:', f.size)
  uploadedFileName.value = f.name
  
  const reader = new FileReader()
  reader.onload = () => {
    form.value.thumbnail = reader.result
    console.log('✅ Image uploaded successfully:', f.name)
    toastMessage.value = `Image "${f.name}" uploaded successfully!`
    toastType.value = 'success'
    toast.value?.show()
  }
  reader.readAsDataURL(f)
}
</script>