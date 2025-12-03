<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'
import { Loader2 } from 'lucide-vue-next'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const { toast } = useToast()
const userStore = useUserStore()

const username = ref('admin')
const password = ref('123456')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    toast({
      title: "验证失败",
      description: "请输入用户名和密码",
      variant: "destructive",
    })
    return
  }

  isLoading.value = true
  
  try {
    await userStore.login({ username: username.value, password: password.value })
    toast({
      title: "登录成功",
      description: "欢迎回来，" + username.value,
    })
    router.push('/')
  } catch (error) {
    toast({
      title: "登录失败",
      description: "用户名或密码错误",
      variant: "destructive",
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/40 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">RBAC Admin Pro</CardTitle>
        <CardDescription class="text-center">
          请输入您的账号密码以登录系统
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="username">用户名</Label>
          <Input id="username" v-model="username" placeholder="admin" />
        </div>
        <div class="space-y-2">
          <Label for="password">密码</Label>
          <Input id="password" type="password" v-model="password" placeholder="••••••" @keyup.enter="handleLogin" />
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full" @click="handleLogin" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          {{ isLoading ? '登录中...' : '登录' }}
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
