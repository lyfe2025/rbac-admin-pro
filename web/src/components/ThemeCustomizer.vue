<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { themes } from '@/lib/registry/themes'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Check, Paintbrush } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import ThemeToggle from './ThemeToggle.vue'

const themeStore = useThemeStore()

const radii = [0, 0.25, 0.5, 0.75, 1.0]
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="ghost" size="icon">
        <Paintbrush class="h-4 w-4" />
      </Button>
    </SheetTrigger>
    <SheetContent class="w-[340px]">
      <SheetHeader>
        <SheetTitle>主题设置</SheetTitle>
        <SheetDescription>
          自定义系统的主题色和圆角风格。
        </SheetDescription>
      </SheetHeader>
      
      <div class="grid gap-6 py-6">
        <!-- Colors -->
        <div class="space-y-1.5">
          <div class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            主题色
          </div>
          <div class="grid grid-cols-3 gap-2">
            <Button
              v-for="theme in themes"
              :key="theme.name"
              variant="outline"
              :class="cn('justify-start gap-2 px-3', themeStore.themeName === theme.name && 'border-primary border-2')"
              @click="themeStore.setTheme(theme.name)"
            >
              <span 
                class="h-4 w-4 rounded-full flex items-center justify-center shrink-0"
                :style="{ backgroundColor: theme.activeColor }"
              >
                 <Check v-if="themeStore.themeName === theme.name" class="h-3 w-3 text-white" />
              </span>
              <span class="text-xs capitalize">{{ theme.label }}</span>
            </Button>
          </div>
        </div>
        
        <!-- Radius -->
        <div class="space-y-1.5">
          <div class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            圆角
          </div>
          <div class="grid grid-cols-5 gap-2">
            <Button
              v-for="r in radii"
              :key="r"
              variant="outline"
              :class="cn('px-0', themeStore.radius === r && 'border-primary border-2')"
              @click="themeStore.setRadius(r)"
            >
              {{ r }}
            </Button>
          </div>
        </div>

        <!-- Mode -->
        <div class="space-y-1.5">
          <div class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            模式
          </div>
          <div class="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <span class="text-sm">切换深色/浅色模式</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
