import { type SysRole } from './types'

const roleList: SysRole[] = [
  {
    roleId: '1',
    roleName: '超级管理员',
    roleKey: 'admin',
    roleSort: 1,
    dataScope: '1',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    status: '0',
    delFlag: '0',
    createTime: '2023-01-01 00:00:00',
    remark: '超级管理员'
  },
  {
    roleId: '2',
    roleName: '普通角色',
    roleKey: 'common',
    roleSort: 2,
    dataScope: '2',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    status: '0',
    delFlag: '0',
    createTime: '2023-01-01 00:00:00',
    remark: '普通角色'
  }
]

export function listRole(query: any) {
  return new Promise<{ rows: SysRole[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = roleList
      if (query.roleName) {
        list = list.filter(item => item.roleName.includes(query.roleName))
      }
      if (query.roleKey) {
        list = list.filter(item => item.roleKey.includes(query.roleKey))
      }
      if (query.status) {
        list = list.filter(item => item.status === query.status)
      }
      resolve({
        rows: list,
        total: list.length
      })
    }, 300)
  })
}

export function getRole(roleId: string) {
  return new Promise<{ data: SysRole }>((resolve) => {
    setTimeout(() => {
      const role = roleList.find(item => item.roleId === roleId)
      resolve({ data: role as SysRole })
    }, 100)
  })
}

export function addRole(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function updateRole(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function delRole(roleIds: string[]) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function changeRoleStatus(roleId: string, status: string) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}
