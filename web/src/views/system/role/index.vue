<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from 'vue'
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
import { Trash2, Plus, RefreshCw, Search, Edit, Loader2, ChevronRight, ChevronDown } from 'lucide-vue-next'
import TablePagination from '@/components/common/TablePagination.vue'
import { formatDate } from '@/utils/format'
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

// 将扁平菜单列表转换为树形结构
function buildMenuTree(flatList: SysMenu[]): SysMenu[] {
  const map = new Map<string, SysMenu>()
  const roots: SysMenu[] = []
  
  // 先创建所有节点的映射,并添加 children 数组
  flatList.forEach(item => {
    map.set(item.menuId, { ...item, children: [] })
  })
  
  // 构建树形结构
  flatList.forEach(item => {
    const node = map.get(item.menuId)!
    if (item.parentId === null || item.parentId === '0') {
      // 根节点
      roots.push(node)
    } else {
      // 子节点,添加到父节点的 children 中
      const parent = map.get(item.parentId)
      if (parent) {
        parent.children!.push(node)
      }
    }
  })
  
  return roots
}

async function getMenuTree() {
  if (menuList.value.length > 0) return
  const res = await listMenu({})
  // 将扁平列表转换为树形结构
  menuList.value = buildMenuTree(res.data)
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
  try {
    // getRole 已经在 API 层做了 .then(res => res.data),所以这里直接使用返回值
    const roleData = await getRole(roleId)
    if (roleData) {
      // 将后端返回的数据赋值给表单,确保 menuIds 是字符串数组
      Object.assign(form, {
        ...roleData,
        menuIds: (roleData.menuIds || []).map((id: any) => String(id))
      })
    }
    showDialog.value = true
  } catch (error) {
    console.error('获取角色详情失败:', error)
    toast({ 
      title: "获取失败", 
      description: "无法获取角色详情",
      variant: "destructive"
    })
  }
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
const MenuTreeItem: any = {
  name: 'MenuTreeItem',
  props: ['menu', 'modelValue', 'checkStrictly', 'level'],
  emits: ['update:modelValue'],
  setup(props: any, { emit }: any) {
    const isChecked = computed(() => props.modelValue.includes(props.menu.menuId))
    const currentLevel = props.level || 0
    const isExpanded = ref(false) // 默认收起
    const hasChildren = computed(() => props.menu.children && props.menu.children.length > 0)
    
    function toggleExpand() {
      isExpanded.value = !isExpanded.value
    }
    
    function toggle(checked: boolean | 'indeterminate') {
      if (checked === 'indeterminate') return
      
      let newIds = [...props.modelValue]
      if (checked) {
        if (!newIds.includes(props.menu.menuId)) newIds.push(props.menu.menuId)
        // Select children if checkStrictly is true (联动开启)
        if (props.checkStrictly && hasChildren.value) {
           const addChildren = (nodes: any[]) => {
             nodes.forEach(n => {
               if (!newIds.includes(n.menuId)) newIds.push(n.menuId)
               if (n.children && n.children.length > 0) addChildren(n.children)
             })
           }
           addChildren(props.menu.children)
        }
      } else {
        newIds = newIds.filter((id: string) => id !== props.menu.menuId)
        // Deselect children if checkStrictly is true (联动开启)
        if (props.checkStrictly && hasChildren.value) {
           const removeChildren = (nodes: any[]) => {
             nodes.forEach(n => {
               newIds = newIds.filter((id: string) => id !== n.menuId)
               if (n.children && n.children.length > 0) removeChildren(n.children)
             })
           }
           removeChildren(props.menu.children)
        }
      }
      emit('update:modelValue', newIds)
    }

    return () => h('div', { class: 'py-1' }, [
      h('div', { 
        class: 'flex items-center gap-1',
        style: { 'padding-left': `${currentLevel * 24}px` }
      }, [
        // 展开/收起图标
        hasChildren.value
          ? h('button', {
              class: 'w-4 h-4 flex items-center justify-center hover:bg-accent rounded transition-colors',
              onClick: (e: Event) => {
                e.stopPropagation()
                toggleExpand()
              }
            }, [
              h(isExpanded.value ? ChevronDown : ChevronRight, { class: 'w-3 h-3' })
            ])
          : h('span', { class: 'w-4' }), // 占位符保持对齐
        h(Checkbox, {
          modelValue: isChecked.value,
          'onUpdate:modelValue': toggle
        }),
        h('span', { class: 'text-sm' }, props.menu.menuName)
      ]),
      // 子节点(仅在展开时显示)
      hasChildren.value && isExpanded.value
        ? h('div', {}, 
            props.menu.children.map((child: any) =>
              h(MenuTreeItem, {
                key: child.menuId,
                menu: child,
                modelValue: props.modelValue,
                checkStrictly: props.checkStrictly,
                level: currentLevel + 1,
                'onUpdate:modelValue': (val: any) => emit('update:modelValue', val)
              })
            )
          )
        : null
    ])
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
            <TableCell>{{ formatDate(item.createTime) }}</TableCell>
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
    <TablePagination
      v-model:page-num="queryParams.pageNum"
      v-model:page-size="queryParams.pageSize"
      :total="total"
      @change="getList"
    />

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
               <Checkbox id="checkStrictly" :model-value="form.menuCheckStrictly" @update:model-value="(val) => form.menuCheckStrictly = !!val" />
               <Label for="checkStrictly" class="text-sm text-muted-foreground">父子联动</Label>
            </div>
            <div class="border rounded-md p-2 h-[200px] overflow-y-auto">
              <MenuTreeItem 
                v-for="menu in menuList" 
                :key="menu.menuId" 
                :menu="menu" 
                v-model="form.menuIds"
                :checkStrictly="form.menuCheckStrictly"
                :level="0"
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
