import request from '@/utils/request'
import { type SysUser } from './types'

export function listUser(query: any) {
  return request({
    url: '/system/user',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function getUser(userId: string) {
  return request<{ data: SysUser; roleIds: string[] }>({
    url: `/system/user/${userId}`,
    method: 'get'
  }).then((res: any) => {
    const data = res.data || {}
    return { ...data, postIds: data.postIds ?? [] }
  })
}

export function addUser(data: any) {
  return request({
    url: '/system/user',
    method: 'post',
    data
  }).then((res: any) => res)
}

export function updateUser(data: any) {
  return request({
    url: `/system/user/${data.userId}`,
    method: 'put',
    data
  }).then((res: any) => res)
}

export function delUser(userIds: string[]) {
  // 批量删除时前端通常逐个调用，这里简单处理第一个
  return request({
    url: `/system/user/${userIds[0]}`,
    method: 'delete'
  }).then((res: any) => res)
}

export function changeUserStatus(userId: string, status: string) {
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: { userId, status }
  }).then((res: any) => res)
}

export function resetUserPwd(userId: string, password: string) {
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: { userId, password }
  }).then((res: any) => res)
}
