<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore, type MenuItem } from '@/stores/modules/menu'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Settings,
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
  Settings2,
} from 'lucide-vue-next'

const route = useRoute()
const menuStore = useMenuStore()

const menuList = computed(() => menuStore.menuList)

const isActive = (path: string) => route.path === path

// 图标映射
const iconMap: Record<string, any> = {
  settings: Settings,
  monitor: Monitor,
  tool: PenTool,
  user: User,
  users: Users,
  shield: Shield,
  menu: Menu,
  network: Network,
  briefcase: Briefcase,
  'book-a': Book,
  book: Book,
  bell: Bell,
  megaphone: Bell,
  'file-text': FileText,
  list: FileText,
  'log-in': LogIn,
  server: Server,
  database: Database,
  'database-backup': Database,
  activity: Activity,
  code: Code,
  'code-xml': Code,
  layout: LayoutIcon,
  link: Link,
  clock: Clock,
  'alarm-clock': Clock,
  'settings-2': Settings2,
  'sliders-vertical': Settings2,
  'user-check': Users,
  'badge-check': Briefcase,
  'building-2': Network,
  factory: LayoutIcon,
}

// 获取图标组件
function getIcon(iconName: string) {
  return iconMap[iconName] || Settings
}
</script>

<template>
  <Accordion type="single" collapsible class="w-full" default-value="item-0">
    <AccordionItem 
      v-for="(item, index) in menuList" 
      :key="item.path" 
      :value="`item-${index}`" 
      class="border-b-0"
    >
      <AccordionTrigger class="py-2 hover:no-underline hover:text-primary text-muted-foreground px-3 rounded-lg hover:bg-muted/50">
        <div class="flex items-center gap-3">
          <component :is="getIcon(item.meta.icon)" class="h-4 w-4" />
          {{ item.meta.title }}
        </div>
      </AccordionTrigger>
      <AccordionContent class="pb-0 pl-4 space-y-1 mt-1">
        <router-link 
          v-for="child in item.children" 
          :key="child.path"
          :to="child.path.startsWith('/') ? child.path : `${item.path}/${child.path}`" 
          :class="cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary', 
            isActive(child.path.startsWith('/') ? child.path : `${item.path}/${child.path}`) ? 'bg-muted text-primary' : 'text-muted-foreground'
          )"
        >
          <component :is="getIcon(child.meta.icon)" class="h-4 w-4" />
          {{ child.meta.title }}
        </router-link>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
