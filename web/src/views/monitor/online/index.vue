<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import { LogOut, RefreshCw, Search } from 'lucide-vue-next'
import { listOnline, forceLogout, type SysUserOnline } from '@/api/monitor/online'

const { toast } = useToast()

// State
const loading = ref(true)
const onlineList = ref<SysUserOnline[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  ipaddr: '',
  userName: ''
})

// Fetch Data
async function getList() {
  loading.value = true
  try {
    const res = await listOnline(queryParams)
    onlineList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// Search Operations
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.ipaddr = ''
  queryParams.userName = ''
  handleQuery()
}

async function handleForceLogout(row: SysUserOnline) {
  if (confirm('确认要强退用户"' + row.userName + '"吗？')) {
    await forceLogout(row.tokenId)
    toast({ title: "操作成功", description: "用户已强退" })
    getList()
  }
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">在线用户</h2>
        <p class="text-muted-foreground">
          监控当前系统活跃用户
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-center bg-background/95 p-4 border rounded-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">登录地址</span>
        <Input 
          v-model="queryParams.ipaddr" 
          placeholder="请输入登录地址" 
          class="w-[150px]"
          @keyup.enter="handleQuery"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">用户名称</span>
        <Input 
          v-model="queryParams.userName" 
          placeholder="请输入用户名称" 
          class="w-[150px]"
          @keyup.enter="handleQuery"
        />
      </div>
      <div class="flex gap-2 ml-auto">
        <Button @click="handleQuery">
          <Search class="w-4 h-4 mr-2" />
          搜索
        </Button>
        <Button variant="outline" @click="resetQuery">
          <RefreshCw class="w-4 h-4 mr-2" />
          重置
        </Button>
      </div>
    </div>

    <!-- Table -->
    <div class="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>会话编号</TableHead>
            <TableHead>用户名称</TableHead>
            <TableHead>主机</TableHead>
            <TableHead>登录地点</TableHead>
            <TableHead>浏览器</TableHead>
            <TableHead>操作系统</TableHead>
            <TableHead>登录时间</TableHead>
            <TableHead class="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in onlineList" :key="item.tokenId">
            <TableCell>{{ item.tokenId }}</TableCell>
            <TableCell>{{ item.userName }}</TableCell>
            <TableCell>{{ item.ipaddr }}</TableCell>
            <TableCell>{{ item.loginLocation }}</TableCell>
            <TableCell>{{ item.browser }}</TableCell>
            <TableCell>{{ item.os }}</TableCell>
            <TableCell>{{ item.loginTime }}</TableCell>
            <TableCell class="text-right">
              <Button variant="ghost" size="sm" class="text-destructive hover:text-destructive" @click="handleForceLogout(item)">
                <LogOut class="w-4 h-4 mr-2" />
                强退
              </Button>
            </TableCell>
          </TableRow>
          <TableRow v-if="onlineList.length === 0">
            <TableCell colspan="8" class="text-center h-24 text-muted-foreground">
              暂无数据
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end">
       <div class="text-sm text-muted-foreground p-2">
         共 {{ total }} 条
       </div>
    </div>
  </div>
</template>
