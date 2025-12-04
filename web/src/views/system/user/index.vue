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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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
import { MoreHorizontal, Plus, Search, FileDown, Trash2, Loader2, RefreshCw, Key } from 'lucide-vue-next'
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus } from '@/api/system/user'
import { listDeptTree } from '@/api/system/dept'
import { listRole } from '@/api/system/role'
import { listPost } from '@/api/system/post'
import type { SysUser, SysDept, SysRole, SysPost } from '@/api/system/types'

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
  deptId: undefined
})

const deptOptions = ref<any[]>([])
const roleOptions = ref<SysRole[]>([])
const postOptions = ref<SysPost[]>([])

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const userToDelete = ref<SysUser | null>(null)
const isEdit = ref(false)
const submitLoading = ref(false)

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
  handleQuery()
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
  Object.assign(form, userRes.data)
  form.postIds = userRes.postIds
  form.roleIds = userRes.roleIds
  // Password is not needed for update
  delete form.password
  
  roleOptions.value = roleRes.rows
  postOptions.value = postRes.rows
  showDialog.value = true
}

async function handleSubmit() {
  if (!form.userName || !form.nickName) {
    toast({
      title: "验证失败",
      description: "用户名和昵称不能为空",
      variant: "destructive"
    })
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
  } finally {
    submitLoading.value = false
  }
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

async function handleResetPwd(row: SysUser) {
  const password = prompt('请输入新密码', '123456')
  if (password) {
    await resetUserPwd(row.userId, password)
    toast({ title: "操作成功", description: "密码已重置" })
  }
}

async function handleStatusChange(row: SysUser) {
  const text = row.status === '0' ? '停用' : '启用'
  if (confirm('确认要' + text + '用户"' + row.userName + '"吗？')) {
    try {
      await changeUserStatus(row.userId, row.status === '0' ? '1' : '0')
      row.status = row.status === '0' ? '1' : '0'
      toast({ title: "操作成功", description: "用户状态已变更" })
    } catch {
      // revert on error
    }
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

onMounted(() => {
  getList()
  getDeptTree()
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
        <Button variant="outline">
          <FileDown class="mr-2 h-4 w-4" />
          导出
        </Button>
        <Button @click="handleAdd">
          <Plus class="mr-2 h-4 w-4" />
          新增用户
        </Button>
      </div>
    </div>

    <!-- Filters -->
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
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">状态</span>
        <Select v-model="queryParams.status">
          <SelectTrigger class="w-[120px]">
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">正常</SelectItem>
            <SelectItem value="1">停用</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">部门</span>
        <Select v-model="queryParams.deptId">
           <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="请选择部门" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem v-for="dept in flattenedDepts" :key="dept.id" :value="dept.id">
              {{ dept.label }}
            </SelectItem>
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
            <TableHead class="w-[100px]">用户编号</TableHead>
            <TableHead>用户名</TableHead>
            <TableHead>用户昵称</TableHead>
            <TableHead>部门</TableHead>
            <TableHead>手机号码</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead class="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in userList" :key="user.userId">
            <TableCell>{{ user.userId }}</TableCell>
            <TableCell class="font-medium">{{ user.userName }}</TableCell>
            <TableCell>{{ user.nickName }}</TableCell>
            <TableCell>{{ user.dept?.deptName }}</TableCell>
            <TableCell>{{ user.phonenumber }}</TableCell>
            <TableCell>
               <div class="flex items-center space-x-2">
                <Badge :variant="user.status === '0' ? 'default' : 'destructive'">
                  {{ user.status === '0' ? '正常' : '停用' }}
                </Badge>
              </div>
            </TableCell>
            <TableCell>{{ user.createTime }}</TableCell>
            <TableCell class="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" class="h-8 w-8 p-0">
                    <span class="sr-only">Open menu</span>
                    <MoreHorizontal class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>操作</DropdownMenuLabel>
                  <DropdownMenuItem @click="handleUpdate(user)">
                    <RefreshCw class="mr-2 h-4 w-4" />
                    修改
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="handleResetPwd(user)">
                    <Key class="mr-2 h-4 w-4" />
                    重置密码
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive" @click="handleDelete(user)">
                    <Trash2 class="mr-2 h-4 w-4" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          <TableRow v-if="userList.length === 0">
            <TableCell colspan="8" class="text-center h-24 text-muted-foreground">
              暂无数据
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end">
       <!-- Pagination Logic Simplified for Mock -->
       <div class="text-sm text-muted-foreground p-2">
         共 {{ total }} 条
       </div>
    </div>

    <!-- Add/Edit Dialog -->
    <Dialog v-model:open="showDialog">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ isEdit ? '修改用户' : '新增用户' }}</DialogTitle>
          <DialogDescription>
            请填写用户信息
          </DialogDescription>
        </DialogHeader>
        
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="nickName">用户昵称 *</Label>
              <Input id="nickName" v-model="form.nickName" placeholder="请输入昵称" />
            </div>
            <div class="grid gap-2">
              <Label for="deptId">归属部门</Label>
              <Select v-model="form.deptId">
                <SelectTrigger>
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="dept in flattenedDepts" :key="dept.id" :value="dept.id">
                    {{ dept.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="phonenumber">手机号码</Label>
              <Input id="phonenumber" v-model="form.phonenumber" placeholder="请输入手机号" />
            </div>
            <div class="grid gap-2">
              <Label for="email">邮箱</Label>
              <Input id="email" v-model="form.email" placeholder="请输入邮箱" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="userName">用户名称 *</Label>
              <Input id="userName" v-model="form.userName" :disabled="isEdit" placeholder="请输入用户名称" />
            </div>
            <div class="grid gap-2" v-if="!isEdit">
              <Label for="password">用户密码</Label>
              <Input id="password" type="password" v-model="form.password" placeholder="请输入密码" />
            </div>
          </div>

           <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="sex">用户性别</Label>
              <Select v-model="form.sex">
                <SelectTrigger>
                  <SelectValue placeholder="选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">男</SelectItem>
                  <SelectItem value="1">女</SelectItem>
                  <SelectItem value="2">未知</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-2">
              <Label for="status">状态</Label>
              <Select v-model="form.status">
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">正常</SelectItem>
                  <SelectItem value="1">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="grid gap-2">
            <Label>岗位</Label>
            <div class="flex flex-wrap gap-2 border rounded-md p-2">
              <label v-for="post in postOptions" :key="post.postId" class="flex items-center gap-2 text-sm cursor-pointer">
                 <Checkbox 
                   :checked="form.postIds?.includes(post.postId)"
                   @update:checked="(checked: boolean) => {
                     if (!form.postIds) form.postIds = []
                     if (checked) form.postIds.push(post.postId)
                     else form.postIds = form.postIds.filter(id => id !== post.postId)
                   }"
                 />
                 {{ post.postName }}
              </label>
            </div>
          </div>

          <div class="grid gap-2">
            <Label>角色</Label>
            <div class="flex flex-wrap gap-2 border rounded-md p-2">
              <label v-for="role in roleOptions" :key="role.roleId" class="flex items-center gap-2 text-sm cursor-pointer">
                 <Checkbox 
                   :checked="form.roleIds?.includes(role.roleId)"
                   @update:checked="(checked: boolean) => {
                     if (!form.roleIds) form.roleIds = []
                     if (checked) form.roleIds.push(role.roleId)
                     else form.roleIds = form.roleIds.filter(id => id !== role.roleId)
                   }"
                 />
                 {{ role.roleName }}
              </label>
            </div>
          </div>

          <div class="grid gap-2">
            <Label for="remark">备注</Label>
            <Input id="remark" v-model="form.remark" placeholder="请输入备注" />
          </div>
        </div>

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
  </div>
</template>
