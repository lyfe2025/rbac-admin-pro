import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '首页', icon: 'dashboard' }
        },
        {
          path: 'user/profile',
          name: 'Profile',
          component: () => import('@/views/system/user/profile.vue'),
          meta: { title: '个人中心', icon: 'user' }
        },
        // System Module
        {
          path: 'system/user',
          name: 'User',
          component: () => import('@/views/system/user/index.vue'),
          meta: { title: '用户管理', icon: 'user' }
        },
        {
          path: 'system/role',
          name: 'Role',
          component: () => import('@/views/system/role/index.vue'),
          meta: { title: '角色管理', icon: 'shield' }
        },
        {
          path: 'system/menu',
          name: 'Menu',
          component: () => import('@/views/system/menu/index.vue'),
          meta: { title: '菜单管理', icon: 'menu' }
        },
        {
          path: 'system/dept',
          name: 'Dept',
          component: () => import('@/views/system/dept/index.vue'),
          meta: { title: '部门管理', icon: 'network' }
        },
        {
          path: 'system/post',
          name: 'Post',
          component: () => import('@/views/system/post/index.vue'),
          meta: { title: '岗位管理', icon: 'briefcase' }
        },
        {
          path: 'system/dict',
          name: 'Dict',
          component: () => import('@/views/system/dict/index.vue'),
          meta: { title: '字典管理', icon: 'book' }
        },
        {
          path: 'system/config',
          name: 'Config',
          component: () => import('@/views/system/config/index.vue'),
          meta: { title: '参数管理', icon: 'settings' }
        },
        {
          path: 'system/setting',
          name: 'Setting',
          component: () => import('@/views/system/setting/index.vue'),
          meta: { title: '系统设置', icon: 'settings-2', roles: ['admin'] }
        },
        {
          path: 'system/notice',
          name: 'Notice',
          component: () => import('@/views/system/notice/index.vue'),
          meta: { title: '通知公告', icon: 'bell' }
        },
        // Monitor Module
        {
          path: 'monitor/operlog',
          name: 'OperLog',
          component: () => import('@/views/monitor/operlog/index.vue'),
          meta: { title: '操作日志', icon: 'file-text', roles: ['admin'] }
        },
        {
          path: 'monitor/logininfor',
          name: 'LoginInfor',
          component: () => import('@/views/monitor/logininfor/index.vue'),
          meta: { title: '登录日志', icon: 'log-in', roles: ['admin'] }
        },
        {
          path: 'monitor/online',
          name: 'Online',
          component: () => import('@/views/monitor/online/index.vue'),
          meta: { title: '在线用户', icon: 'users', roles: ['admin'] }
        },
        {
          path: 'monitor/job',
          name: 'Job',
          component: () => import('@/views/monitor/job/index.vue'),
          meta: { title: '定时任务', icon: 'clock', roles: ['admin'] }
        },
        {
          path: 'monitor/server',
          name: 'Server',
          component: () => import('@/views/monitor/server/index.vue'),
          meta: { title: '服务监控', icon: 'server', roles: ['admin'] }
        },
        {
          path: 'monitor/cache',
          name: 'Cache',
          component: () => import('@/views/monitor/cache/index.vue'),
          meta: { title: '缓存监控', icon: 'database', roles: ['admin'] }
        },
        {
          path: 'monitor/druid',
          name: 'Druid',
          component: () => import('@/views/monitor/druid/index.vue'),
          meta: { title: '连接池监控', icon: 'activity', roles: ['admin'] }
        },
        // Tool Module
        {
          path: 'tool/gen',
          name: 'Gen',
          component: () => import('@/views/tool/gen/index.vue'),
          meta: { title: '代码生成', icon: 'code', roles: ['admin'] }
        },
        {
          path: 'tool/build',
          name: 'Build',
          component: () => import('@/views/tool/build/index.vue'),
          meta: { title: '表单构建', icon: 'layout', roles: ['admin'] }
        },
        {
          path: 'tool/swagger',
          name: 'Swagger',
          component: () => import('@/views/tool/swagger/index.vue'),
          meta: { title: '系统接口', icon: 'link', roles: ['admin'] }
        }
      ]
    },
    {
      path: '/403',
      name: 'Forbidden',
      component: () => import('@/views/error/403.vue'),
      meta: { title: '无权限' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/error/404.vue'),
      meta: { title: '未找到' }
    }
  ]
})

export default router
