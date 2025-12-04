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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/toast/use-toast'
import { Plus, Edit, Trash2, Shield, RefreshCw, Search, Check, Loader2 } from 'lucide-vue-next'
import { listRole, getRole, delRole, addRole, updateRole, changeRoleStatus } from '@/api/system/role'
import { listMenu } from '@/api/system/menu'
import type { SysRole, SysMenu } from '@/api/system/types'

const { toast } = useToast()

// State
const loading = ref(true)
const roleList = ref<SysRole[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  roleName: '',
  roleKey: '',
  status: undefined
})

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const roleToDelete = ref<SysRole | null>(null)
const isEdit = ref(false)
const submitLoading = ref(false)
const menuList = ref<SysMenu[]>([])

const form = reactive<Partial<SysRole>>({
  roleId: undefined,
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: '0',
  menuIds: [],
  remark: '',
  menuCheckStrictly: true
})

// Fetch Data
async function getList() {
  loading.value = true
  try {
    const res = await listRole(queryParams)
    roleList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

async function getMenuTree() {
  if (menuList.value.length > 0) return
  const res = await listMenu({})
  menuList.value = res.data
}

// Search Operations
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.roleName = ''
  queryParams.roleKey = ''
  queryParams.status = undefined
  handleQuery()
}

// Add/Edit Operations
async function handleAdd() {
  resetForm()
  isEdit.value = false
  await getMenuTree()
  showDialog.value = true
}

async function handleUpdate(row: SysRole) {
  resetForm()
  isEdit.value = true
  const roleId = row.roleId
  await getMenuTree()
  const res = await getRole(roleId)
  Object.assign(form, res.data)
  showDialog.value = true
}

async function handleDelete(row: SysRole) {
  roleToDelete.value = row
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!roleToDelete.value) return
  try {
    await delRole([roleToDelete.value.roleId])
    toast({ title: "删除成功", description: "角色已删除" })
    getList()
    showDeleteDialog.value = false
  } catch (error) {
    // handled by interceptor
  }
}

async function handleStatusChange(row: SysRole) {
  const text = row.status === '0' ? '停用' : '启用'
  if (confirm('确认要' + text + '角色"' + row.roleName + '"吗？')) {
    try {
      await changeRoleStatus(row.roleId, row.status === '0' ? '1' : '0')
      row.status = row.status === '0' ? '1' : '0'
      toast({ title: "操作成功", description: "角色状态已变更" })
    } catch {
      // revert
    }
  }
}

