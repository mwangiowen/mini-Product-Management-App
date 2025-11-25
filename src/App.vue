<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useSidebarStore } from './stores/sidebar'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  authStore.restoreSession()
  // In development, seed a demo user automatically so the sidebar/navbar shows Emily without manual login
  if (import.meta.env.DEV && !authStore.user) {
    authStore.setDemoUser()
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <!-- If the route is /login render the page full width, otherwise show the app layout -->
  <div id="app">
    <div v-if="route.path === '/login'">
      <router-view />
    </div>
    <div v-else class="min-h-screen bg-zinc-50">
      <Sidebar @logout="handleLogout" />

      <main 
        :class="[
          'flex-1 flex flex-col overflow-auto transition-all duration-300 ease-in-out',
          sidebarStore.isMobile ? 'ml-0' : 'ml-64'
        ]"
      >
        <Navbar />
        <div class="flex-1">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Keep App-level rules small — Tailwind controls most of the look */
</style>
