<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import ThemeCustomizer from '@/components/ThemeCustomizer.vue'
import ProfileDialog from '@/components/ProfileDialog.vue'
import SettingsDialog from '@/components/SettingsDialog.vue'
import { useUserStore } from '@/stores/modules/user'
import { useToast } from '@/components/ui/toast/use-toast'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Settings, 
  Settings2,
  Monitor, 
  PenTool,
  User,
  Shield,
  Menu,
  Network,
  Briefcase,
  Book,
  Bell,
  FileText,
  LogIn,
  Users,
  Server,
  Database,
  Activity,
  Code,
  Layout as LayoutIcon,
  Link,
  Clock,
  PanelLeft,
  Package2,
  Home,
  LogOut,
  ChevronsUpDown
} from 'lucide-vue-next'
import UserMenuButton from '@/components/UserMenuButton.vue'
import DynamicMenu from '@/components/DynamicMenu.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { toast } = useToast()
const isCollapsed = ref(false)

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

const isActive = (path: string) => route.path === path

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

// 退出登录确认对话框
const showLogoutDialog = ref(false)
const handleLogoutClick = () => {
  showLogoutDialog.value = true
}
const confirmLogout = async () => {
  await userStore.logout()
  toast({
    title: "退出成功",
    description: "您已安全退出系统",
  })
  router.push('/login')
}

// 个人中心 - 打开个人资料对话框
const showProfile = ref(false)
const handleProfile = async () => {
  showProfile.value = true
}

// 打开设置
const showSettings = ref(false)
const handleSettings = () => {
  showSettings.value = true
}

// 打开编辑用户对话框
const handleOpenEditDialog = (userId: string) => {
  showProfile.value = false
  router.push(`/system/user?edit=${userId}`)
}
</script>