async function handleSubmit() {
  if (!form.roleName || !form.roleKey) {
    toast({
      title: "验证失败",
      description: "角色名称和权限字符不能为空",
      variant: "destructive"
    })
    return
  }

  submitLoading.value = true
  try {
    if (form.roleId) {
      await updateRole(form)
      toast({ title: "修改成功", description: "角色信息已更新" })
    } else {
      await addRole(form)
      toast({ title: "新增成功", description: "角色已创建" })
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
  form.roleId = undefined
  form.roleName = ''
  form.roleKey = ''
  form.roleSort = 0
  form.status = '0'
  form.menuIds = []
  form.remark = ''
  form.menuCheckStrictly = true
}

// Simple recursive component for menu tree checklist
// In real project, use a Tree component with checkbox support
const MenuTreeItem = {
  name: 'MenuTreeItem',
  props: ['menu', 'modelValue', 'checkStrictly'],
  emits: ['update:modelValue'],
  components: { Checkbox },
  setup(props: any, { emit }: any) {
    const isChecked = computed(() => props.modelValue.includes(props.menu.menuId))
    
    function toggle(checked: boolean) {
      let newIds = [...props.modelValue]
      if (checked) {
        if (!newIds.includes(props.menu.menuId)) newIds.push(props.menu.menuId)
        // Select children if strictly is false
        if (!props.checkStrictly && props.menu.children) {
           const addChildren = (nodes: any[]) => {
             nodes.forEach(n => {
               if (!newIds.includes(n.menuId)) newIds.push(n.menuId)
               if (n.children) addChildren(n.children)
             })
           }
           addChildren(props.menu.children)
        }
      } else {
        newIds = newIds.filter((id: string) => id !== props.menu.menuId)
        // Deselect children if strictly is false
        if (!props.checkStrictly && props.menu.children) {
           const removeChildren = (nodes: any[]) => {
             nodes.forEach(n => {
               newIds = newIds.filter((id: string) => id !== n.menuId)
               if (n.children) removeChildren(n.children)
             })
           }
           removeChildren(props.menu.children)
        }
      }
      emit('update:modelValue', newIds)
    }

    return { isChecked, toggle }
  },
  template: `
    <div class="pl-4 py-1">
      <div class="flex items-center gap-2">
        <Checkbox :checked="isChecked" @update:checked="toggle" />
        <span class="text-sm">{{ menu.menuName }}</span>
      </div>
      <div v-if="menu.children && menu.children.length" class="border-l ml-2">
        <MenuTreeItem 
          v-for="child in menu.children" 
          :key="child.menuId" 
          :menu="child" 
          :modelValue="modelValue"
          :checkStrictly="checkStrictly"
          @update:modelValue="$emit('update:modelValue', $event)"
        />
      </div>
    </div>
  `
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
        <h2 class="text-2xl font-bold tracking-tight">角色管理</h2>
        <p class="text-muted-foreground">
          管理系统角色及其权限分配
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button @click="handleAdd">
          <Plus class="mr-2 h-4 w-4" />
          新增角色
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-center bg-background/95 p-4 border rounded-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">角色名称</span>
        <Input 
          v-model="queryParams.roleName" 
          placeholder="请输入角色名称" 
          class="w-[200px]"
          @keyup.enter="handleQuery"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">权限字符</span>
        <Input 
          v-model="queryParams.roleKey" 
          placeholder="请输入权限字符" 
          class="w-[200px]"
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
            <TableHead>角色编号</TableHead>
            <TableHead>角色名称</TableHead>
            <TableHead>权限字符</TableHead>
            <TableHead>显示顺序</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead class="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in roleList" :key="item.roleId">
            <TableCell>{{ item.roleId }}</TableCell>
            <TableCell>{{ item.roleName }}</TableCell>
            <TableCell><Badge variant="outline">{{ item.roleKey }}</Badge></TableCell>
            <TableCell>{{ item.roleSort }}</TableCell>
            <TableCell>
               <Switch 
                 :checked="item.status === '0'" 
                 @update:checked="handleStatusChange(item)"
               />
            </TableCell>
            <TableCell>{{ item.createTime }}</TableCell>
            <TableCell class="text-right space-x-2">
              <Button variant="ghost" size="icon" @click="handleUpdate(item)">
                <Edit class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" class="text-destructive" @click="handleDelete(item)">
                <Trash2 class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
           <TableRow v-if="roleList.length === 0">
            <TableCell colspan="7" class="text-center h-24 text-muted-foreground">
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

    <!-- Add/Edit Dialog -->
    <Dialog v-model:open="showDialog">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ isEdit ? '修改角色' : '新增角色' }}</DialogTitle>
          <DialogDescription>
            请填写角色信息
          </DialogDescription>
        </DialogHeader>
        
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="roleName">角色名称 *</Label>
              <Input id="roleName" v-model="form.roleName" placeholder="请输入角色名称" />
            </div>
            <div class="grid gap-2">
              <Label for="roleKey">权限字符 *</Label>
              <Input id="roleKey" v-model="form.roleKey" placeholder="请输入权限字符" />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="roleSort">显示顺序</Label>
              <Input id="roleSort" type="number" v-model="form.roleSort" />
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
            <Label>菜单权限</Label>
            <div class="flex items-center space-x-2 mb-2">
               <Checkbox id="checkStrictly" :checked="form.menuCheckStrictly" @update:checked="(val: boolean) => form.menuCheckStrictly = val" />
               <Label for="checkStrictly" class="text-sm text-muted-foreground">父子联动</Label>
            </div>
            <div class="border rounded-md p-2 h-[200px] overflow-y-auto">
              <MenuTreeItem 
                v-for="menu in menuList" 
                :key="menu.menuId" 
                :menu="menu" 
                v-model="form.menuIds"
                :checkStrictly="form.menuCheckStrictly"
              />
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
            您确定要删除角色 "{{ roleToDelete?.roleName }}" 吗？此操作无法撤销。
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
