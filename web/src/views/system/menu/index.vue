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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/toast/use-toast'
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, RefreshCw, Search } from 'lucide-vue-next'
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from '@/api/system/menu'
import type { SysMenu } from '@/api/system/types'

const { toast } = useToast()

// State
const loading = ref(true)
const menuList = ref<SysMenu[]>([])
const queryParams = reactive({
  menuName: '',
  status: undefined
})
const isExpanded = ref<Record<string, boolean>>({})

const showDialog = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const menuOptions = ref<any[]>([])

const form = reactive<Partial<SysMenu>>({
  menuId: undefined,
  parentId: undefined,
  menuName: '',
  orderNum: 0,
  path: '',
  component: '',
  isFrame: 1,
  isCache: 0,
  menuType: 'M',
  visible: '0',
  status: '0',
  perms: '',
  icon: ''
})

// Fetch Data
async function getList() {
  loading.value = true
  try {
    const res = await listMenu(queryParams)
    menuList.value = res.data
    // Default expand first level
    menuList.value.forEach(m => isExpanded.value[m.menuId] = true)
  } finally {
    loading.value = false
  }
}

async function getMenuTree() {
  const res = await listMenu({})
  menuOptions.value = res.data
}

// Helper to flatten tree for table display with expansion control
const flattenMenus = computed(() => {
  const result: (SysMenu & { level: number, hasChildren: boolean })[] = []
  const traverse = (nodes: SysMenu[], level = 0) => {
    nodes.forEach(node => {
      const hasChildren = !!(node.children && node.children.length > 0)
      result.push({ ...node, level, hasChildren })
      if (hasChildren && isExpanded.value[node.menuId]) {
        traverse(node.children!, level + 1)
      }
    })
  }
  traverse(menuList.value)
  return result
})

// Helper for Select options (flattened with indentation)
const flattenedOptions = computed(() => {
  const result: any[] = []
  const traverse = (nodes: any[], prefix = '') => {
    for (const node of nodes) {
      result.push({ ...node, label: prefix + node.menuName })
      if (node.children) {
        traverse(node.children, prefix + '-- ')
      }
    }
  }
  traverse(menuOptions.value)
  return result
})

// Actions
function toggleExpand(menuId: string) {
  isExpanded.value[menuId] = !isExpanded.value[menuId]
}

function handleQuery() {
  getList()
}

function resetQuery() {
  queryParams.menuName = ''
  queryParams.status = undefined
  handleQuery()
}

async function handleAdd(parentId?: string) {
  resetForm()
  isEdit.value = false
  form.parentId = parentId
  await getMenuTree()
  showDialog.value = true
}

async function handleUpdate(row: SysMenu) {
  resetForm()
  isEdit.value = true
  await getMenuTree()
  // Mock fetch detail, in real app call API
  Object.assign(form, row)
  showDialog.value = true
}

async function handleDelete(row: SysMenu) {
  if (confirm('确认要删除菜单"' + row.menuName + '"吗？')) {
    await delMenu(row.menuId)
    toast({ title: "删除成功", description: "菜单已删除" })
    getList()
  }
}

async function handleSubmit() {
  if (!form.menuName) {
    toast({ title: "验证失败", description: "菜单名称不能为空", variant: "destructive" })
    return
  }

  submitLoading.value = true
  try {
    if (form.menuId) {
      await updateMenu(form)
      toast({ title: "修改成功", description: "菜单信息已更新" })
    } else {
      await addMenu(form)
      toast({ title: "新增成功", description: "菜单已创建" })
    }
    showDialog.value = false
    getList()
  } finally {
    submitLoading.value = false
  }
}

