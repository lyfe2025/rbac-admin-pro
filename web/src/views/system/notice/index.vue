<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { Plus, Edit, Trash2, RefreshCw, Search, Loader2, Eye } from 'lucide-vue-next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import TablePagination from '@/components/common/TablePagination.vue'
import { formatDate } from '@/utils/format'
import { sanitizeHtml } from '@/utils/sanitize'
import { listNotice, getNotice, delNotice, addNotice, updateNotice, type SysNotice } from '@/api/system/notice'

const { toast } = useToast()

// State
const loading = ref(true)
const noticeList = ref<SysNotice[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  noticeTitle: '',
  createBy: '',
  noticeType: undefined
})

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const showPreviewDialog = ref(false)
const noticeToDelete = ref<SysNotice | null>(null)
const previewNotice = ref<SysNotice | null>(null)
const isEdit = ref(false)
const submitLoading = ref(false)

const form = reactive({
  noticeId: undefined as string | undefined,
  noticeTitle: '',
  noticeType: '1',
  noticeContent: '',
  status: '0'
})

// Fetch Data
async function getList() {
  loading.value = true
  try {
    const res = await listNotice(queryParams)
    noticeList.value = res.rows
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
  queryParams.noticeTitle = ''
  queryParams.createBy = ''
  queryParams.noticeType = undefined
  handleQuery()
}

// Add/Edit Operations
function handleAdd() {
  resetForm()
  isEdit.value = false
  showDialog.value = true
}

async function handleUpdate(row: SysNotice) {
  resetForm()
  isEdit.value = true
  const res = await getNotice(row.noticeId)
  Object.assign(form, res)
  showDialog.value = true
}

function handleDelete(row: SysNotice) {
  noticeToDelete.value = row
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!noticeToDelete.value) return
  try {
    await delNotice([noticeToDelete.value.noticeId])
    toast({ title: "删除成功", description: "公告已删除" })
    getList()
  } finally {
    showDeleteDialog.value = false
  }
}

// 预览公告
function handlePreview(row: SysNotice) {
  previewNotice.value = row
  showPreviewDialog.value = true
}

async function handleSubmit() {
  if (!form.noticeTitle || !form.noticeContent) {
    toast({ title: "验证失败", description: "标题和内容不能为空", variant: "destructive" })
    return
  }

  submitLoading.value = true
  try {
    if (form.noticeId) {
      await updateNotice(form)
      toast({ title: "修改成功", description: "公告已更新" })
    } else {
      await addNotice(form)
      toast({ title: "新增成功", description: "公告已创建" })
    }
    showDialog.value = false
    getList()
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitLoading.value = false
  }
}

function resetForm() {
  form.noticeId = undefined
  form.noticeTitle = ''
  form.noticeType = '1'
  form.noticeContent = ''
  form.status = '0'
}

function getNoticeTypeLabel(type: string) {
  const map: Record<string, string> = {
    '1': '通知',
    '2': '公告'
  }
  return map[type] || '未知'
}

// 清洗后的预览内容，防止 XSS 攻击
const sanitizedPreviewContent = computed(() => {
  return sanitizeHtml(previewNotice.value?.noticeContent)
})

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight">通知公告</h2>
        <p class="text-muted-foreground">
          发布和管理系统通知公告
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button @click="handleAdd">
          <Plus class="mr-2 h-4 w-4" />
          新增公告
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 sm:items-center bg-background/95 p-4 border rounded-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">公告标题</span>
        <Input 
          v-model="queryParams.noticeTitle" 
          placeholder="请输入公告标题" 
          class="w-[150px]"
          @keyup.enter="handleQuery"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">操作人员</span>
        <Input 
          v-model="queryParams.createBy" 
          placeholder="请输入操作人员" 
          class="w-[150px]"
          @keyup.enter="handleQuery"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">类型</span>
        <Select v-model="queryParams.noticeType">
          <SelectTrigger class="w-[120px]">
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">通知</SelectItem>
            <SelectItem value="2">公告</SelectItem>
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
    <div class="border rounded-md bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>序号</TableHead>
            <TableHead>公告标题</TableHead>
            <TableHead>公告类型</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建者</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead class="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in noticeList" :key="item.noticeId">
            <TableCell>{{ item.noticeId }}</TableCell>
            <TableCell>{{ item.noticeTitle }}</TableCell>
            <TableCell>
               <Badge variant="outline">{{ getNoticeTypeLabel(item.noticeType) }}</Badge>
            </TableCell>
            <TableCell>
               <Badge :variant="item.status === '0' ? 'default' : 'destructive'">
                {{ item.status === '0' ? '正常' : '关闭' }}
              </Badge>
            </TableCell>
            <TableCell>{{ item.createBy }}</TableCell>
            <TableCell>{{ formatDate(item.createTime) }}</TableCell>
            <TableCell class="text-right space-x-2">
              <Button variant="ghost" size="icon" @click="handlePreview(item)" title="预览">
                <Eye class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="handleUpdate(item)" title="编辑">
                <Edit class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" class="text-destructive" @click="handleDelete(item)" title="删除">
                <Trash2 class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow v-if="noticeList.length === 0">
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

    <!-- Add/Edit Dialog -->
    <Dialog v-model:open="showDialog">
      <DialogContent class="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{{ isEdit ? '修改公告' : '新增公告' }}</DialogTitle>
          <DialogDescription>
            请填写公告信息
          </DialogDescription>
        </DialogHeader>
        
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-2 gap-4">
             <div class="grid gap-2">
              <Label for="noticeTitle">公告标题 *</Label>
              <Input id="noticeTitle" v-model="form.noticeTitle" placeholder="请输入公告标题" />
            </div>
            <div class="grid gap-2">
               <Label for="noticeType">公告类型</Label>
               <Select v-model="form.noticeType">
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">通知</SelectItem>
                    <SelectItem value="2">公告</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>

          <div class="grid gap-2">
            <Label for="status">状态</Label>
             <Select v-model="form.status">
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">正常</SelectItem>
                  <SelectItem value="1">关闭</SelectItem>
                </SelectContent>
              </Select>
          </div>

          <div class="grid gap-2">
            <Label for="noticeContent">内容 *</Label>
            <RichTextEditor v-model="form.noticeContent" placeholder="请输入公告内容..." />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showDialog = false">取消</Button>
          <Button @click="handleSubmit" :disabled="submitLoading">
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除?</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要删除公告 "{{ noticeToDelete?.noticeTitle }}" 吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete" class="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Preview Dialog -->
    <Dialog v-model:open="showPreviewDialog">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ previewNotice?.noticeTitle }}</DialogTitle>
          <DialogDescription>
            <Badge variant="outline" class="mr-2">{{ getNoticeTypeLabel(previewNotice?.noticeType || '1') }}</Badge>
            <span class="text-muted-foreground">{{ previewNotice?.createBy }} 发布于 {{ formatDate(previewNotice?.createTime) }}</span>
          </DialogDescription>
        </DialogHeader>
        <div class="py-4 prose prose-sm dark:prose-invert max-w-none" v-html="sanitizedPreviewContent" />
        <DialogFooter>
          <Button variant="outline" @click="showPreviewDialog = false">关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