<template>
  <div class="flex min-h-screen w-full flex-col bg-muted/40">
    <!-- Desktop Sidebar -->
    <aside :class="cn('fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-all duration-300', isCollapsed ? 'w-14' : 'w-64')">
      <nav class="flex flex-col gap-4 px-2 sm:py-5">
        <div :class="cn('flex items-center px-2', isCollapsed ? 'justify-center' : 'gap-2')">
           <router-link
            to="/"
            class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
            <span class="sr-only">RBAC Admin</span>
          </router-link>
          <span v-if="!isCollapsed" class="font-semibold text-lg">RBAC Admin</span>
        </div>

        <TooltipProvider>
          <div v-if="!isCollapsed" class="space-y-1">
            <Tooltip :delay-duration="0">
              <TooltipTrigger as-child>
                <router-link
                  to="/dashboard"
                  :class="cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary',
                    isActive('/dashboard') ? 'bg-muted text-primary' : 'text-muted-foreground',
                    isCollapsed ? 'justify-center h-9 w-9 p-0' : ''
                  )"
                >
                  <LayoutDashboard class="h-4 w-4" />
                  <span v-if="!isCollapsed">仪表盘</span>
                  <span v-else class="sr-only">仪表盘</span>
                </router-link>
              </TooltipTrigger>
              <TooltipContent side="right" v-if="isCollapsed">仪表盘</TooltipContent>
            </Tooltip>

            <!-- 动态菜单 -->
            <DynamicMenu />
          </div>
          <!-- Collapsed Icons for Modules (Simplified) -->
          <div v-else class="flex flex-col gap-4 items-center">
             <Tooltip :delay-duration="0">
              <TooltipTrigger as-child>
                <div class="h-9 w-9 flex items-center justify-center text-muted-foreground">
                  <Settings class="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">系统管理 (展开查看更多)</TooltipContent>
            </Tooltip>
             <Tooltip :delay-duration="0">
              <TooltipTrigger as-child>
                <div class="h-9 w-9 flex items-center justify-center text-muted-foreground">
                  <Monitor class="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">系统监控 (展开查看更多)</TooltipContent>
            </Tooltip>
             <Tooltip :delay-duration="0">
              <TooltipTrigger as-child>
                <div class="h-9 w-9 flex items-center justify-center text-muted-foreground">
                  <PenTool class="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">系统工具 (展开查看更多)</TooltipContent>
            </Tooltip>
          </div>

        </TooltipProvider>
      </nav>
      
      <!-- User Profile & Footer -->
      <div class="mt-auto p-4">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" :class="cn('flex items-center gap-2 w-full h-auto py-2', isCollapsed ? 'justify-center px-0' : 'justify-between px-2')">
              <div class="flex items-center gap-2 overflow-hidden">
                <Avatar class="h-8 w-8 rounded-lg">
                  <AvatarImage :src="getAvatarUrl(userStore.avatar)" :alt="userStore.name" />
                  <AvatarFallback class="rounded-lg">{{ userStore.name ? userStore.name.slice(0, 2).toUpperCase() : 'AD' }}</AvatarFallback>
                </Avatar>
                <div v-if="!isCollapsed" class="flex flex-col items-start text-left text-sm leading-tight overflow-hidden">
                  <span class="font-semibold truncate w-full">{{ userStore.name || 'Admin' }}</span>
                  <span class="text-xs text-muted-foreground truncate w-full">{{ userStore.email || '暂无邮箱' }}</span>
                </div>
              </div>
              <ChevronsUpDown v-if="!isCollapsed" class="ml-auto h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom" align="end" :side-offset="4">
            <DropdownMenuLabel class="p-0 font-normal">
              <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar class="h-8 w-8 rounded-lg">
                  <AvatarImage :src="getAvatarUrl(userStore.avatar)" :alt="userStore.name" />
                  <AvatarFallback class="rounded-lg">{{ userStore.name ? userStore.name.slice(0, 2).toUpperCase() : 'AD' }}</AvatarFallback>
                </Avatar>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">{{ userStore.name || 'Admin' }}</span>
                  <span class="truncate text-xs text-muted-foreground">{{ userStore.email || '暂无邮箱' }}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="handleProfile">
              <User class="mr-2 h-4 w-4" />
              个人中心
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleLogoutClick">
              <LogOut class="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>

    <!-- Main Content -->
    <div :class="cn('flex flex-col sm:py-4 transition-all duration-300', isCollapsed ? 'sm:pl-14' : 'sm:pl-64')">
       <header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <!-- Mobile Toggle -->
          <Sheet>
            <SheetTrigger as-child>
              <Button size="icon" variant="outline" class="sm:hidden">
                <PanelLeft class="h-5 w-5" />
                <span class="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" class="w-64">
               <nav class="flex flex-col gap-4 px-2 mt-5">
                <div class="flex items-center gap-2 px-2 mb-2">
                   <router-link
                    to="/"
                    class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground"
                  >
                    <Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
                    <span class="sr-only">RBAC Admin</span>
                  </router-link>
                  <span class="font-semibold text-lg">RBAC Admin</span>
                </div>

                <div class="space-y-1">
                  <router-link
                    to="/dashboard"
                    :class="cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary',
                      isActive('/dashboard') ? 'bg-muted text-primary' : 'text-muted-foreground'
                    )"
                  >
                    <LayoutDashboard class="h-4 w-4" />
                    <span>仪表盘</span>
                  </router-link>

                  <Accordion type="single" collapsible class="w-full" default-value="system">
                  <AccordionItem value="system" class="border-b-0">
                    <AccordionTrigger class="py-2 hover:no-underline hover:text-primary text-muted-foreground px-3 rounded-lg hover:bg-muted/50">
                      <div class="flex items-center gap-3">
                        <Settings class="h-4 w-4" />
                        系统管理
                      </div>
                    </AccordionTrigger>
                    <AccordionContent class="pb-0 pl-4 space-y-1 mt-1">
                      <router-link to="/system/user" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/system/user') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <User class="h-4 w-4" /> 用户管理
                      </router-link>
                      <router-link to="/system/role" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/system/role') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Shield class="h-4 w-4" /> 角色管理
                      </router-link>
                      <router-link to="/system/menu" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/system/menu') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Menu class="h-4 w-4" /> 菜单管理
                      </router-link>
                      <router-link to="/system/dept" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/system/dept') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Network class="h-4 w-4" /> 部门管理
                      </router-link>
                      <router-link to="/system/post" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/system/post') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Briefcase class="h-4 w-4" /> 岗位管理
                      </router-link>
                      <router-link to="/system/dict" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/system/dict') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Book class="h-4 w-4" /> 字典管理
                      </router-link>
                      <router-link to="/system/config" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/system/config') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Settings class="h-4 w-4" /> 参数管理
                      </router-link>
                      <router-link to="/system/setting" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/system/setting') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Settings2 class="h-4 w-4" /> 系统设置
                      </router-link>
                      <router-link to="/system/notice" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/system/notice') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Bell class="h-4 w-4" /> 通知公告
                      </router-link>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="monitor" class="border-b-0">
                    <AccordionTrigger class="py-2 hover:no-underline hover:text-primary text-muted-foreground px-3 rounded-lg hover:bg-muted/50">
                      <div class="flex items-center gap-3">
                        <Monitor class="h-4 w-4" />
                        系统监控
                      </div>
                    </AccordionTrigger>
                    <AccordionContent class="pb-0 pl-4 space-y-1 mt-1">
                      <router-link to="/monitor/online" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/monitor/online') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Users class="h-4 w-4" /> 在线用户
                      </router-link>
                      <router-link to="/monitor/job" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/monitor/job') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Clock class="h-4 w-4" /> 定时任务
                      </router-link>
                      <router-link to="/monitor/server" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/monitor/server') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Server class="h-4 w-4" /> 服务监控
                      </router-link>
                      <router-link to="/monitor/cache" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/monitor/cache') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Database class="h-4 w-4" /> 缓存监控
                      </router-link>
                      <router-link to="/monitor/druid" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/monitor/druid') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Activity class="h-4 w-4" /> 连接池监控
                      </router-link>
                      <router-link to="/monitor/operlog" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/monitor/operlog') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <FileText class="h-4 w-4" /> 操作日志
                      </router-link>
                      <router-link to="/monitor/logininfor" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/monitor/logininfor') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <LogIn class="h-4 w-4" /> 登录日志
                      </router-link>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="tool" class="border-b-0">
                    <AccordionTrigger class="py-2 hover:no-underline hover:text-primary text-muted-foreground px-3 rounded-lg hover:bg-muted/50">
                      <div class="flex items-center gap-3">
                        <PenTool class="h-4 w-4" />
                        系统工具
                      </div>
                    </AccordionTrigger>
                    <AccordionContent class="pb-0 pl-4 space-y-1 mt-1">
                      <router-link to="/tool/build" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/tool/build') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <LayoutIcon class="h-4 w-4" /> 表单构建
                      </router-link>
                      <router-link to="/tool/gen" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/tool/gen') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Code class="h-4 w-4" /> 代码生成
                      </router-link>
                      <router-link to="/tool/swagger" :class="cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', isActive('/tool/swagger') ? 'bg-muted text-primary' : 'text-muted-foreground')">
                        <Link class="h-4 w-4" /> 系统接口
                      </router-link>
                    </AccordionContent>
                  </AccordionItem>
                  </Accordion>
                </div>

              </nav>
            </SheetContent>
          </Sheet>

          <!-- Desktop Collapse Toggle -->
          <Button size="icon" variant="outline" class="hidden sm:flex" @click="toggleSidebar">
             <PanelLeft class="h-5 w-5" />
             <span class="sr-only">Toggle Sidebar</span>
          </Button>

          <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div class="ml-auto flex-1 sm:flex-initial">
            </div>
            <ThemeCustomizer />
            <ThemeToggle />
            <UserMenuButton />
          </div>
       </header>
       <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
         <RouterView />
       </main>
    </div>

    <!-- 个人资料对话框 -->
    <ProfileDialog 
      v-model:open="showProfile" 
      @open-settings="showSettings = true"
      @open-edit-dialog="handleOpenEditDialog"
    />

    <!-- 设置对话框 -->
    <SettingsDialog v-model:open="showSettings" />

    <!-- 退出登录确认对话框 -->
    <AlertDialog :open="showLogoutDialog" @update:open="showLogoutDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认退出</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要退出登录吗？退出后需要重新登录才能访问系统。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmLogout">确认退出</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
