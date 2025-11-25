import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isOpen = ref(false)
  const isMobile = ref(false)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const close = () => {
    isOpen.value = false
  }

  const open = () => {
    isOpen.value = true
  }

  const setMobile = (mobile) => {
    isMobile.value = mobile
    if (!mobile) {
      isOpen.value = false
    }
  }

  return {
    isOpen,
    isMobile,
    toggle,
    close,
    open,
    setMobile
  }
})