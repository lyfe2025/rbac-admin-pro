import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([])
  const addRoutes = ref<RouteRecordRaw[]>([])

  function setRoutes(newRoutes: RouteRecordRaw[]) {
    addRoutes.value = newRoutes
    routes.value = router.options.routes.concat(newRoutes)
  }

  function generateRoutes(roles: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve) => {
      // Mock: 在真实后端中，这里会调用 getRouters() 接口
      // const res = await getRouters()
      // const accessedRoutes = filterAsyncRouter(res.data)
      
      // 目前我们没有动态路由，所以直接返回空数组，或者如果想模拟，可以手动构造一些
      const accessedRoutes: RouteRecordRaw[] = []
      setRoutes(accessedRoutes)
      resolve(accessedRoutes)
    })
  }

  return {
    routes,
    addRoutes,
    generateRoutes
  }
})

// 遍历后台传来的路由字符串，转换为组件对象
export function filterAsyncRouter(asyncRouterMap: any[], lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout Component Special Treatment
      if (route.component === 'Layout') {
        route.component = () => import('@/layout/index.vue')
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap: any[], lastRouter: any = false) {
  var children: any[] = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach((c: any) => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view: string) => {
  let res
  for (const path in modules) {
    const parts = path.split('views/')
    if (parts.length < 2) continue
    const part = parts[1]
    if (!part) continue
    const dir = part.split('.vue')[0]
    if (dir === view) {
      // @ts-ignore
      res = modules[path]
    }
  }
  return res
}
