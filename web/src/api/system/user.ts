import { type SysUser } from './types'

// Mock data
const userList: SysUser[] = [
  {
    userId: '1',
    deptId: '103',
    userName: 'admin',
    nickName: '某某',
    userType: '00',
    email: 'ry@163.com',
    phonenumber: '15888888888',
    sex: '1',
    avatar: '',
    status: '0',
    delFlag: '0',
    loginIp: '127.0.0.1',
    loginDate: '2023-01-01 00:00:00',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '管理员',
    dept: {
      deptId: '103',
      deptName: '研发部门'
    } as any,
    roles: [
      { roleId: '1', roleName: '超级管理员', roleKey: 'admin' } as any
    ]
  },
  {
    userId: '2',
    deptId: '105',
    userName: 'ry',
    nickName: '某某',
    userType: '00',
    email: 'ry@qq.com',
    phonenumber: '15666666666',
    sex: '1',
    avatar: '',
    status: '0',
    delFlag: '0',
    loginIp: '127.0.0.1',
    loginDate: '2023-01-01 00:00:00',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '测试员',
    dept: {
      deptId: '105',
      deptName: '测试部门'
    } as any,
    roles: [
      { roleId: '2', roleName: '普通角色', roleKey: 'common' } as any
    ]
  }
]

export function listUser(query: any) {
  return new Promise<{ rows: SysUser[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = userList
      if (query.userName) {
        list = list.filter(item => item.userName.includes(query.userName))
      }
      if (query.phonenumber) {
        list = list.filter(item => item.phonenumber.includes(query.phonenumber))
      }
      if (query.status) {
        list = list.filter(item => item.status === query.status)
      }
      if (query.deptId) {
        // 模拟部门过滤，简单匹配
        list = list.filter(item => item.deptId === query.deptId)
      }
      resolve({
        rows: list,
        total: list.length
      })
    }, 300)
  })
}

export function getUser(userId: string) {
  return new Promise<{ data: SysUser; postIds: string[]; roleIds: string[] }>((resolve) => {
    setTimeout(() => {
      const user = userList.find(item => item.userId === userId)
      resolve({ 
        data: user as SysUser,
        postIds: ['1'], // Mock associated posts
        roleIds: user?.roles?.map(r => r.roleId) || []
      })
    }, 100)
  })
}

export function addUser(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function updateUser(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function delUser(userIds: string[]) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function changeUserStatus(userId: string, status: string) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function resetUserPwd(userId: string, password: string) {
    return new Promise<{ msg: string; code: number }>((resolve) => {
      setTimeout(() => {
        resolve({ msg: '操作成功', code: 200 })
      }, 300)
    })
  }
