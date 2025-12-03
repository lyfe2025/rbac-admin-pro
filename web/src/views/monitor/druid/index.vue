<script setup lang="ts">
import { ref } from 'vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ExternalLink, AlertCircle } from 'lucide-vue-next'

const druidUrl = ref('http://localhost:8080/druid/login.html')

function openDruid() {
  window.open(druidUrl.value, '_blank')
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">连接池监控</h2>
        <p class="text-muted-foreground">
          Druid数据库连接池状态监控
        </p>
      </div>
    </div>

    <div class="max-w-2xl mx-auto mt-10 space-y-6">
       <Alert>
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>提示</AlertTitle>
        <AlertDescription>
          Druid 监控页面通常集成在后端服务中，无法直接在纯前端 Mock 环境中完整展示。
          <br/>
          在实际项目中，这里通常会使用 iframe 嵌入后端提供的 Druid 监控页面。
        </AlertDescription>
      </Alert>

      <div class="border rounded-lg p-8 text-center space-y-4 bg-card">
        <div class="text-2xl font-bold">Druid SQL 监控</div>
        <p class="text-muted-foreground">
          点击下方按钮跳转至后端 Druid 监控控制台（仅在后端服务启动时有效）
        </p>
        <Button @click="openDruid">
          <ExternalLink class="mr-2 h-4 w-4" />
          前往 Druid 监控台
        </Button>
      </div>

      <!-- Mock Iframe Preview (Visual Placeholder) -->
      <div class="border rounded-lg overflow-hidden h-[400px] bg-muted flex items-center justify-center relative">
         <div class="text-center space-y-2">
           <p class="text-lg font-medium">Iframe 占位区域</p>
           <p class="text-sm text-muted-foreground">此处将加载 http://localhost:8080/druid/index.html</p>
         </div>
      </div>
    </div>
  </div>
</template>
