<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCache, type CacheInfo } from '@/api/monitor/cache'
import { Loader2, RefreshCw, Database, Activity, Server, Clock } from 'lucide-vue-next'
// Note: For real charts, we would use echarts or chart.js. 
// Here we use simple progress bars or text for mock visualization

const loading = ref(true)
const cache = ref<CacheInfo | null>(null)

async function getData() {
  loading.value = true
  try {
    const res = await getCache()
    cache.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">缓存监控</h2>
        <p class="text-muted-foreground">
          监控Redis缓存服务器状态
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" @click="getData">
          <RefreshCw class="mr-2 h-4 w-4" />
          刷新
        </Button>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center h-[400px]">
      <Loader2 class="w-8 h-8 animate-spin text-primary" />
    </div>

    <div v-else-if="cache" class="space-y-6">
      <!-- Key Metrics -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Redis版本</CardTitle>
            <Server class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ cache.redis_version }}</div>
            <p class="text-xs text-muted-foreground">Mode: {{ cache.redis_mode }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">运行时间</CardTitle>
            <Clock class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ cache.uptime_in_days }} 天</div>
            <p class="text-xs text-muted-foreground">Port: {{ cache.tcp_port }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">客户端连接</CardTitle>
            <Activity class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ cache.connected_clients }}</div>
            <p class="text-xs text-muted-foreground">DB Size: {{ cache.dbSize }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">内存使用</CardTitle>
            <Database class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ cache.used_memory_human }}</div>
            <p class="text-xs text-muted-foreground">CPU: {{ cache.used_cpu_user_children }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Command Stats (Simulated Chart) -->
      <Card>
        <CardHeader>
          <CardTitle>命令统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="item in cache.commandStats" :key="item.name" class="space-y-1">
               <div class="flex items-center justify-between text-sm">
                 <span class="font-medium">{{ item.name }}</span>
                 <span>{{ item.value }}次</span>
               </div>
               <div class="h-2 bg-secondary rounded-full overflow-hidden">
                 <div class="h-full bg-primary" :style="{ width: Math.min(100, (parseInt(item.value) / 1500) * 100) + '%' }" />
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Basic Info Table -->
      <Card>
        <CardHeader>
          <CardTitle>详细信息</CardTitle>
        </CardHeader>
        <CardContent>
           <Table>
             <TableBody>
               <TableRow>
                 <TableCell class="font-medium w-[200px]">Redis版本</TableCell>
                 <TableCell>{{ cache.redis_version }}</TableCell>
                 <TableCell class="font-medium w-[200px]">运行模式</TableCell>
                 <TableCell>{{ cache.redis_mode }}</TableCell>
               </TableRow>
               <TableRow>
                 <TableCell class="font-medium">端口</TableCell>
                 <TableCell>{{ cache.tcp_port }}</TableCell>
                 <TableCell class="font-medium">客户端数</TableCell>
                 <TableCell>{{ cache.connected_clients }}</TableCell>
               </TableRow>
               <TableRow>
                 <TableCell class="font-medium">运行时间(天)</TableCell>
                 <TableCell>{{ cache.uptime_in_days }}</TableCell>
                 <TableCell class="font-medium">使用内存</TableCell>
                 <TableCell>{{ cache.used_memory_human }}</TableCell>
               </TableRow>
                <TableRow>
                 <TableCell class="font-medium">AOF开启</TableCell>
                 <TableCell>{{ cache.aof_enabled === '0' ? '否' : '是' }}</TableCell>
                 <TableCell class="font-medium">RDB状态</TableCell>
                 <TableCell>{{ cache.rdb_last_bgsave_status }}</TableCell>
               </TableRow>
             </TableBody>
           </Table>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
