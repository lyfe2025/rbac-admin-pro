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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/toast/use-toast'
import { Download, Edit, Trash2, RefreshCw, Search, Eye, FileCode } from 'lucide-vue-next'
import TablePagination from '@/components/common/TablePagination.vue'
import { listTable, delTable, genCode, previewTable, type GenTable } from '@/api/tool/gen'

const { toast } = useToast()

// State
const loading = ref(true)
const tableList = ref<GenTable[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  tableName: '',
  tableComment: ''
})

const showPreview = ref(false)
const previewData = ref<Record<string, string>>({})
const activeTab = ref('domain.java')

// Fetch Data
async function getList() {
  loading.value = true
  try {
    const res = await listTable(queryParams)
    tableList.value = res.rows
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
  queryParams.tableName = ''
  queryParams.tableComment = ''
  handleQuery()
}

async function handleDelete(row: GenTable) {
  if (confirm('确认要删除表"' + row.tableName + '"吗？')) {
    try {
      await delTable([row.tableId])
      toast({ title: "删除成功", description: "表已删除" })
      getList()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

async function handlePreview(row: GenTable) {
  try {
    const res = await previewTable(row.tableId)
    previewData.value = res.data
    const keys = Object.keys(res.data)
    if (keys.length > 0) {
      activeTab.value = keys[0] as string
    }
    showPreview.value = true
  } catch (error) {
    console.error('预览失败:', error)
  }
}

async function handleGenCode(row: GenTable) {
  try {
    await genCode(row.tableName)
    toast({ title: "生成成功", description: "代码已生成" })
  } catch (error) {
    console.error('生成代码失败:', error)
  }
}

async function handleEdit(row: GenTable) {
  toast({ title: "提示", description: "编辑功能在 Mock 模式下暂未实现完整逻辑" })
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
        <h2 class="text-2xl font-bold tracking-tight">代码生成</h2>
        <p class="text-muted-foreground">
          生成CRUD代码，加速开发
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button>
          <FileCode class="mr-2 h-4 w-4" />
          导入表
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-center bg-background/95 p-4 border rounded-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">表名称</span>
        <Input 
          v-model="queryParams.tableName" 
          placeholder="请输入表名称" 
          class="w-[150px]"
          @keyup.enter="handleQuery"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">表描述</span>
        <Input 
          v-model="queryParams.tableComment" 
          placeholder="请输入表描述" 
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
            <TableHead>序号</TableHead>
            <TableHead>表名称</TableHead>
            <TableHead>表描述</TableHead>
            <TableHead>实体</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>更新时间</TableHead>
            <TableHead class="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in tableList" :key="item.tableId">
            <TableCell>{{ item.tableId }}</TableCell>
            <TableCell>{{ item.tableName }}</TableCell>
            <TableCell>{{ item.tableComment }}</TableCell>
            <TableCell>{{ item.className }}</TableCell>
            <TableCell>{{ item.createTime }}</TableCell>
            <TableCell>{{ item.updateTime }}</TableCell>
            <TableCell class="text-right space-x-2">
              <Button variant="ghost" size="icon" @click="handlePreview(item)">
                <Eye class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="handleEdit(item)">
                <Edit class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="handleGenCode(item)">
                <Download class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" class="text-destructive" @click="handleDelete(item)">
                <Trash2 class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow v-if="tableList.length === 0">
            <TableCell colspan="7" class="text-center h-24 text-muted-foreground">
              暂无数据
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <TablePagination
      v-model:page-num="queryParams.pageNum"
      v-model:page-size="queryParams.pageSize"
      :total="total"
      @change="getList"
    />

    <!-- Preview Dialog -->
    <Dialog v-model:open="showPreview">
      <DialogContent class="sm:max-w-[800px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>代码预览</DialogTitle>
          <DialogDescription>
            查看生成的代码文件内容
          </DialogDescription>
        </DialogHeader>
        
        <Tabs v-model="activeTab" class="flex-1 flex flex-col min-h-0">
          <TabsList class="w-full justify-start overflow-x-auto">
            <TabsTrigger v-for="(_, key) in previewData" :key="key" :value="key">
              {{ key }}
            </TabsTrigger>
          </TabsList>
          <div class="flex-1 min-h-0 mt-2 border rounded-md bg-muted/50 p-4 overflow-auto">
            <pre class="text-xs font-mono">{{ previewData[activeTab] }}</pre>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  </div>
</template>
