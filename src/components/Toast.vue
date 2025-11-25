<template>
  <div v-if="visible" :class="toastClass" class="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300">
    <div class="flex items-center gap-3">
      <div v-if="type === 'success'" class="text-green-600">✓</div>
      <div v-if="type === 'error'" class="text-red-600">✗</div>
      <div v-if="type === 'info'" class="text-blue-600">ℹ</div>
      <span class="text-sm font-medium">{{ message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  message: String,
  type: { type: String, default: 'info' },
  duration: { type: Number, default: 3000 }
})

const visible = ref(false)

const toastClass = computed(() => ({
  'bg-green-100 border border-green-200 text-green-800': props.type === 'success',
  'bg-red-100 border border-red-200 text-red-800': props.type === 'error',
  'bg-blue-100 border border-blue-200 text-blue-800': props.type === 'info'
}))

const show = () => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, props.duration)
}

watch(() => props.message, (newMessage) => {
  if (newMessage) show()
})

defineExpose({ show })
</script>