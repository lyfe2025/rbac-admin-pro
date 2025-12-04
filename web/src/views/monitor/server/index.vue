<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { getServer, type ServerInfo } from '@/api/monitor/server'
import { Loader2, Server as ServerIcon, Cpu, Database, HardDrive, RefreshCw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const loading = ref(true)
const server = ref<ServerInfo | null>(null)

async function getData() {
  loading.value = true
  try {
    const res = await getServer()
    server.value = res.data
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
        <h2 class="text-2xl font-bold tracking-tight">服务监控</h2>
        <p class="text-muted-foreground">
          监控服务器CPU、内存、JVM等运行环境状态
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" @click="getData">
          <RefreshCw class="mr-2 h-4 w-4" />
          刷新
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-[400px]">
      <Loader2 class="w-8 h-8 animate-spin text-primary" />
    </div>

    <div v-else-if="server" class="space-y-6">
      <!-- CPU & Memory Row -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">CPU</CardTitle>
            <Cpu class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ server.cpu.cpuNum }} 核心</div>
            <p class="text-xs text-muted-foreground mt-1">
              用户使用率: {{ Number(server.cpu.used) || 0 }}% | 系统使用率: {{ Number(server.cpu.sys) || 0 }}%
            </p>
            <div class="mt-4 space-y-2">
               <div class="flex justify-between text-xs">
                 <span>总使用率</span>
                 <span>{{ (((Number(server.cpu.used) || 0) + (Number(server.cpu.sys) || 0))).toFixed(2) }}%</span>
               </div>
               <Progress :model-value="Math.min(100, Math.max(0, (Number(server.cpu.used) || 0) + (Number(server.cpu.sys) || 0)))" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">内存</CardTitle>
            <Database class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ Number(server.mem.total) || 0 }} GB</div>
            <p class="text-xs text-muted-foreground mt-1">
              已用: {{ Number(server.mem.used) || 0 }} GB | 剩余: {{ Number(server.mem.free) || 0 }} GB
            </p>
            <div class="mt-4 space-y-2">
               <div class="flex justify-between text-xs">
                 <span>使用率</span>
                 <span>{{ Number(server.mem.usage) || 0 }}%</span>
               </div>
               <Progress :model-value="Number(server.mem.usage) || 0" />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Server Info -->
      <Card>
        <CardHeader>
          <CardTitle>服务器信息</CardTitle>
          <CardDescription>服务器及JVM运行环境信息</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6 md:grid-cols-2">
           <div class="space-y-4">
             <h4 class="text-sm font-medium text-muted-foreground">服务器信息</h4>
             <div class="grid grid-cols-2 gap-2 text-sm">
               <span class="text-muted-foreground">服务器名称:</span>
               <span>{{ server.sys.computerName }}</span>
               <span class="text-muted-foreground">服务器IP:</span>
               <span>{{ server.sys.computerIp }}</span>
               <span class="text-muted-foreground">操作系统:</span>
               <span>{{ server.sys.osName }} {{ server.sys.osArch }}</span>
               <span class="text-muted-foreground">项目路径:</span>
               <span class="truncate" :title="server.sys.userDir">{{ server.sys.userDir }}</span>
             </div>
           </div>
           
           <div>
              <h4 class="text-sm font-medium text-muted-foreground mb-4">JVM信息</h4>
               <div class="grid grid-cols-2 gap-2 text-sm">
               <span class="text-muted-foreground">Java名称:</span>
               <span>{{ server.jvm.name }}</span>
               <span class="text-muted-foreground">Java版本:</span>
               <span>{{ server.jvm.version }}</span>
               <span class="text-muted-foreground">启动时间:</span>
               <span>{{ server.jvm.startTime }}</span>
               <span class="text-muted-foreground">运行时长:</span>
               <span>{{ server.jvm.runTime }}</span>
             </div>
           </div>
        </CardContent>
      </Card>
      
      <!-- JVM Memory -->
      <Card>
         <CardHeader>
          <CardTitle>Java虚拟机内存</CardTitle>
        </CardHeader>
        <CardContent>
           <div class="space-y-4">
             <div class="grid grid-cols-3 gap-4 text-center">
               <div>
                 <div class="text-sm font-medium text-muted-foreground">总内存</div>
                 <div class="text-xl font-bold">{{ Number(server.jvm.total) || 0 }} MB</div>
               </div>
               <div>
                 <div class="text-sm font-medium text-muted-foreground">已用内存</div>
                 <div class="text-xl font-bold">{{ (Number(server.jvm.total || 0) - Number(server.jvm.free || 0)).toFixed(2) }} MB</div>
               </div>
                <div>
                  <div class="text-sm font-medium text-muted-foreground">剩余内存</div>
                 <div class="text-xl font-bold">{{ Number(server.jvm.free) || 0 }} MB</div>
               </div>
             </div>
             <div class="space-y-2">
               <div class="flex justify-between text-xs">
                 <span>使用率</span>
                 <span>{{ Number(server.jvm.usage) || 0 }}%</span>
               </div>
               <Progress :model-value="Number(server.jvm.usage) || 0" class="h-2" />
            </div>
           </div>
        </CardContent>
      </Card>

      <!-- Disk Info -->
      <Card>
        <CardHeader>
          <CardTitle>磁盘状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-6">
            <div v-for="(file, index) in (server.sysFiles || [])" :key="index" class="space-y-2">
               <div class="flex items-center justify-between">
                 <div class="flex items-center gap-2">
                   <HardDrive class="h-4 w-4 text-muted-foreground" />
                   <span class="font-medium text-sm">{{ file.dirName }} ({{ file.sysTypeName }})</span>
                 </div>
                 <span class="text-sm text-muted-foreground">{{ file.used }} / {{ file.total }}</span>
               </div>
               <Progress :model-value="Number(file.usage) || 0" class="h-2" />
               <div class="flex justify-end text-xs text-muted-foreground">
                 已用 {{ file.usage }}%
               </div>
               <Separator v-if="(server.sysFiles || []).length > 0 && index < (server.sysFiles || []).length - 1" class="mt-4" />
           </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
