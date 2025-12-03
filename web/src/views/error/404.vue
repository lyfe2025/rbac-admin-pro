<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
const router = useRouter()
const goHome = () => router.push('/')
</script>

<template>
  <div class="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
    <h1 class="text-4xl font-bold">404</h1>
    <p class="text-muted-foreground">页面不存在或已被移除</p>
    <Button variant="default" @click="goHome">返回首页</Button>
  </div>
</template>
