<template>
  <!-- Mobile overlay -->
  <div 
    v-if="sidebarStore.isMobile && sidebarStore.isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    @click="sidebarStore.close()"
  ></div>
  
  <!-- Sidebar -->
  <aside 
    :class="[
      'bg-white h-screen border-r border-zinc-200 flex flex-col justify-between fixed z-50 transition-transform duration-300 ease-in-out',
      'w-64',
      sidebarStore.isMobile ? (
        sidebarStore.isOpen ? 'translate-x-0' : '-translate-x-full'
      ) : 'translate-x-0',
      'lg:translate-x-0'
    ]"
  >
    <div class="p-4 sm:p-6">
      <!-- Mobile close button -->
      <div class="flex justify-between items-center mb-6 lg:hidden">
        <h2 class="text-lg font-semibold text-zinc-900">Menu</h2>
        <button
          @click="sidebarStore.close()"
          class="p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="mb-6">
        <div class="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-100">
          <img
            :src="profileImage"
            alt="User"
            class="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover shadow-sm"
          />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-zinc-900 truncate">{{ displayName }}</div>
            <div class="text-xs text-zinc-400 truncate">{{ displayEmail }}</div>
          </div>
        </div>
      </div>

      <nav class="space-y-1">
        <router-link
          to="/dashboard"
          class="flex items-center px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700"
          active-class="bg-indigo-50 text-indigo-700 font-semibold"
          @click="handleNavClick"
        >
          <FontAwesomeIcon :icon="faBorderAll" :class="route.path === '/dashboard' ? 'h-5 w-5 mr-3 text-blue-900' : 'h-5 w-5 mr-3 text-zinc-600'" />
          Dashboard
        </router-link>
        <router-link
          to="/products"
          class="flex items-center px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700"
          active-class="bg-indigo-50 text-indigo-700 font-semibold"
          @click="handleNavClick"
        >
          <FontAwesomeIcon :icon="faBox" :class="route.path.startsWith('/products') ? 'h-5 w-5 mr-3 text-blue-900' : 'h-5 w-5 mr-3 text-zinc-600'" />
          Products
        </router-link>

        <router-link
          to="/orders"
          class="flex items-center px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700"
          active-class="bg-indigo-50 text-indigo-700 font-semibold"
          @click="handleNavClick"
        >
          <FontAwesomeIcon :icon="faCartShopping" :class="route.path === '/orders' ? 'h-5 w-5 mr-3 text-blue-900' : 'h-5 w-5 mr-3 text-zinc-600'" />
          Orders
        </router-link>

        <router-link
          to="/customers"
          class="flex items-center px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700"
          active-class="bg-indigo-50 text-indigo-700 font-semibold"
          @click="handleNavClick"
        >
          <FontAwesomeIcon :icon="faUsers" :class="route.path === '/customers' ? 'h-5 w-5 mr-3 text-blue-900' : 'h-5 w-5 mr-3 text-zinc-600'" />
          Customers
        </router-link>
      </nav>
    </div>

    <div class="p-4 sm:p-6 border-t border-zinc-100">
      <router-link
        to="/settings"
        class="flex items-center px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700 mb-3"
        active-class="bg-indigo-50 text-indigo-700 font-semibold"
        @click="handleNavClick"
      >
        <FontAwesomeIcon :icon="faCog" :class="route.path === '/settings' ? 'h-5 w-5 mr-3 text-blue-900' : 'h-5 w-5 mr-3 text-zinc-600'" />
        Settings
      </router-link>

      <div class="mt-2">
        <button
          @click="handleLogout"
          class="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md"
          style="background-color: #080063"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useSidebarStore } from '../stores/sidebar'
import { useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBorderAll, faBox, faCartShopping, faUsers, faCog } from '@fortawesome/free-solid-svg-icons'

const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const route = useRoute()

const emit = defineEmits(['logout'])

const handleNavClick = () => {
  if (sidebarStore.isMobile) {
    sidebarStore.close()
  }
}

const handleLogout = () => {
  emit('logout')
  if (sidebarStore.isMobile) {
    sidebarStore.close()
  }
}

const checkScreenSize = () => {
  const isMobile = window.innerWidth < 1024
  sidebarStore.setMobile(isMobile)
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const profileImage = computed(() => {
  if (authStore?.user?.image) return authStore.user.image
  return 'https://i.pravatar.cc/150?u=emily.johnson@x.dummyjson.com'
})

const displayName = computed(() => {
  if (authStore?.user?.firstName || authStore?.user?.lastName) {
    return `${authStore.user.firstName || ''} ${authStore.user.lastName || ''}`.trim()
  }
  return 'Emily Johnson'
})

const displayEmail = computed(() => authStore?.user?.email || 'emily.johnson@x.dummyjson.com')
</script>

<style scoped></style>
