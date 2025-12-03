<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useColorMode } from '@vueuse/core'
import { watch } from 'vue'
import { Toaster } from '@/components/ui/toast'

const themeStore = useThemeStore()
const mode = useColorMode()

function updateTheme() {
  const theme = themeStore.currentTheme
  if (!theme) return
  
  const isDark = mode.value === 'dark'
  const vars = isDark ? theme.cssVars.dark : theme.cssVars.light
  
  const root = document.documentElement
  
  // Apply colors
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  
  // Apply radius
  root.style.setProperty('--radius', `${themeStore.radius}rem`)
}

watch(() => [themeStore.themeName, themeStore.radius, mode.value], () => {
  updateTheme()
}, { immediate: true })
</script>

<template>
  <RouterView />
  <Toaster />
</template>
