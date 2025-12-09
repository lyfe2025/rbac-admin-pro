<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useToast } from '@/components/ui/toast/use-toast'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Search, 
  FileDown, 
  Trash2, 
  Loader2, 
  RefreshCw, 
  Key, 
  Eye,
  CheckSquare,
  XSquare,
  Filter,
  Edit,
  Settings2
} from 'lucide-vue-next'
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus } from '@/api/system/user'
import { listDeptTree } from '@/api/system/dept'
import { listRole } from '@/api/system/role'
import { listPost } from '@/api/system/post'
import type { SysUser, SysDept, SysRole, SysPost } from '@/api/system/types'
import DeptTreeSelect from '@/components/business/DeptTreeSelect.vue'
import UserForm from '@/components/business/UserForm.vue'
import UserDetailDialog from '@/components/business/UserDetailDialog.vue'
import TablePagination from '@/components/common/TablePagination.vue'
import { formatDate } from '@/utils/format'

// State
const loading = ref(true)
const userList = ref<SysUser[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: '',
  phonenumber: '',
  status: undefined,
  deptId: undefined,
  roleId: undefined
})

// 高级搜索
const showAdvancedSearch = ref(false)
const selectedRows = ref<string[]>([])
const selectAll = ref(false)

// 表格列配置
interface ColumnConfig {
  key: string
  label: string
  visible: boolean
  fixed?: boolean // 固定列不可隐藏
}

const COLUMN_STORAGE_KEY = 'user-table-columns'

// 默认列配置
const defaultColumns: ColumnConfig[] = [
  { key: 'userId', label: '用户编号', visible: true },
  { key: 'userName', label: '用户名', visible: true, fixed: true },
  { key: 'nickName', label: '用户昵称', visible: true },
  { key: 'dept', label: '部门', visible: true },
  { key: 'phonenumber', label: '手机号码', visible: true },
  { key: 'email', label: '邮箱', visible: false },
  { key: 'status', label: '状态', visible: true },
  { key: 'createTime', label: '创建时间', visible: true },
]

// 从 localStorage 加载列配置
function loadColumnConfig(): ColumnConfig[] {
  try {
    const saved = localStorage.getItem(COLUMN_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as ColumnConfig[]
      // 合并保存的配置与默认配置，确保新增列也能显示
      return defaultColumns.map((col) => {
        const savedCol = parsed.find((c) => c.key === col.key)
        return savedCol ? { ...col, visible: savedCol.visible } : col
      })
    }
  } catch {
    // ignore
  }
  return defaultColumns.map((c) => ({ ...c }))
}

// 保存列配置到 localStorage
function saveColumnConfig() {
  localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(columns.value))
}

const columns = ref<ColumnConfig[]>(loadColumnConfig())

// 切换列显示
function toggleColumn(key: string) {
  const col = columns.value.find((c) => c.key === key)
  if (col && !col.fixed) {
    col.visible = !col.visible
    saveColumnConfig()
  }
}

// 重置列配置
function resetColumns() {
  columns.value = defaultColumns.map((c) => ({ ...c }))
  saveColumnConfig()
}

// 判断列是否可见
function isColumnVisible(key: string): boolean {
  const col = columns.value.find((c) => c.key === key)
  return col ? col.visible : true
}

// 计算属性:是否有选中的行
const hasSelectedRows = computed(() => selectedRows.value.length > 0)

// 计算属性:可见列数量(用于空数据colspan)
const visibleColumnCount = computed(() => {
  // 选择框列 + 可见数据列 + 操作列
  return 1 + columns.value.filter((c) => c.visible).length + 1
})

const deptOptions = ref<any[]>([])
const roleOptions = ref<SysRole[]>([])
const postOptions = ref<SysPost[]>([])

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const showDetailDialog = ref(false)
const showBatchDeleteDialog = ref(false)
const userToDelete = ref<SysUser | null>(null)
const currentUser = ref<SysUser | null>(null)
const isEdit = ref(false)
const submitLoading = ref(false)
const userFormRef = ref<InstanceType<typeof UserForm> | null>(null)

