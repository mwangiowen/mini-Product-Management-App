<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8"
  >
    <!-- Logo -->
    <div class="flex flex-col items-center mb-6">
      <svg
        width="36"
        height="28"
        viewBox="0 0 36 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="2" width="32" height="24" rx="4" fill="#0b0b6d" />
        <rect x="8" y="8" width="20" height="12" rx="2" fill="#fff" />
      </svg>
      <div class="mt-3 flex items-center gap-2 text-[#0b0b6d] font-semibold text-lg">
        <span class="text-2xl">Platform Logo</span>
      </div>
    </div>

    <!-- Card -->
    <div class="w-full max-w-lg">
      <div class="bg-white rounded-xl shadow-md border border-transparent/20 p-8 sm:p-10 mx-auto">
        <header class="text-center mb-6">
          <h1 class="text-2xl font-extrabold text-gray-900">Welcome Back</h1>
          <p class="mt-2 text-sm text-gray-500">Sign in to manage your products.</p>
        </header>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm text-gray-700 mb-2">Email or Username</label>
            <input
              v-model="form.username"
              type="text"
              required
              placeholder="you@example.com"
              class="w-full border border-gray-200 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b7b7ff] focus:border-[#b7b7ff]"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                required
                placeholder="Enter your password"
                class="w-full border border-gray-200 rounded-md px-4 py-3 pr-12 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b7b7ff] focus:border-[#b7b7ff]"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  v-if="!showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.985 9.985 0 012.223-3.325M6.5 6.5L17.5 17.5M10.5 10.5a3 3 0 104.5 4.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                v-model="remember"
                class="h-4 w-4 rounded border-gray-300 focus:ring-2"
                style="accent-color: #000080"
              />
              Remember me
            </label>
            <a href="#" class="text-[#0b0b6d] hover:underline">Forgot Password?</a>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
              style="background-color: #000080"
            >
              {{ loading ? 'Signing in...' : 'Login' }}
            </button>
          </div>

          <div v-if="error" class="text-red-600 text-sm text-center">
            {{ error }}
          </div>
        </form>
      </div>

      <footer class="mt-8 text-center text-xs text-gray-400">
        © 2024 Platform Inc. All Rights Reserved.
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: '',
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const remember = ref(false)

const useTestCredentials = () => {
  form.value.username = 'emilys'
  form.value.password = 'emilyspass'
}

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    error.value = 'Please enter both username and password'
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log('🚀 Starting login process')
    const result = await authStore.login(form.value)
    console.log('✅ Login completed, redirecting to products')
    router.push('/products')
  } catch (err) {
    console.error('❌ Login failed:', err)
    error.value = err.message || 'Invalid username or password'
  } finally {
    loading.value = false
  }
}
</script>
