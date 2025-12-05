import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRouters } from '@/api/login'
import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'

export interface MenuItem {
  name: string
  path: string
  hidden: boolean
  redirect?: string
  component: string
  alwaysShow?: boolean
  meta: {
    title: string
    icon: string
    noCache: boolean
    link: string | null
  }
  children?: MenuItem[]
}

// 匹配 views 里面所有的 .vue 文件
const modules = import.meta.glob('../../views/**/*.vue')

// 加载视图组件
function loadView(view: string) {
  let res
  for (const path in modules) {
    const parts = path.split('views/')
    if (parts.length < 2) continue
    const part = parts[1]
    if (!part) continue
    const dir = part.split('.vue')[0]
    if (dir === view) {
      res = modules[path]
    }
  }
  return res
}

// 转换菜单为路由
function filterAsyncRouter(asyncRouterMap: MenuItem[]): RouteRecordRaw[] {
  return asyncRouterMap.map(route => {
    const routeRecord: any = {
      path: route.path,
      name: route.name,
      meta: route.meta,
    }

    // 处理 redirect
    if (route.redirect) {
      routeRecord.redirect = route.redirect
    }

    // 处理组件
    if (route.component) {
      if (route.component === 'Layout') {
        routeRecord.component = () => import('@/layout/index.vue')
      } else {
        routeRecord.component = loadView(route.component)
      }
    }

    // 处理子路由
    if (route.children && route.children.length) {
      routeRecord.children = filterAsyncRouter(route.children)
    }

    return routeRecord as RouteRecordRaw
  })
}

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref<MenuItem[]>([])
  const loading = ref(false)
  const routesAdded = ref(false)

  // 获取菜单数据并注册路由
  async function fetchMenus() {
    if (menuList.value.length > 0 && routesAdded.value) {
      return menuList.value
    }
    
    loading.value = true
    try {
      const res = await getRouters()
      menuList.value = res.data || []
      
      // 动态注册路由
      if (menuList.value.length > 0 && !routesAdded.value) {
        const accessRoutes = filterAsyncRouter(menuList.value)
        accessRoutes.forEach(route => {
          router.addRoute(route)
        })
        routesAdded.value = true
      }
      
      return menuList.value
    } catch (error) {
      console.error('获取菜单失败:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // 清空菜单
  function clearMenus() {
    menuList.value = []
    routesAdded.value = false
  }

  return {
    menuList,
    loading,
    routesAdded,
    fetchMenus,
    clearMenus
  }
})
