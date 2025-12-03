import { type SysMenu } from './types'

const menuList: SysMenu[] = [
  {
    menuId: '1',
    menuName: '系统管理',
    parentId: null,
    orderNum: 1,
    path: 'system',
    component: null as any,
    isFrame: 1,
    isCache: 0,
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'system',
    createTime: '2023-01-01 00:00:00',
    children: [
      {
        menuId: '100',
        menuName: '用户管理',
        parentId: '1',
        orderNum: 1,
        path: 'user',
        component: 'system/user/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:user:list',
        icon: 'user',
        createTime: '2023-01-01 00:00:00',
        children: [
          {
            menuId: '1001',
            menuName: '用户查询',
            parentId: '100',
            orderNum: 1,
            path: '',
            component: '',
            isFrame: 1,
            isCache: 0,
            menuType: 'F',
            visible: '0',
            status: '0',
            perms: 'system:user:query',
            icon: '',
            createTime: '2023-01-01 00:00:00'
          },
          {
            menuId: '1002',
            menuName: '用户新增',
            parentId: '100',
            orderNum: 2,
            path: '',
            component: '',
            isFrame: 1,
            isCache: 0,
            menuType: 'F',
            visible: '0',
            status: '0',
            perms: 'system:user:add',
            icon: '',
            createTime: '2023-01-01 00:00:00'
          },
          {
            menuId: '1003',
            menuName: '用户修改',
            parentId: '100',
            orderNum: 3,
            path: '',
            component: '',
            isFrame: 1,
            isCache: 0,
            menuType: 'F',
            visible: '0',
            status: '0',
            perms: 'system:user:edit',
            icon: '',
            createTime: '2023-01-01 00:00:00'
          },
          {
            menuId: '1004',
            menuName: '用户删除',
            parentId: '100',
            orderNum: 4,
            path: '',
            component: '',
            isFrame: 1,
            isCache: 0,
            menuType: 'F',
            visible: '0',
            status: '0',
            perms: 'system:user:remove',
            icon: '',
            createTime: '2023-01-01 00:00:00'
          }
        ]
      },
      {
        menuId: '101',
        menuName: '角色管理',
        parentId: '1',
        orderNum: 2,
        path: 'role',
        component: 'system/role/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:role:list',
        icon: 'peoples',
        createTime: '2023-01-01 00:00:00',
        children: [
          {
            menuId: '1011',
            menuName: '角色查询',
            parentId: '101',
            orderNum: 1,
            path: '',
            component: '',
            isFrame: 1,
            isCache: 0,
            menuType: 'F',
            visible: '0',
            status: '0',
            perms: 'system:role:query',
            icon: '',
            createTime: '2023-01-01 00:00:00'
          },
          {
            menuId: '1012',
            menuName: '角色新增',
            parentId: '101',
            orderNum: 2,
            path: '',
            component: '',
            isFrame: 1,
            isCache: 0,
            menuType: 'F',
            visible: '0',
            status: '0',
            perms: 'system:role:add',
            icon: '',
            createTime: '2023-01-01 00:00:00'
          },
          {
            menuId: '1013',
            menuName: '角色修改',
            parentId: '101',
            orderNum: 3,
            path: '',
            component: '',
            isFrame: 1,
            isCache: 0,
            menuType: 'F',
            visible: '0',
            status: '0',
            perms: 'system:role:edit',
            icon: '',
            createTime: '2023-01-01 00:00:00'
          },
          {
            menuId: '1014',
            menuName: '角色删除',
            parentId: '101',
            orderNum: 4,
            path: '',
            component: '',
            isFrame: 1,
            isCache: 0,
            menuType: 'F',
            visible: '0',
            status: '0',
            perms: 'system:role:remove',
            icon: '',
            createTime: '2023-01-01 00:00:00'
          }
        ]
      },
      {
        menuId: '102',
        menuName: '菜单管理',
        parentId: '1',
        orderNum: 3,
        path: 'menu',
        component: 'system/menu/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:menu:list',
        icon: 'tree-table',
        createTime: '2023-01-01 00:00:00'
      },
      {
        menuId: '103',
        menuName: '部门管理',
        parentId: '1',
        orderNum: 4,
        path: 'dept',
        component: 'system/dept/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:dept:list',
        icon: 'tree',
        createTime: '2023-01-01 00:00:00'
      },
      {
        menuId: '104',
        menuName: '岗位管理',
        parentId: '1',
        orderNum: 5,
        path: 'post',
        component: 'system/post/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:post:list',
        icon: 'post',
        createTime: '2023-01-01 00:00:00'
      },
      {
        menuId: '105',
        menuName: '字典管理',
        parentId: '1',
        orderNum: 6,
        path: 'dict',
        component: 'system/dict/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:dict:list',
        icon: 'edit',
         createTime: '2023-01-01 00:00:00'
       },
       {
         menuId: '107',
         menuName: '系统设置',
         parentId: '1',
         orderNum: 8,
         path: 'setting',
         component: 'system/setting/index',
         isFrame: 1,
         isCache: 0,
         menuType: 'C',
         visible: '0',
         status: '0',
         perms: 'system:setting:list',
         icon: 'settings-2',
         createTime: '2023-01-01 00:00:00'
       }
     ]
   },
  {
    menuId: '2',
    menuName: '系统监控',
    parentId: null,
    orderNum: 2,
    path: 'monitor',
    component: null as any,
    isFrame: 1,
    isCache: 0,
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'monitor',
    createTime: '2023-01-01 00:00:00',
    children: [
      {
        menuId: '109',
        menuName: '在线用户',
        parentId: '2',
        orderNum: 1,
        path: 'online',
        component: 'monitor/online/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:online:list',
        icon: 'users',
        createTime: '2023-01-01 00:00:00'
      },
      {
        menuId: '110',
        menuName: '定时任务',
        parentId: '2',
        orderNum: 2,
        path: 'job',
        component: 'monitor/job/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:job:list',
        icon: 'clock',
        createTime: '2023-01-01 00:00:00'
      },
      {
        menuId: '111',
        menuName: '服务监控',
        parentId: '2',
        orderNum: 3,
        path: 'server',
        component: 'monitor/server/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:server:list',
        icon: 'server',
        createTime: '2023-01-01 00:00:00'
      },
      {
        menuId: '112',
        menuName: '缓存监控',
        parentId: '2',
        orderNum: 4,
        path: 'cache',
        component: 'monitor/cache/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:cache:list',
        icon: 'database',
        createTime: '2023-01-01 00:00:00'
      },
      {
        menuId: '113',
        menuName: '连接池监控',
        parentId: '2',
        orderNum: 5,
        path: 'druid',
        component: 'monitor/druid/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:druid:list',
        icon: 'activity',
        createTime: '2023-01-01 00:00:00'
      },
      {
        menuId: '114',
        menuName: '操作日志',
        parentId: '2',
        orderNum: 6,
        path: 'operlog',
        component: 'monitor/operlog/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:operlog:list',
        icon: 'file-text',
        createTime: '2023-01-01 00:00:00'
      },
      {
        menuId: '115',
        menuName: '登录日志',
        parentId: '2',
        orderNum: 7,
        path: 'logininfor',
        component: 'monitor/logininfor/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:logininfor:list',
        icon: 'log-in',
        createTime: '2023-01-01 00:00:00'
      }
    ]
  },
  {
    menuId: '3',
    menuName: '系统工具',
    parentId: null,
    orderNum: 3,
    path: 'tool',
    component: null as any,
    isFrame: 1,
    isCache: 0,
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'pen-tool',
    createTime: '2023-01-01 00:00:00',
    children: [
      {
        menuId: '116',
        menuName: '表单构建',
        parentId: '3',
        orderNum: 1,
        path: 'build',
        component: 'tool/build/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'tool:build:list',
        icon: 'layout',
        createTime: '2023-01-01 00:00:00'
      },
      {
        menuId: '117',
        menuName: '代码生成',
        parentId: '3',
        orderNum: 2,
        path: 'gen',
        component: 'tool/gen/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'tool:gen:list',
        icon: 'code',
        createTime: '2023-01-01 00:00:00'
      },
      {
        menuId: '118',
        menuName: '系统接口',
        parentId: '3',
        orderNum: 3,
        path: 'swagger',
        component: 'tool/swagger/index',
        isFrame: 1,
        isCache: 0,
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'tool:swagger:list',
        icon: 'link',
        createTime: '2023-01-01 00:00:00'
      }
    ]
  }
]

export function listMenu(query: any) {
  return new Promise<{ data: SysMenu[] }>((resolve) => {
    setTimeout(() => {
      // 这里简化，直接返回树结构，实际后端可能返回列表
      resolve({ data: menuList })
    }, 300)
  })
}

export function getMenu(menuId: string) {
  return new Promise<{ data: SysMenu }>((resolve) => {
    setTimeout(() => {
      // Mock implementation - finding in tree is complex, assuming success
      resolve({ 
        data: { 
          menuId, 
          menuName: 'Test Menu', 
          menuType: 'C' 
        } as SysMenu 
      })
    }, 100)
  })
}

export function addMenu(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function updateMenu(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function delMenu(menuId: string) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}
