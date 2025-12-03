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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast/use-toast'
import { Trash2, RefreshCw, Search, Eye } from 'lucide-vue-next'
import { listOperLog, delOperLog, cleanOperLog } from '@/api/monitor/operlog'
import type { SysOperLog } from '@/api/system/types'

const { toast } = useToast()

// State
const loading = ref(true)
const logList = ref<SysOperLog[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  operName: '',
  businessType: undefined,
  status: undefined
})

const showDetail = ref(false)
const currentLog = ref<SysOperLog | null>(null)

// Fetch Data
async function getList() {
  loading.value = true
  try {
    const res = await listOperLog(queryParams)
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
  queryParams.title = ''
  queryParams.operName = ''
  queryParams.businessType = undefined
  queryParams.status = undefined
  handleQuery()
}

async function handleDelete(row: SysOperLog) {
  if (confirm('确认要删除该条日志吗？')) {
    await delOperLog([row.operId])
    toast({ title: "删除成功", description: "日志已删除" })
    getList()
  }
}

async function handleClean() {
  if (confirm('确认要清空所有操作日志吗？')) {
    await cleanOperLog()
    toast({ title: "清空成功", description: "日志已清空" })
    getList()
  }
}

function handleView(row: SysOperLog) {
  currentLog.value = row
  showDetail.value = true
}

function getBusinessTypeLabel(type: number) {
  const map: Record<number, string> = {
    0: '其它',
    1: '新增',
    2: '修改',
    3: '删除'
  }
  return map[type] || '未知'
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
        <h2 class="text-2xl font-bold tracking-tight">操作日志</h2>
        <p class="text-muted-foreground">
          记录系统操作日志信息
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
        <span class="text-sm font-medium">系统模块</span>
        <Input 
          v-model="queryParams.title" 
          placeholder="请输入系统模块" 
          class="w-[150px]"
          @keyup.enter="handleQuery"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">操作人员</span>
        <Input 
          v-model="queryParams.operName" 
          placeholder="请输入操作人员" 
          class="w-[150px]"
          @keyup.enter="handleQuery"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">类型</span>
        <Select v-model="queryParams.businessType">
          <SelectTrigger class="w-[120px]">
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">新增</SelectItem>
            <SelectItem value="2">修改</SelectItem>
            <SelectItem value="3">删除</SelectItem>
          </SelectContent>
        </Select>
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
            <TableHead>日志编号</TableHead>
            <TableHead>系统模块</TableHead>
            <TableHead>操作类型</TableHead>
            <TableHead>操作人员</TableHead>
            <TableHead>主机</TableHead>
            <TableHead>操作地点</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>操作时间</TableHead>
            <TableHead class="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in logList" :key="item.operId">
            <TableCell>{{ item.operId }}</TableCell>
            <TableCell>{{ item.title }}</TableCell>
            <TableCell>
              <Badge variant="outline">{{ getBusinessTypeLabel(item.businessType) }}</Badge>
            </TableCell>
            <TableCell>{{ item.operName }}</TableCell>
            <TableCell>{{ item.operIp }}</TableCell>
            <TableCell>{{ item.operLocation }}</TableCell>
            <TableCell>
              <Badge :variant="item.status === 0 ? 'default' : 'destructive'">
                {{ item.status === 0 ? '成功' : '失败' }}
              </Badge>
            </TableCell>
            <TableCell>{{ item.operTime }}</TableCell>
            <TableCell class="text-right space-x-2">
              <Button variant="ghost" size="icon" @click="handleView(item)">
                <Eye class="w-4 h-4" />
              </Button>
            </TableCell>
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

    <!-- Detail Dialog -->
    <Dialog v-model:open="showDetail">
      <DialogContent class="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>操作日志详情</DialogTitle>
          <DialogDescription>
            查看操作日志的详细信息
          </DialogDescription>
        </DialogHeader>
        
        <div class="grid gap-4 py-4 text-sm" v-if="currentLog">
          <div class="grid grid-cols-2 gap-4">
            <div><span class="font-medium">操作模块：</span>{{ currentLog.title }}</div>
            <div><span class="font-medium">请求方式：</span>{{ currentLog.requestMethod }}</div>
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div><span class="font-medium">登录信息：</span>{{ currentLog.operName }} / {{ currentLog.operIp }} / {{ currentLog.operLocation }}</div>
             <div><span class="font-medium">操作方法：</span>{{ currentLog.method }}</div>
          </div>
          <div>
            <div class="font-medium mb-1">请求参数：</div>
            <div class="bg-muted p-2 rounded text-xs break-all font-mono">{{ currentLog.operParam }}</div>
          </div>
          <div>
            <div class="font-medium mb-1">返回参数：</div>
            <div class="bg-muted p-2 rounded text-xs break-all font-mono">{{ currentLog.jsonResult }}</div>
          </div>
          <div v-if="currentLog.status === 1">
            <div class="font-medium mb-1 text-destructive">异常信息：</div>
            <div class="bg-destructive/10 text-destructive p-2 rounded text-xs break-all">{{ currentLog.errorMsg }}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
