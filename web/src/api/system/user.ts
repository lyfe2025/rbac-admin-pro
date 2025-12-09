import request from '@/utils/request'
import { type SysUser, type UserQuery, type PageResult } from './types'

/** 用户创建/更新参数 */
export interface UserForm {
  userId?: string
  deptId?: string | number | null
  userName?: string
  nickName?: string
  password?: string
  phonenumber?: string
  email?: string
  sex?: string
  status?: string
  roleIds?: string[]
  postIds?: string[]
  remark?: string
}

export function listUser(query: UserQuery) {
  return request<{ data: PageResult<SysUser> }>({
    url: '/system/user',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function getUser(userId: string) {
  return request<{ data: { user: SysUser; roleIds: string[]; postIds: string[]; roles?: any[]; posts?: any[] } }>({
    url: `/system/user/${userId}`,
    method: 'get'
  }).then((res: any) => res.data)
}

export function addUser(data: UserForm) {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

export function updateUser(data: UserForm) {
  return request({
    url: `/system/user/${data.userId}`,
    method: 'put',
    data
  })
}

export function delUser(userIds: string[]) {
  return request({
    url: `/system/user/${userIds[0]}`,
    method: 'delete'
  })
}

export function changeUserStatus(userId: string, status: string) {
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: { userId, status }
  })
}

export function resetUserPwd(userId: string, password: string) {
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: { userId, password }
  })
}

export function updateProfile(data: {
  nickName?: string
  email?: string
  phonenumber?: string
  sex?: string
  avatar?: string
}) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data
  })
}

export function updatePassword(oldPassword: string, newPassword: string) {
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    data: { oldPassword, newPassword }
  })
}
