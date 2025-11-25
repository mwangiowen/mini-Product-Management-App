<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-extrabold text-zinc-900 mb-2">Settings</h1>
      <p class="text-sm text-zinc-500 mb-6">
        Application and account settings for the admin panel.
      </p>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Profile card -->
          <div class="p-4 border rounded-lg">
            <div class="flex items-center gap-3">
              <img
                :src="profileImage"
                alt="avatar"
                class="h-14 w-14 rounded-full object-cover shadow-sm"
              />
              <div>
                <div class="font-semibold text-zinc-900 text-sm">{{ displayName }}</div>
                <div class="text-xs text-zinc-400">{{ displayEmail }}</div>
                <div class="text-xs text-zinc-400 mt-2">
                  @{{ authStore.user?.username || 'emilys' }}
                </div>
              </div>
            </div>

            <div class="mt-4 text-sm text-zinc-600">
              <p><strong>Gender:</strong> {{ authStore.user?.gender || 'female' }}</p>
              <p class="mt-1"><strong>ID:</strong> {{ authStore.user?.id || '1' }}</p>
            </div>

            <div class="mt-4">
              <button
                @click="loadDemo"
                class="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              >
                Load demo profile
              </button>
            </div>
          </div>

          <!-- Preferences -->
          <div class="md:col-span-2 p-4 border rounded-lg bg-white">
            <h3 class="text-lg font-semibold text-zinc-900 mb-3">Account & notifications</h3>

            <div class="space-y-4">
              <label class="flex items-center justify-between bg-zinc-50 p-3 rounded-lg border">
                <div>
                  <div class="font-medium text-sm text-zinc-900">Allow notifications</div>
                  <div class="text-xs text-zinc-400">
                    Receive browser notifications for important updates.
                  </div>
                </div>
                <input type="checkbox" v-model="localPrefs.allowNotifications" class="h-4 w-4" />
              </label>

              <label class="flex items-center justify-between bg-zinc-50 p-3 rounded-lg border">
                <div>
                  <div class="font-medium text-sm text-zinc-900">Email updates</div>
                  <div class="text-xs text-zinc-400">
                    Receive emails about product activity and reports.
                  </div>
                </div>
                <input type="checkbox" v-model="localPrefs.emailUpdates" class="h-4 w-4" />
              </label>

              <label class="flex items-center justify-between bg-zinc-50 p-3 rounded-lg border">
                <div>
                  <div class="font-medium text-sm text-zinc-900">Two-factor authentication</div>
                  <div class="text-xs text-zinc-400">
                    Require a second factor when signing in (dummy control).
                  </div>
                </div>
                <input type="checkbox" v-model="localPrefs.twoFactor" class="h-4 w-4" />
              </label>

              <label class="flex items-center justify-between bg-zinc-50 p-3 rounded-lg border">
                <div>
                  <div class="font-medium text-sm text-zinc-900">Dark mode</div>
                  <div class="text-xs text-zinc-400">
                    Toggle UI dark mode (ui-only, persists locally).
                  </div>
                </div>
                <input type="checkbox" v-model="localPrefs.darkMode" class="h-4 w-4" />
              </label>

              <div class="flex items-center mt-3 gap-3">
                <button
                  @click="savePrefs"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                >
                  Save settings
                </button>
                <button @click="resetPrefs" class="px-4 py-2 border rounded-lg text-sm">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const profileImage = computed(
  () => authStore.user?.image || 'https://dummyjson.com/icon/emilys/128',
)
const displayName = computed(
  () => (authStore.user?.firstName || 'Emily') + ' ' + (authStore.user?.lastName || 'Johnson'),
)
const displayEmail = computed(() => authStore.user?.email || 'emily.johnson@x.dummyjson.com')

// Local copy of preferences so toggles feel responsive; saved when clicking Save
const localPrefs = reactive({
  allowNotifications: authStore.preferences.allowNotifications,
  emailUpdates: authStore.preferences.emailUpdates,
  twoFactor: authStore.preferences.twoFactor,
  darkMode: authStore.preferences.darkMode,
})

const savePrefs = () => {
  authStore.updatePreferences({ ...localPrefs })
}

const resetPrefs = () => {
  // reset to default
  localPrefs.allowNotifications = true
  localPrefs.emailUpdates = true
  localPrefs.twoFactor = false
  localPrefs.darkMode = false
  savePrefs()
}

const loadDemo = () => {
  authStore.setDemoUser()
}
</script>

<style scoped></style>
