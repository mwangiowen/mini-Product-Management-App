<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <!-- Top header (title + subtitle + Add New Product) -->
      <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-zinc-900">Products</h1>
          <p class="mt-1 sm:mt-2 text-sm text-zinc-500">
            Manage your inventory and view product performance.
          </p>
        </div>
        <router-link
          to="/products/new"
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-md w-full sm:w-auto"
          style="background-color: #000080"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Product
        </router-link>
      </div>

      <!-- Search / Filters row (rounded) -->
      <div
        class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div class="flex-1 flex items-center bg-zinc-100 rounded-lg px-4 py-2 max-w-3xl">
          <svg
            class="h-5 w-5 text-zinc-400 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by product name..."
            class="bg-transparent w-full text-sm placeholder:text-zinc-400 focus:outline-none"
          />
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            v-model="categoryFilter"
            class="px-3 py-2 text-sm border border-gray-200 rounded-md bg-white"
          >
            <option value="">Category</option>
            <option v-for="category in availableCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>

          <select
            v-model="stockFilter"
            class="px-3 py-2 text-sm border border-gray-200 rounded-md bg-white"
          >
            <option value="">Stock Status</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <!-- Search and Controls -->
      <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div
          class="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 space-y-4 lg:space-y-0"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
          >
            <h3 class="text-lg font-medium text-gray-900">Product Inventory</h3>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {{ filteredProducts.length }} of {{ productStore.products.length }} products
            </span>
          </div>

          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <!-- View Toggle -->
            <div class="flex rounded-md shadow-sm">
              <button
                @click="viewMode = 'table'"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-l-md border',
                  viewMode === 'table'
                    ? 'text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                ]"
:style="viewMode === 'table' ? 'background-color: #000080' : ''"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 10h18M3 6h18m-9 8h9"
                  ></path>
                </svg>
              </button>
              <button
                @click="viewMode = 'card'"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b',
                  viewMode === 'card'
                    ? 'text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                ]"
