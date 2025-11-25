<template>
  <div class="min-h-screen bg-gray-50">
    <Toast ref="toast" :message="toastMessage" :type="toastType" />
    <div class="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="animate-pulse">
          <div class="px-4 py-5 sm:px-6">
            <div class="bg-zinc-200 h-6 rounded w-1/3 mb-2"></div>
            <div class="bg-zinc-200 h-4 rounded w-1/2"></div>
          </div>
          <div class="border-t border-zinc-200">
            <div class="px-4 py-5 sm:p-6">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-1">
                  <div class="bg-zinc-200 h-80 rounded-lg"></div>
                </div>
                <div class="lg:col-span-2 space-y-4">
                  <div class="bg-zinc-200 h-4 rounded w-3/4"></div>
                  <div class="bg-zinc-200 h-4 rounded w-1/2"></div>
                  <div class="bg-zinc-200 h-4 rounded w-2/3"></div>
                  <div class="bg-zinc-200 h-4 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-600">{{ error }}</p>
        <router-link
          to="/products"
          class="mt-4 inline-block px-4 py-2 text-sm font-medium text-white rounded-md bg-amber-600 hover:bg-amber-700"
        >
          Back to Products
        </router-link>
      </div>

      <!-- Product Details -->
      <div v-else-if="product" class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-start justify-between border-b border-zinc-100">
          <div class="text-sm text-zinc-500">
            <router-link to="/products" class="hover:underline">Products</router-link>
            <span class="mx-2">/</span>
            <span class="text-zinc-700 truncate">{{ product.title }}</span>
          </div>
        </div>

        <div class="border-t border-zinc-200">
          <div class="px-4 py-5 sm:p-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
              <!-- Product Image (Larger) -->
              <div class="lg:col-span-2 order-2 lg:order-1">
                <div class="rounded-xl overflow-hidden bg-zinc-100 border border-zinc-100 flex items-center justify-center">
                  <img
                    :src="product.thumbnail"
                    :alt="product.title"
                    class="max-w-full max-h-[250px] sm:max-h-[350px] lg:max-h-[520px] object-contain rounded-2xl"
                  />
                </div>
              </div>

              <!-- Product Information (Right column card) -->
              <div class="lg:col-span-1 order-1 lg:order-2">
                <div class="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-zinc-100">
                  <div>
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-zinc-900">
                      {{ product.title }}
                    </h1>
                    <p class="mt-2 text-sm text-zinc-500">
                      {{ product.description }}
                    </p>
                    <div class="flex flex-col sm:flex-row gap-2 mt-4">
                      <router-link
                        :to="`/products/${product.id}/edit`"
                        class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      >
                        <svg
                          class="h-4 w-4 -ml-1 mr-2 text-indigo-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                            stroke="currentColor"
                            stroke-width="1.2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        Edit
                      </router-link>
                      <button
                        @click="confirmDelete"
                        class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        <svg class="h-4 w-4 -ml-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>

                  <div class="mt-4 lg:mt-6 border-t border-zinc-100 pt-4 lg:pt-6 space-y-4 lg:space-y-6">
                    <div>
                      <div class="text-sm text-zinc-500">Price</div>
                      <div class="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-zinc-900">
                            ${{ Number(product.price).toFixed(2) }}
                          </div>
                        </div>
                        <div class="sm:text-right">
                          <div class="text-sm text-zinc-500">Category</div>
                          <div
                            class="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700"
                          >
                            {{ product.category }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div class="text-sm text-zinc-500">Stock</div>
                      <div class="mt-2 flex items-center gap-2">
                        <div
                          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800"
                        >
                          In Stock
                        </div>
                        <div class="text-sm text-zinc-700 font-semibold">
                          {{ product.stock }} units
                        </div>
                      </div>
                    </div>

                    <div>
                      <div class="text-sm font-medium text-zinc-700 mb-2">Description</div>
                      <p class="text-sm text-zinc-600 leading-relaxed">{{ product.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="px-4 py-5 sm:p-6">
            <div v-if="product" class="pt-6 border-t border-zinc-200">
              <h4 class="text-lg font-medium text-zinc-900 mb-4">Customer Reviews</h4>
              <div class="bg-white rounded-lg p-6 border border-zinc-200">
                <div class="flex flex-col lg:flex-row gap-6 items-start">
                  <div class="lg:w-1/3">
                    <div class="flex flex-col gap-2">
                      <div class="text-4xl font-extrabold text-zinc-900">
                        {{ displayRating.toFixed(1) }}
                      </div>
                      <div class="text-yellow-400 text-lg">★★★★★</div>
                      <div class="text-sm text-zinc-600">Based on {{ reviewCount }} reviews</div>
                    </div>
                  </div>

                  <div class="lg:w-2/3 w-full">
                    <div class="space-y-3">
                      <div v-for="n in [5, 4, 3, 2, 1]" :key="n" class="flex items-center gap-3">
                        <div class="w-4 text-sm text-zinc-700">{{ n }}</div>
                        <div class="flex-1 bg-zinc-100 rounded-full h-3 overflow-hidden">
                          <div
                            :style="{ width: getRatingPercent(n) + '%' }"
                            class="h-full bg-amber-400"
                          ></div>
                        </div>
                        <div class="w-12 text-right text-xs text-zinc-500">
                          {{ getRatingPercent(n) }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-zinc-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg font-medium text-gray-900">Confirm Delete</h3>
          <div class="mt-2 px-4 sm:px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-3 mt-4">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-200 hover:bg-zinc-300 rounded-md"
            >
              Cancel
            </button>
            <button
              @click="deleteProduct"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
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
const loading = ref(false)
const error = ref('')
const showDeleteModal = ref(false)

const fetchProduct = async () => {
  loading.value = true
  error.value = ''

  try {
    console.log('📎 Fetching product details for ID:', route.params.id)
    product.value = await productStore.fetchProductById(route.params.id)
    console.log('✅ Product details loaded:', product.value.title)
  } catch (err) {
    console.error('❌ Failed to load product:', err)
    error.value = 'Failed to load product'
  } finally {
    loading.value = false
  }
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  try {
    const productId = route.params.id
    if (!productId || productId === 'undefined') {
      throw new Error('Invalid product ID')
    }
    
    console.log('🗑️ Deleting product with ID:', productId)
    await productStore.deleteProduct(productId)
    console.log('✅ Product deleted successfully')
    
    toastMessage.value = 'Product deleted successfully!'
    toastType.value = 'success'
    toast.value?.show()
    
    setTimeout(() => {
      router.push('/products')
    }, 1500)
  } catch (err) {
    console.error('❌ Failed to delete product:', err)
    error.value = err.message || 'Failed to delete product'
    toastMessage.value = err.message || 'Failed to delete product'
    toastType.value = 'error'
    toast.value?.show()
  }
  showDeleteModal.value = false
}

import { computed } from 'vue'

const getRatingPercent = (star) => {
  // If we have real review data compute actual percentage, otherwise return sample values from the mock
  const reviews = product.value?.reviews
  if (!reviews || reviews.length === 0) {
    const sample = { 5: 75, 4: 15, 3: 5, 2: 3, 1: 2 }
    return sample[star] || 0
  }

  const total = reviews.length
  const count = reviews.filter((r) => Math.round(r.rating) === star).length
  return Math.round((count / Math.max(1, total)) * 100)
}

const displayRating = computed(() => {
  if (product.value?.rating) return Number(product.value.rating)
  // mock fallback
  return 4.5
})

const reviewCount = computed(() =>
  product.value?.reviews?.length ? product.value.reviews.length : 120,
)

onMounted(() => {
  fetchProduct()
})
</script>