// Form Data
const form = reactive<Partial<SysUser>>({
  userId: undefined,
  deptId: undefined,
  userName: '',
  nickName: '',
  password: '',
  phonenumber: '',
  email: '',
  sex: '0',
  status: '0',
  remark: '',
  postIds: [],
  roleIds: []
})

const { toast } = useToast()

// 获取完整的头像URL
function getAvatarUrl(avatar: string | undefined | null): string {
  if (!avatar) return ''
  // 如果已经是完整URL,直接返回
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar
  }
  // 如果是相对路径,拼接后端地址
  return `${import.meta.env.VITE_API_URL}${avatar}`
}

// Fetch Data
async function getList() {
  loading.value = true
  try {
    const res = await listUser(queryParams)
    userList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

async function getDeptTree() {
  const res = await listDeptTree()
  deptOptions.value = toTreeDept(res.data)
}

// Search Operations
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.userName = ''
  queryParams.phonenumber = ''
  queryParams.status = undefined
  queryParams.deptId = undefined
  queryParams.roleId = undefined
  handleQuery()
}

// 切换高级搜索
function toggleAdvancedSearch() {
  showAdvancedSearch.value = !showAdvancedSearch.value
}

// Add/Edit Operations
async function handleAdd() {
  resetForm()
  isEdit.value = false
  // Load roles and posts
  const [roleRes, postRes] = await Promise.all([listRole({}), listPost({})])
  roleOptions.value = roleRes.rows
  postOptions.value = postRes.rows
  showDialog.value = true
}

async function handleUpdate(row: SysUser) {
  resetForm()
  isEdit.value = true
  const userId = row.userId
  
  const [userRes, roleRes, postRes] = await Promise.all([
    getUser(userId),
    listRole({}),
    listPost({})
  ])
  
  Object.assign(form, userRes.user)
  form.postIds = userRes.postIds
  form.roleIds = userRes.roleIds
  // Password is not needed for update
  delete form.password
  
  roleOptions.value = roleRes.rows
  postOptions.value = postRes.rows
  showDialog.value = true
}

async function handleSubmit() {
  // 使用表单组件的验证方法
  if (userFormRef.value && !userFormRef.value.validate()) {
    return
  }

  submitLoading.value = true
  try {
    if (form.userId) {
      await updateUser(form)
      toast({ title: "修改成功", description: "用户信息已更新" })
    } else {
      await addUser(form)
      toast({ title: "新增成功", description: "用户已创建" })
    }
    showDialog.value = false
    getList()
  } catch (error) {
    // 错误已由请求拦截器处理
  } finally {
    submitLoading.value = false
  }
}

// 查看详情
async function handleDetail(row: SysUser) {
  // 获取完整的用户信息(包含角色和岗位)
  const userRes = await getUser(row.userId)
  currentUser.value = {
    ...userRes.user,
    roles: userRes.roles,
    posts: userRes.posts,
  } as any
  showDetailDialog.value = true
}

// 批量删除
function handleBatchDelete() {
  if (selectedRows.value.length === 0) {
    toast({
      title: "提示",
      description: "请选择要删除的用户",
      variant: "destructive"
    })
    return
  }
  showBatchDeleteDialog.value = true
}

async function confirmBatchDelete() {
  try {
    // 逐个删除
    for (const userId of selectedRows.value) {
      await delUser([userId])
    }
    toast({ 
      title: "删除成功", 
      description: `已删除 ${selectedRows.value.length} 个用户` 
    })
    selectedRows.value = []
    selectAll.value = false
    getList()
    showBatchDeleteDialog.value = false
  } catch (error) {
    // Error handled by interceptor
  }
}

// 批量启用/停用
const showBatchStatusDialog = ref(false)
const batchStatusType = ref<'0' | '1'>('0')

function handleBatchStatus(status: '0' | '1') {
  if (selectedRows.value.length === 0) {
    toast({
      title: "提示",
      description: "请选择要操作的用户",
      variant: "destructive"
    })
    return
  }
  batchStatusType.value = status
  showBatchStatusDialog.value = true
}

async function confirmBatchStatus() {
  const status = batchStatusType.value
  const text = status === '0' ? '启用' : '停用'
  
  try {
    for (const userId of selectedRows.value) {
      await changeUserStatus(userId, status)
    }
    toast({ 
      title: "操作成功", 
      description: `已${text} ${selectedRows.value.length} 个用户` 
    })
    selectedRows.value = []
    selectAll.value = false
    getList()
    showBatchStatusDialog.value = false
  } catch (error) {
    // Error handled by interceptor
  }
}

// 导出功能
function handleExport() {
  // 简单的 CSV 导出
  const headers = ['用户编号', '用户名', '用户昵称', '部门', '手机号码', '邮箱', '状态', '创建时间']
  const rows = userList.value.map(user => [
    user.userId,
    user.userName,
    user.nickName,
    user.dept?.deptName || '',
    user.phonenumber,
    user.email,
    user.status === '0' ? '正常' : '停用',
    formatDate(user.createTime)
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `用户列表_${new Date().getTime()}.csv`
  link.click()
  
  toast({ title: "导出成功", description: "用户数据已导出" })
}


// 切换单个选择
function toggleRowSelection(userId: string) {
  const index = selectedRows.value.indexOf(userId)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(userId)
  }
  // 更新全选状态
  selectAll.value = selectedRows.value.length > 0 && selectedRows.value.length === userList.value.length
}

async function handleDelete(row: SysUser) {
  userToDelete.value = row
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!userToDelete.value) return
  try {
    await delUser([userToDelete.value.userId])
    toast({ title: "删除成功", description: "用户已删除" })
    getList()
    showDeleteDialog.value = false
  } catch (error) {
    // Error handled by interceptor
  }
}

// 重置密码
const showResetPwdDialog = ref(false)
const userToResetPwd = ref<SysUser | null>(null)
const newPassword = ref('123456')

function handleResetPwd(row: SysUser) {
  userToResetPwd.value = row
  newPassword.value = '123456'
  showResetPwdDialog.value = true
}

async function confirmResetPwd() {
  if (!userToResetPwd.value || !newPassword.value) return
  try {
    await resetUserPwd(userToResetPwd.value.userId, newPassword.value)
    toast({ title: "操作成功", description: "密码已重置" })
    showResetPwdDialog.value = false
  } catch (error) {
    // Error handled by interceptor
  }
}

async function handleStatusChange(row: SysUser) {
  try {
    await changeUserStatus(row.userId, row.status === '0' ? '1' : '0')
    row.status = row.status === '0' ? '1' : '0'
    toast({ title: "操作成功", description: "用户状态已变更" })
  } catch {
    // revert on error
  }
}

function resetForm() {
  form.userId = undefined
  form.deptId = undefined
  form.userName = ''
  form.nickName = ''
  form.password = ''
  form.phonenumber = ''
  form.email = ''
  form.sex = '0'
  form.status = '0'
  form.remark = ''
  form.postIds = []
  form.roleIds = []
}

// Dept Tree Helper
// 将部门树扁平化为下拉选项，确保拥有有效的 id 与 label 字段
const flattenedDepts = computed(() => {
  const result: Array<{ id: string; label: string }> = []
  const traverse = (nodes: Array<{ deptId: string; deptName: string; children?: any[] }>, prefix = '') => {
    for (const node of nodes || []) {
      result.push({ id: node.deptId, label: prefix + node.deptName })
      if (node.children && node.children.length) {
        traverse(node.children as any[], prefix + '-- ')
      }
    }
  }
  traverse(deptOptions.value as any[])
  return result
})

// 将扁平部门列表转换为树形结构（用于筛选与表单）
function toTreeDept(list: any[]): any[] {
  const map = new Map<string, any>()
  const roots: any[] = []

  list.forEach((item) => {
    const node = { ...item, children: item.children ?? [] }
    map.set(item.deptId, node)
  })

  map.forEach((node) => {
    const pid = node.parentId ?? '0'
    if (pid === '0' || !map.has(pid)) {
      roots.push(node)
    } else {
      const parent = map.get(pid)!
      parent.children = parent.children ?? []
      parent.children.push(node)
    }
  })

  return roots
}

// 监听全选状态变化
watch(selectAll, (newVal) => {
  if (newVal) {
    selectedRows.value = userList.value.map(u => u.userId)
  } else {
    selectedRows.value = []
  }
})

const route = useRoute()

onMounted(async () => {
  await getList()
  getDeptTree()
  // 加载角色列表用于高级搜索
  const roleRes = await listRole({})
  roleOptions.value = roleRes.rows
  
  // 检查URL参数,如果有edit参数则自动打开编辑对话框
  const editUserId = route.query.edit as string
  if (editUserId) {
    const user = userList.value.find(u => String(u.userId) === editUserId)
    if (user) {
      handleUpdate(user)
    }
  }
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">用户管理</h2>
        <p class="text-muted-foreground">
          管理系统用户、分配角色和部门
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          :disabled="!hasSelectedRows"
          @click="handleBatchDelete"
        >
          <Trash2 class="mr-2 h-4 w-4" />
          批量删除
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          :disabled="!hasSelectedRows"
          @click="handleBatchStatus('0')"
        >
          <CheckSquare class="mr-2 h-4 w-4" />
          批量启用
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          :disabled="!hasSelectedRows"
          @click="handleBatchStatus('1')"
        >
          <XSquare class="mr-2 h-4 w-4" />
          批量停用
        </Button>
        <Button variant="outline" @click="handleExport">
          <FileDown class="mr-2 h-4 w-4" />
          导出
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="icon">
              <Settings2 class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-48">
            <DropdownMenuLabel>显示列</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              v-for="col in columns"
              :key="col.key"
              :checked="col.visible"
              :disabled="col.fixed"
              @select="(e: Event) => { e.preventDefault(); toggleColumn(col.key) }"
            >
              {{ col.label }}
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem @select="resetColumns">
              重置默认
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button @click="handleAdd">
          <Plus class="mr-2 h-4 w-4" />
          新增用户
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <div class="space-y-4">
      <!-- 基础搜索 -->
      <div class="flex flex-wrap gap-4 items-center bg-background/95 p-4 border rounded-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">用户名</span>
          <Input 
            v-model="queryParams.userName" 
            placeholder="请输入用户名" 
            class="w-[150px]"
            @keyup.enter="handleQuery"
          />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">手机号码</span>
          <Input 
            v-model="queryParams.phonenumber" 
            placeholder="请输入手机号码" 
            class="w-[150px]"
            @keyup.enter="handleQuery"
          />
        </div>
        <div class="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" @click="toggleAdvancedSearch">
            <Filter class="w-4 h-4 mr-2" />
            {{ showAdvancedSearch ? '收起' : '高级搜索' }}
          </Button>
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

      <!-- 高级搜索 -->
      <div v-if="showAdvancedSearch" class="bg-background/95 p-4 border rounded-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="grid grid-cols-3 gap-4">
          <div class="grid gap-2">
            <Label>状态</Label>
            <Select v-model="queryParams.status">
              <SelectTrigger>
                <SelectValue placeholder="请选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">正常</SelectItem>
                <SelectItem value="1">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label>部门</Label>
            <DeptTreeSelect
              v-model="queryParams.deptId"
              :depts="deptOptions"
              placeholder="请选择部门"
            />
          </div>
          <div class="grid gap-2">
            <Label>角色</Label>
            <Select v-model="queryParams.roleId">
              <SelectTrigger>
                <SelectValue placeholder="请选择角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="role in roleOptions" :key="role.roleId" :value="role.roleId">
                  {{ role.roleName }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[50px]">
              <Checkbox v-model="selectAll" />
            </TableHead>
            <TableHead v-if="isColumnVisible('userId')" class="w-[100px]">用户编号</TableHead>
            <TableHead v-if="isColumnVisible('userName')">用户名</TableHead>
            <TableHead v-if="isColumnVisible('nickName')">用户昵称</TableHead>
            <TableHead v-if="isColumnVisible('dept')">部门</TableHead>
            <TableHead v-if="isColumnVisible('phonenumber')">手机号码</TableHead>
            <TableHead v-if="isColumnVisible('email')">邮箱</TableHead>
            <TableHead v-if="isColumnVisible('status')">状态</TableHead>
            <TableHead v-if="isColumnVisible('createTime')">创建时间</TableHead>
            <TableHead class="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in userList" :key="user.userId">
            <TableCell>
              <Checkbox
                :model-value="selectedRows.includes(user.userId)"
                @update:model-value="() => toggleRowSelection(user.userId)"
              />
            </TableCell>
            <TableCell v-if="isColumnVisible('userId')">{{ user.userId }}</TableCell>
            <TableCell v-if="isColumnVisible('userName')" class="font-medium">
              <div class="flex items-center gap-2">
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="getAvatarUrl(user.avatar)" />
                  <AvatarFallback>{{ user.nickName?.charAt(0) || 'U' }}</AvatarFallback>
                </Avatar>
                {{ user.userName }}
              </div>
            </TableCell>
            <TableCell v-if="isColumnVisible('nickName')">{{ user.nickName }}</TableCell>
            <TableCell v-if="isColumnVisible('dept')">{{ user.dept?.deptName }}</TableCell>
            <TableCell v-if="isColumnVisible('phonenumber')">{{ user.phonenumber }}</TableCell>
            <TableCell v-if="isColumnVisible('email')">{{ user.email }}</TableCell>
            <TableCell v-if="isColumnVisible('status')">
              <Badge :variant="user.status === '0' ? 'default' : 'destructive'">
                {{ user.status === '0' ? '正常' : '停用' }}
              </Badge>
            </TableCell>
            <TableCell v-if="isColumnVisible('createTime')">{{ formatDate(user.createTime) }}</TableCell>
            <TableCell class="text-right space-x-2">
              <Button variant="ghost" size="icon" @click="handleDetail(user)" title="查看详情">
                <Eye class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="handleUpdate(user)" title="修改">
                <Edit class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="handleResetPwd(user)" title="重置密码">
                <Key class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" class="text-destructive" @click="handleDelete(user)" title="删除">
                <Trash2 class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow v-if="userList.length === 0">
            <TableCell :colspan="visibleColumnCount" class="text-center h-24 text-muted-foreground">
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
      <DialogContent class="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ isEdit ? '修改用户' : '新增用户' }}</DialogTitle>
          <DialogDescription>
            请填写用户信息
          </DialogDescription>
        </DialogHeader>
        
        <UserForm
          ref="userFormRef"
          v-model="form"
          :is-edit="isEdit"
          :depts="deptOptions"
          :roles="roleOptions"
          :posts="postOptions"
        />

        <DialogFooter>
          <Button variant="outline" @click="showDialog = false">取消</Button>
          <Button @click="handleSubmit" :disabled="submitLoading">
            <Loader2 v-if="submitLoading" class="mr-2 h-4 w-4 animate-spin" />
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
            您确定要删除用户 "{{ userToDelete?.userName }}" 吗？此操作无法撤销。
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

    <!-- Batch Delete Confirmation Dialog -->
    <AlertDialog v-model:open="showBatchDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认批量删除?</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要删除选中的 {{ selectedRows.length }} 个用户吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmBatchDelete" class="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- User Detail Dialog -->
    <UserDetailDialog
      v-model:open="showDetailDialog"
      :user="currentUser"
    />

    <!-- Reset Password Dialog -->
    <AlertDialog v-model:open="showResetPwdDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>重置密码</AlertDialogTitle>
          <AlertDialogDescription>
            为用户 "{{ userToResetPwd?.userName }}" 重置密码
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="newPassword">新密码</Label>
            <Input
              id="newPassword"
              v-model="newPassword"
              type="password"
              placeholder="请输入新密码"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmResetPwd">
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Batch Status Dialog -->
    <AlertDialog v-model:open="showBatchStatusDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认{{ batchStatusType === '0' ? '启用' : '停用' }}?</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要{{ batchStatusType === '0' ? '启用' : '停用' }}选中的 {{ selectedRows.length }} 个用户吗？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmBatchStatus">
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