function resetForm() {
  form.menuId = undefined
  form.parentId = undefined
  form.menuName = ''
  form.orderNum = 0
  form.path = ''
  form.component = ''
  form.isFrame = 1
  form.isCache = 0
  form.menuType = 'M'
  form.visible = '0'
  form.status = '0'
  form.perms = ''
  form.icon = ''
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
        <h2 class="text-2xl font-bold tracking-tight">菜单管理</h2>
        <p class="text-muted-foreground">
          管理系统菜单、路由及按钮权限
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button @click="handleAdd()">
          <Plus class="mr-2 h-4 w-4" />
          新增菜单
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-center bg-background/95 p-4 border rounded-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">菜单名称</span>
        <Input 
          v-model="queryParams.menuName" 
          placeholder="请输入菜单名称" 
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
            <TableHead>菜单名称</TableHead>
            <TableHead>图标</TableHead>
            <TableHead>排序</TableHead>
            <TableHead>权限标识</TableHead>
            <TableHead>组件路径</TableHead>
            <TableHead>状态</TableHead>
            <TableHead class="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in flattenMenus" :key="item.menuId">
            <TableCell>
               <div class="flex items-center" :style="{ paddingLeft: `${item.level * 24}px` }">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="h-6 w-6 mr-1 p-0 hover:bg-transparent" 
                  @click="toggleExpand(item.menuId)"
                  :class="{ 'invisible': !item.hasChildren }"
                >
                  <ChevronDown v-if="isExpanded[item.menuId]" class="h-4 w-4" />
                  <ChevronRight v-else class="h-4 w-4" />
                </Button>
                <span class="mr-2 font-medium">{{ item.menuName }}</span>
                <Badge :variant="item.menuType === 'M' ? 'default' : (item.menuType === 'C' ? 'secondary' : 'outline')">
                  {{ item.menuType === 'M' ? '目录' : (item.menuType === 'C' ? '菜单' : '按钮') }}
                </Badge>
              </div>
            </TableCell>
            <TableCell>{{ item.icon }}</TableCell>
            <TableCell>{{ item.orderNum }}</TableCell>
            <TableCell><Badge variant="outline" v-if="item.perms">{{ item.perms }}</Badge></TableCell>
            <TableCell class="max-w-[200px] truncate">{{ item.component }}</TableCell>
            <TableCell>
              <Badge :variant="item.status === '0' ? 'default' : 'destructive'">
                {{ item.status === '0' ? '正常' : '停用' }}
              </Badge>
            </TableCell>
            <TableCell class="text-right space-x-2">
              <Button variant="ghost" size="icon" @click="handleUpdate(item)">
                <Edit class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="handleAdd(item.menuId)" v-if="item.menuType !== 'F'">
                <Plus class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" class="text-destructive" @click="handleDelete(item)">
                <Trash2 class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow v-if="flattenMenus.length === 0">
            <TableCell colspan="7" class="text-center h-24 text-muted-foreground">
              暂无数据
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Add/Edit Dialog -->
    <Dialog v-model:open="showDialog">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ isEdit ? '修改菜单' : '新增菜单' }}</DialogTitle>
          <DialogDescription>
            请填写菜单信息
          </DialogDescription>
        </DialogHeader>
        
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="parentId">上级菜单</Label>
            <Select v-model="form.parentId">
              <SelectTrigger>
                <SelectValue placeholder="选择上级菜单" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="0">主类目</SelectItem>
                 <SelectItem v-for="menu in flattenedOptions" :key="menu.id" :value="menu.id">
                  {{ menu.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-2">
            <Label>菜单类型</Label>
            <RadioGroup v-model="form.menuType" class="flex items-center gap-4">
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="M" id="typeM" />
                <Label for="typeM">目录</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="C" id="typeC" />
                <Label for="typeC">菜单</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="F" id="typeF" />
                <Label for="typeF">按钮</Label>
              </div>
            </RadioGroup>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="menuName">菜单名称 *</Label>
              <Input id="menuName" v-model="form.menuName" placeholder="请输入菜单名称" />
            </div>
            <div class="grid gap-2">
              <Label for="orderNum">显示排序</Label>
              <Input id="orderNum" type="number" v-model="form.orderNum" />
            </div>
          </div>

          <div class="grid gap-2" v-if="form.menuType !== 'F'">
            <Label for="icon">菜单图标</Label>
            <Input id="icon" v-model="form.icon" placeholder="请输入图标名称" />
          </div>

          <div class="grid grid-cols-2 gap-4" v-if="form.menuType !== 'F'">
             <div class="grid gap-2">
              <Label for="path">路由地址</Label>
              <Input id="path" v-model="form.path" placeholder="请输入路由地址" />
            </div>
            <div class="grid gap-2" v-if="form.menuType === 'C'">
              <Label for="component">组件路径</Label>
              <Input id="component" v-model="form.component" placeholder="请输入组件路径" />
            </div>
          </div>

          <div class="grid gap-2" v-if="form.menuType !== 'M'">
            <Label for="perms">权限字符</Label>
            <Input id="perms" v-model="form.perms" placeholder="system:user:list" />
          </div>

          <div class="grid grid-cols-2 gap-4">
             <div class="grid gap-2">
              <Label for="visible">显示状态</Label>
              <Select v-model="form.visible">
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">显示</SelectItem>
                  <SelectItem value="1">隐藏</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-2">
              <Label for="status">菜单状态</Label>
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
  </div>
</template>
