<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
const router = useRouter()
const goHome = () => router.push('/')
const goLogin = () => router.push('/login')
</script>

<template>
  <div class="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
    <h1 class="text-4xl font-bold text-destructive">403</h1>
    <p class="text-muted-foreground">无访问权限，请联系管理员或更换账户</p>
    <div class="flex gap-2">
      <Button variant="default" @click="goHome">返回首页</Button>
      <Button variant="outline" @click="goLogin">重新登录</Button>
    </div>
  </div>
</template>
