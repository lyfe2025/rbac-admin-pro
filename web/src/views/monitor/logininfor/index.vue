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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast/use-toast'
import { Trash2, RefreshCw, Search } from 'lucide-vue-next'
import { listLogininfor, delLogininfor, cleanLogininfor } from '@/api/monitor/logininfor'
import type { SysLoginLog } from '@/api/system/types'

const { toast } = useToast()

// State
const loading = ref(true)
const logList = ref<SysLoginLog[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: '',
  status: undefined
})

// Fetch Data
async function getList() {
  loading.value = true
  try {
    const res = await listLogininfor(queryParams)
    logList.value = res.rows
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
  queryParams.userName = ''
  queryParams.status = undefined
  handleQuery()
}

async function handleDelete(row: SysLoginLog) {
  if (confirm('确认要删除该条登录日志吗？')) {
    await delLogininfor([row.infoId])
    toast({ title: "删除成功", description: "日志已删除" })
    getList()
  }
}

async function handleClean() {
  if (confirm('确认要清空所有登录日志吗？')) {
    await cleanLogininfor()
    toast({ title: "清空成功", description: "日志已清空" })
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
        <h2 class="text-2xl font-bold tracking-tight">登录日志</h2>
        <p class="text-muted-foreground">
          记录系统登录日志信息
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="destructive" @click="handleClean">
          <Trash2 class="mr-2 h-4 w-4" />
          清空
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-center bg-background/95 p-4 border rounded-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">用户名称</span>
        <Input 
          v-model="queryParams.userName" 
          placeholder="请输入用户名称" 
          class="w-[150px]"
          @keyup.enter="handleQuery"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">状态</span>
        <Select v-model="queryParams.status">
          <SelectTrigger class="w-[120px]">
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">成功</SelectItem>
            <SelectItem value="1">失败</SelectItem>
          </SelectContent>
        </Select>
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
            <TableHead>访问编号</TableHead>
            <TableHead>用户名称</TableHead>
            <TableHead>登录地址</TableHead>
            <TableHead>登录地点</TableHead>
            <TableHead>浏览器</TableHead>
            <TableHead>操作系统</TableHead>
            <TableHead>登录状态</TableHead>
            <TableHead>操作信息</TableHead>
            <TableHead>登录时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in logList" :key="item.infoId">
            <TableCell>{{ item.infoId }}</TableCell>
            <TableCell>{{ item.userName }}</TableCell>
            <TableCell>{{ item.ipaddr }}</TableCell>
            <TableCell>{{ item.loginLocation }}</TableCell>
            <TableCell>{{ item.browser }}</TableCell>
            <TableCell>{{ item.os }}</TableCell>
            <TableCell>
              <Badge :variant="item.status === '0' ? 'default' : 'destructive'">
                {{ item.status === '0' ? '成功' : '失败' }}
              </Badge>
            </TableCell>
            <TableCell>{{ item.msg }}</TableCell>
            <TableCell>{{ item.loginTime }}</TableCell>
          </TableRow>
          <TableRow v-if="logList.length === 0">
            <TableCell colspan="9" class="text-center h-24 text-muted-foreground">
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
