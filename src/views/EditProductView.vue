<template>
  <div class="min-h-screen bg-gray-50">
    <Toast ref="toast" :message="toastMessage" :type="toastType" />
    <div class="px-6 lg:px-8 py-8">
      <div class="mb-6">
        <div class="flex items-center gap-4 mb-4">
          <button @click="$router.go(-1)" class="text-zinc-600 hover:text-zinc-900">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h1 class="text-3xl font-extrabold text-zinc-900">Edit Product</h1>
            <p class="text-sm text-zinc-500 mt-2">Update the product details below.</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="bg-white rounded-lg shadow-sm p-6">
        <div class="animate-pulse space-y-4">
          <div class="bg-zinc-200 h-4 rounded w-1/4"></div>
          <div class="bg-zinc-200 h-10 rounded"></div>
          <div class="bg-zinc-200 h-20 rounded"></div>
        </div>
      </div>

      <form v-else-if="product" @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-sm p-6 space-y-6">
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="price" class="block text-sm font-medium text-zinc-700">Price</label>
            <input id="price" v-model.number="form.price" type="number" step="0.01" min="0" class="mt-1 block w-full px-3 py-2 border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-300" />
          </div>

          <div>
            <label for="stock" class="block text-sm font-medium text-zinc-700">Stock Quantity</label>
            <input id="stock" v-model.number="form.stock" type="number" min="0" class="mt-1 block w-full px-3 py-2 border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-300" />
          </div>
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-zinc-700">Category</label>
          <select id="category" v-model="form.category" class="mt-1 block w-full px-3 py-2 border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-300">
            <option value="">Select a category</option>
            <option>beauty</option>
            <option>fragrances</option>
            <option>furniture</option>
            <option>groceries</option>
            <option>home-decoration</option>
            <option>kitchen-accessories</option>
            <option>laptops</option>
            <option>mens-shirts</option>
            <option>mens-shoes</option>
            <option>mens-watches</option>
            <option>mobile-accessories</option>
            <option>motorcycle</option>
            <option>skin-care</option>
            <option>smartphones</option>
            <option>sports-accessories</option>
            <option>sunglasses</option>
            <option>tablets</option>
            <option>tops</option>
            <option>vehicle</option>
            <option>womens-bags</option>
            <option>womens-dresses</option>
            <option>womens-jewellery</option>
            <option>womens-shoes</option>
            <option>womens-watches</option>
          </select>
        </div>

        <div class="border-t pt-4">
          <h3 class="text-sm font-semibold text-zinc-900 mb-2">Media</h3>

          <label class="block w-full border-2 border-dashed border-zinc-200 rounded-lg p-8 text-center bg-zinc-50 cursor-pointer hover:border-indigo-300">
            <div v-if="!uploadedFileName && !form.thumbnail" class="flex flex-col items-center gap-2 text-sm text-zinc-500">
              <svg class="h-8 w-8 text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v14M5 10l7-7 7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <div>Click to upload or drag and drop</div>
              <div class="text-xs text-zinc-400">SVG, PNG, JPG or GIF (MAX: 800x400px)</div>
            </div>
            <div v-else class="flex flex-col items-center gap-3">
              <img :src="form.thumbnail" alt="Preview" class="h-20 w-20 object-cover rounded-lg border" />
              <div class="text-sm text-green-600 font-medium">{{ uploadedFileName || 'Current image' }}</div>
              <div class="text-xs text-zinc-400">Click to change image</div>
            </div>
            <input type="file" accept="image/*" @change="handleUpload" class="hidden" />
          </label>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4">
          <router-link :to="`/products/${$route.params.id}`" class="px-4 py-2 text-sm font-medium rounded-lg transition-colors" style="color: #000080; border: 1px solid #000080;" onmouseover="this.style.backgroundColor='#000080'; this.style.color='white'" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#000080'">Cancel</router-link>
          <button type="submit" :disabled="submitting" class="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50" style="background-color: #000080">{{ submitting ? 'Updating...' : 'Update Product' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import Toast from '../components/Toast.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const toast = ref(null)
const toastMessage = ref('')
const toastType = ref('info')

const product = ref(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const uploadedFileName = ref('')

const form = ref({
  title: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  thumbnail: ''
})

const fetchProduct = async () => {
  try {
    product.value = await productStore.fetchProductById(route.params.id)
    form.value = {
      title: product.value.title,
      description: product.value.description,
      category: product.value.category,
      price: product.value.price,
      stock: product.value.stock,
      thumbnail: product.value.thumbnail
    }
  } catch (err) {
    error.value = 'Failed to load product'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!form.value.title.trim()) {
    error.value = 'Title is required'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    await productStore.updateProduct(route.params.id, form.value)
    router.push(`/products/${route.params.id}`)
  } catch (err) {
    error.value = 'Failed to update product'
  } finally {
    submitting.value = false
  }
}

const handleUpload = (e) => {
  const f = e.target.files?.[0]
  if (!f) return
  
  uploadedFileName.value = f.name
  const reader = new FileReader()
  reader.onload = () => {
    form.value.thumbnail = reader.result
    toastMessage.value = `Image "${f.name}" uploaded successfully`
    toastType.value = 'success'
    toast.value?.show()
  }
  reader.readAsDataURL(f)
}

onMounted(() => {
  fetchProduct()
})
</script>