:style="viewMode === 'card' ? 'background-color: #000080' : ''"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  ></path>
                </svg>
              </button>
            </div>

            <!-- Items per page -->
            <select
              v-model="itemsPerPage"
              class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="4">4 per page</option>
              <option :value="10">10 per page</option>
              <option :value="25">25 per page</option>
              <option :value="50">50 per page</option>
              <option :value="100">100 per page</option>
            </select>


          </div>
        </div>

        <!-- (Removed duplicate search input — top search controls handle searching) -->
      </div>

      <!-- Loading State -->
      <div v-if="productStore.isLoading" class="space-y-4">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="animate-pulse">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-for="i in 6" :key="i" class="space-y-3">
                <div class="bg-zinc-200 h-48 rounded-lg"></div>
                <div class="space-y-2">
                  <div class="bg-zinc-200 h-4 rounded w-3/4"></div>
                  <div class="bg-zinc-200 h-3 rounded w-1/2"></div>
                  <div class="bg-zinc-200 h-3 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="productStore.error" class="text-center py-8">
        <p class="text-red-600">{{ productStore.error }}</p>
      </div>

      <!-- Products Display -->
      <div v-else>
        <!-- Table View -->
        <div v-if="viewMode === 'table'" class="bg-white shadow overflow-hidden sm:rounded-lg">
          <!-- Table Header -->
          <div class="px-6 py-3 bg-gray-50 border-b border-gray-200 hidden md:block">
            <div
              class="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div class="col-span-1">Image</div>
              <div class="col-span-4">Product Details</div>
              <div class="col-span-2">Category & Brand</div>
              <div class="col-span-2">Price</div>
              <div class="col-span-1">Stock</div>
              <div class="col-span-1">Rating</div>
              <div class="col-span-1">Actions</div>
            </div>
          </div>

          <!-- Table Body -->
          <ul class="divide-y divide-gray-200">
            <li
              v-for="product in paginatedProducts"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="px-6 py-4">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <!-- Image -->
                  <div class="md:col-span-1">
                    <img
                      :src="product.thumbnail"
                      :alt="product.title"
                      class="h-16 w-16 rounded-lg object-cover shadow-sm mx-auto md:mx-0"
                    />
                  </div>

                  <!-- Product Details -->
                  <div class="md:col-span-4">
                    <h3 class="text-sm font-semibold text-zinc-900 mb-1">
                      {{ product.title }}
                    </h3>
                    <p class="text-sm text-zinc-600 mb-2">
                      <span v-if="!isDescriptionExpanded(product.id)">
                        {{ truncateDescription(product.description, 120) }}
                        <button
                          v-if="product.description.length > 120"
                          @click="toggleDescription(product.id)"
                          class="text-blue-600 hover:text-blue-800 ml-1"
                        >
                          View more
                        </button>
                      </span>
                      <span v-else>
                        {{ product.description }}
                        <button
                          @click="toggleDescription(product.id)"
                          class="text-blue-600 hover:text-blue-800 ml-1"
                        >
                          View less
                        </button>
                      </span>
                    </p>
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="tag in product.tags?.slice(0, 3)"
                        :key="tag"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-800"
                      >
                        {{ tag }}
                      </span>
                      <span v-if="product.tags?.length > 3" class="text-xs text-zinc-500">
                        +{{ product.tags.length - 3 }} more
                      </span>
                    </div>
                  </div>

                  <!-- Category & Brand -->
                  <div class="md:col-span-2">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize mb-1"
                    >
                      {{ product.category }}
                    </span>
                    <p v-if="product.brand" class="text-sm text-zinc-600">
                      <strong>Brand:</strong> {{ product.brand }}
                    </p>
                    <p v-if="product.sku" class="text-xs text-zinc-500">SKU: {{ product.sku }}</p>
                  </div>

                  <!-- Price -->
                  <div class="md:col-span-2">
                    <div class="text-lg font-semibold text-zinc-900">${{ product.price }}</div>
                    <div v-if="product.discountPercentage > 0" class="text-sm">
                      <span class="text-amber-600 font-medium"
                        >{{ product.discountPercentage }}% OFF</span
                      >
                      <div class="text-xs text-zinc-500 line-through">
                        ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
                      </div>
                    </div>
                  </div>

                  <!-- Stock -->
                  <div class="md:col-span-1">
                    <div
                      class="text-sm font-medium"
                      :class="getStockStatus(product.stock).class.split(' ')[0]"
                    >
                      {{ product.stock }}
                    </div>
                    <div class="text-xs" :class="getStockStatus(product.stock).class">
                      {{ getStockStatus(product.stock).text }}
                    </div>
                  </div>

                  <!-- Rating -->
                  <div class="md:col-span-1">
                    <div class="flex items-center">
                      <span class="text-yellow-400">★</span>
                      <span class="ml-1 text-sm text-zinc-600">{{
                        product.rating?.toFixed(1) || 'N/A'
                      }}</span>
                    </div>
                    <div v-if="product.reviews" class="text-xs text-zinc-500">
                      {{ product.reviews.length }} reviews
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="md:col-span-1">
                    <button
                      @click="viewProduct(product.id)"
                      class="w-full px-3 py-1 text-xs font-medium text-white rounded-md transition-colors"
                      style="background-color: #000080"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Card View -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div class="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                :src="product.thumbnail"
                :alt="product.title"
                class="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
                @error="$event.target.src = 'https://via.placeholder.com/400x300?text=No+Image'"
              />
            </div>

            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-gray-900 truncate flex-1">
                  {{ product.title }}
                </h3>
                <div class="flex items-center ml-2">
                  <div class="flex text-yellow-400">
                    <span v-for="i in 5" :key="i">★</span>
                  </div>
                  <span class="ml-1 text-sm text-gray-600">{{
                    product.rating?.toFixed(1) || '4.4'
                  }}</span>
                </div>
              </div>

              <p class="text-sm text-gray-600 mb-3">
                <span v-if="!isDescriptionExpanded(product.id)">
                  {{ truncateDescription(product.description, 100) }}
                  <button
                    v-if="product.description.length > 100"
                    @click="toggleDescription(product.id)"
                    class="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    View more
                  </button>
                </span>
                <span v-else>
                  {{ product.description }}
                  <button
                    @click="toggleDescription(product.id)"
                    class="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    View less
                  </button>
                </span>
              </p>

              <div class="flex flex-wrap gap-1 mb-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize"
                >
                  {{ product.category }}
                </span>
                <span
                  v-for="tag in product.tags?.slice(0, 2)"
                  :key="tag"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-800"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="flex justify-between items-center mb-3">
                <div>
                  <div class="text-xl font-bold text-gray-900">${{ product.price }}</div>
                  <div v-if="product.discountPercentage > 0" class="text-sm">
                    <span class="text-amber-600 font-medium"
                      >{{ product.discountPercentage }}% OFF</span
                    >
                  </div>
                </div>
                <div class="text-right">
                  <div
                    class="text-sm font-medium"
                    :class="getStockStatus(product.stock).class.split(' ')[0]"
                  >
                    {{ product.stock }} units
                  </div>
                  <div class="text-xs" :class="getStockStatus(product.stock).class">
                    {{ getStockStatus(product.stock).text }}
                  </div>
                </div>
              </div>

              <div v-if="product.brand" class="text-sm text-gray-600 mb-3">
                <strong>Brand:</strong> {{ product.brand }}
              </div>

              <button
                @click="viewProduct(product.id)"
                class="w-full px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
                style="background-color: #000080"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredProducts.length === 0"
          class="bg-white rounded-lg shadow-sm p-12 text-center"
        >
          <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-500">Try adjusting your search criteria or browse all products.</p>
          <button
            @click="searchQuery = ''"
            class="mt-4 px-4 py-2 text-sm font-medium text-white rounded-md bg-blue-600 hover:bg-blue-700"
          >
            Clear Search
          </button>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1 && filteredProducts.length > 0"
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-zinc-200 sm:px-6 mt-4 sm:mt-6 rounded-lg shadow-sm"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-zinc-300 text-sm font-medium rounded-md text-zinc-700 bg-white hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-zinc-300 text-sm font-medium rounded-md text-zinc-700 bg-white hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-zinc-700">
                Showing
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                to
                <span class="font-medium">{{
                  Math.min(currentPage * itemsPerPage, filteredProducts.length)
                }}</span>
                of
                <span class="font-medium">{{ filteredProducts.length }}</span>
                results
              </p>
            </div>

            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-zinc-300 bg-white text-sm font-medium text-zinc-500 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                <template v-for="(page, index) in paginationRange" :key="index">
                  <button
                    v-if="page !== '...'"
                    @click="goToPage(page)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span
                    v-else
                    class="relative inline-flex items-center px-4 py-2 border border-zinc-300 bg-white text-sm font-medium text-zinc-700"
                  >
                    ...
                  </span>
                </template>

                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-zinc-300 bg-white text-sm font-medium text-zinc-500 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const productStore = useProductStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const categoryFilter = ref('')
const stockFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(4)
const viewMode = ref('table') // 'table' or 'card'
const expandedDescriptions = ref(new Set())

// Responsive view mode
const checkScreenSize = () => {
  if (window.innerWidth < 768) {
    viewMode.value = 'card'
  }
}

const availableCategories = computed(() => {
  const categories = [...new Set(productStore.products.map(p => p.category))]
  return categories.sort()
})

const filteredProducts = computed(() => {
  let results = productStore.products

  if (searchQuery.value) {
    results = results.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.value.toLowerCase())),
    )
  }

  // Category filter
  if (categoryFilter.value) {
    results = results.filter((p) => p.category === categoryFilter.value)
  }

  // Stock filter
  if (stockFilter.value) {
    if (stockFilter.value === 'out') {
      results = results.filter((p) => p.stock === 0)
    } else if (stockFilter.value === 'low') {
      results = results.filter((p) => p.stock > 0 && p.stock <= 10)
    } else if (stockFilter.value === 'in') {
      results = results.filter((p) => p.stock > 10)
    }
  }

  return results
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

const paginationRange = computed(() => {
  if (totalPages.value <= 1) return []
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }

  const range = []
  const delta = 2

  // Always show first page
  range.push(1)

  // Add dots if needed
  if (currentPage.value - delta > 2) {
    range.push('...')
  }

  // Add pages around current page
  const start = Math.max(2, currentPage.value - delta)
  const end = Math.min(totalPages.value - 1, currentPage.value + delta)

  for (let i = start; i <= end; i++) {
    if (!range.includes(i)) {
      range.push(i)
    }
  }

  // Add dots if needed
  if (currentPage.value + delta < totalPages.value - 1) {
    range.push('...')
  }

  // Always show last page
  if (!range.includes(totalPages.value)) {
    range.push(totalPages.value)
  }

  return range
})

const truncateDescription = (description, limit = 100) => {
  return description.length > limit ? description.substring(0, limit) + '...' : description
}

const toggleDescription = (productId) => {
  if (expandedDescriptions.value.has(productId)) {
    expandedDescriptions.value.delete(productId)
  } else {
    expandedDescriptions.value.add(productId)
  }
}

const isDescriptionExpanded = (productId) => {
  return expandedDescriptions.value.has(productId)
}

const viewProduct = (id) => {
  router.push(`/products/${id}`)
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const getTokenTimeLeft = () => {
  if (!authStore.token) return 'Unknown'

  try {
    const payload = JSON.parse(atob(authStore.token.split('.')[1]))
    const expiryTime = payload.exp * 1000
    const currentTime = Date.now()
    const timeLeft = expiryTime - currentTime

    if (timeLeft <= 0) return 'Expired'

    const minutes = Math.floor(timeLeft / (1000 * 60))
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  } catch (error) {
    return 'Unknown'
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const getStockStatus = (stock) => {
  if (stock === 0) return { text: 'Out of Stock', class: 'text-red-600 bg-red-100' }
  if (stock <= 10) return { text: 'Low Stock', class: 'text-yellow-600 bg-yellow-100' }
  return { text: 'In Stock', class: 'text-green-600 bg-green-100' }
}

const formatPrice = (price, discountPercentage) => {
  if (discountPercentage && discountPercentage > 0) {
    const originalPrice = price / (1 - discountPercentage / 100)
    return {
      current: price,
      original: originalPrice,
      hasDiscount: true,
    }
  }
  return {
    current: price,
    hasDiscount: false,
  }
}

// Reset to first page when search changes
watch(searchQuery, () => {
  currentPage.value = 1
})

watch(categoryFilter, () => {
  currentPage.value = 1
})

watch(stockFilter, () => {
  currentPage.value = 1
})

onMounted(() => {
  productStore.fetchProducts()
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>
