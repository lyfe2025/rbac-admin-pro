import request from '@/utils/request'
import { type SysRole } from './types'

export function listRole(query: any) {
  return request<{ total: number; rows: SysRole[] }>({
    url: '/system/role',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function getRole(roleId: string) {
  return request<{ data: SysRole }>({
    url: `/system/role/${roleId}`,
    method: 'get'
  }).then((res: any) => res.data)
}

export function addRole(data: any) {
  return request({
    url: '/system/role',
    method: 'post',
    data
  }).then((res: any) => res)
}

export function updateRole(data: any) {
  return request({
    url: `/system/role/${data.roleId}`,
    method: 'put',
    data
  }).then((res: any) => res)
}

export function delRole(roleIds: string[]) {
  return request({
    url: `/system/role/${roleIds[0]}`,
    method: 'delete'
  }).then((res: any) => res)
}

export function changeRoleStatus(roleId: string, status: string) {
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: { roleId, status }
  }).then((res: any) => res)
}
