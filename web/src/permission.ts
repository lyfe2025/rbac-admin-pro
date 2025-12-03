import router from './router'
import { useUserStore } from './stores/modules/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  
  const userStore = useUserStore()
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = userStore.roles && userStore.roles.length > 0
      if (hasRoles) {
        const requiredRoles = (to.meta && (to.meta as any).roles) as string[] | undefined
        if (requiredRoles && !requiredRoles.some(r => userStore.roles.includes(r))) {
          next('/403')
          NProgress.done()
          return
        }
        const requiredPerms = (to.meta && (to.meta as any).perms) as string[] | undefined
        if (requiredPerms && !requiredPerms.some(p => userStore.permissions.includes(p) || userStore.permissions.includes('*:*:*'))) {
          next('/403')
          NProgress.done()
          return
        }
        next()
      } else {
        try {
          // 获取用户信息
          await userStore.getInfo()
          // 这里后续需要添加生成动态路由的逻辑
          // const accessRoutes = await permissionStore.generateRoutes(userStore.roles)
          // accessRoutes.forEach(route => router.addRoute(route))
          // next({ ...to, replace: true })
          const requiredRoles = (to.meta && (to.meta as any).roles) as string[] | undefined
          if (requiredRoles && !requiredRoles.some(r => userStore.roles.includes(r))) {
            next('/403')
            NProgress.done()
            return
          }
          const requiredPerms = (to.meta && (to.meta as any).perms) as string[] | undefined
          if (requiredPerms && !requiredPerms.some(p => userStore.permissions.includes(p) || userStore.permissions.includes('*:*:*'))) {
            next('/403')
            NProgress.done()
            return
          }
          next()
        } catch (error) {
          await userStore.logout()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
