import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { themes } from '@/lib/registry/themes'
import { computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const themeName = useStorage('theme', 'zinc')
  const radius = useStorage('radius', 0.5)

  const currentTheme = computed(() => {
    return themes.find(t => t.name === themeName.value) || themes[0]
  })

  function setTheme(name: string) {
    themeName.value = name
  }

  function setRadius(value: number) {
    radius.value = value
  }

  return {
    themeName,
    radius,
    currentTheme,
    setTheme,
    setRadius
  }
})
