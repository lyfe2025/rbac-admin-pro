import router from './router'
import { useUserStore } from './stores/modules/user'
import { useMenuStore } from './stores/modules/menu'
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
        // 已有角色信息,确保菜单已加载
        const menuStore = useMenuStore()
        if (menuStore.menuList.length === 0) {
          try {
            await menuStore.fetchMenus()
            // 路由已动态添加,需要重新导航
            next({ ...to, replace: true })
            return
          } catch (error) {
            console.error('加载菜单失败:', error)
          }
        }
        
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
          
          // 获取动态菜单
          const menuStore = useMenuStore()
          await menuStore.fetchMenus()
          
          // 路由已动态添加,需要重新导航
          next({ ...to, replace: true })
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
