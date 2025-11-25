<template>
  <header class="bg-white border-b border-zinc-200">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-2 lg:gap-6">
          <!-- Mobile menu button -->
          <button
            @click="sidebarStore.toggle()"
            class="lg:hidden p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div class="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <FontAwesomeIcon :icon="faThLarge" class="h-5 w-5 text-indigo-700" />
            <span class="hidden sm:inline">Product Management</span>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-1 justify-center max-w-3xl mx-2">
          <div class="relative w-full max-w-md hidden sm:block">
            <input
              v-model="search"
              type="search"
              placeholder="Search"
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21l-6-6M10 18a8 8 0 100-16 8 8 0 000 16z"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 lg:gap-4">
          <router-link
            to="/products/new"
            class="inline-flex items-center px-3 lg:px-4 py-2 text-sm font-semibold text-white rounded-lg"
            style="background-color: #000080"
          >
            <svg
              class="h-4 w-4 lg:-ml-1 lg:mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="hidden lg:inline ml-2">Add Product</span>
          </router-link>

          <!-- Notifications -->
          <div class="relative hidden md:block">
            <button
              @click="toggleBell"
              class="notification-button h-9 w-9 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-600 hover:bg-zinc-100"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z"
                  stroke-width="1.4"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </svg>
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 text-xs bg-rose-500 text-white rounded-full px-1.5"
                >{{ unreadCount }}</span
              >
            </button>

            <div
              v-if="showBell"
              class="notification-dropdown absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <div class="p-3 border-b text-sm font-medium">Notifications</div>
              <div class="max-h-64 overflow-auto p-2 space-y-2">
                <div
                  v-if="!authStore.preferences?.allowNotifications"
                  class="px-3 py-3 text-xs text-zinc-400"
                >
                  Notifications are disabled. Enable them in Settings.
                </div>
                <div v-else>
                  <div
                    v-for="(n, i) in notifications"
                    :key="i"
                    class="flex items-start gap-3 px-3 py-2 hover:bg-zinc-50 rounded"
                  >
                    <div
                      class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs"
                    >
                      N
                    </div>
                    <div class="flex-1 text-xs text-zinc-700">{{ n }}</div>
                  </div>
                </div>
                <div v-if="notifications.length === 0" class="text-xs text-zinc-400 px-3 py-4">
                  No notifications
                </div>
              </div>
            </div>
          </div>

          <!-- Profile -->
          <div class="relative">
            <button
              @click="toggleProfile"
              class="profile-button flex items-center gap-3 rounded-full px-2 py-1 hover:bg-zinc-100"
            >
              <img :src="profileImage" alt="avatar" class="h-8 w-8 rounded-full object-cover" />
            </button>

            <div
              v-if="showProfile"
              class="profile-dropdown fixed right-4 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
            >
              <div class="p-3 border-b text-sm">
                <div class="font-medium text-zinc-900 truncate">{{ displayName }}</div>
                <div class="text-xs text-zinc-400 truncate">{{ displayEmail }}</div>
              </div>
              <div class="p-2">
                <router-link to="/settings" class="block px-3 py-2 rounded hover:bg-zinc-50 text-sm"
                  >Settings</router-link
                >
                <button
                  @click="logout"
                  class="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-zinc-50 rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useSidebarStore } from '../stores/sidebar'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faThLarge } from '@fortawesome/free-solid-svg-icons'

const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const router = useRouter()

const search = ref('')
const showBell = ref(false)
const showProfile = ref(false)

const notifications = ref([
  'New order #3421 placed',
  'Product “Denim Jacket” inventory low',
  'Monthly report is ready to view',
])

const unreadCount = computed(() =>
  authStore.preferences?.allowNotifications ? notifications.value.length : 0,
)

const toggleBell = () => {
  showBell.value = !showBell.value
  if (showBell.value) showProfile.value = false
}

const toggleProfile = () => {
  showProfile.value = !showProfile.value
  if (showProfile.value) showBell.value = false
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.notification-dropdown') && !event.target.closest('.notification-button')) {
    showBell.value = false
  }
  if (!event.target.closest('.profile-dropdown') && !event.target.closest('.profile-button')) {
    showProfile.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const profileImage = computed(
  () => authStore.user?.image || 'https://i.pravatar.cc/150?u=emily.johnson@x.dummyjson.com',
)
const displayName = computed(
  () => (authStore.user?.firstName || 'Emily') + ' ' + (authStore.user?.lastName || 'Johnson'),
)
const displayEmail = computed(() => authStore.user?.email || 'emily.johnson@x.dummyjson.com')
</script>

<style scoped>
/* small visual tweaks inside navbar */
</style>
