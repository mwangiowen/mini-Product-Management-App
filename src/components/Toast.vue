<template>
  <div 
    v-if="visible" 
    :class="toastClass" 
    class="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform"
    :style="{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }"
  >
    <div class="flex items-center gap-3">
      <div v-if="type === 'success'" class="text-green-600 text-lg font-bold">✓</div>
      <div v-if="type === 'error'" class="text-red-600 text-lg font-bold">✗</div>
      <div v-if="type === 'info'" class="text-blue-600 text-lg font-bold">ℹ</div>
      <span class="text-sm font-medium">{{ message }}</span>
      <button 
        @click="hide" 
        class="ml-2 text-gray-400 hover:text-gray-600 text-lg font-bold"
      >
        ×
      </button>
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
  console.log('🎉 Showing toast:', props.type, props.message)
  visible.value = true
  setTimeout(() => {
    hide()
  }, props.duration)
}

const hide = () => {
  console.log('🔄 Hiding toast')
  visible.value = false
}

watch(() => props.message, (newMessage) => {
  if (newMessage) show()
})

defineExpose({ show, hide })
</script>