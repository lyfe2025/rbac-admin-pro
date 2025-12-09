import request from '@/utils/request'
import { type SysDept } from './types'

export function listDept(query?: any) {
  return request<{ data: SysDept[] }>({
    url: '/system/dept',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function getDept(deptId: string) {
  return request<{ data: SysDept }>({
    url: `/system/dept/${deptId}`,
    method: 'get'
  }).then((res: any) => res.data)
}

export function addDept(data: any) {
  return request({
    url: '/system/dept',
    method: 'post',
    data
  }).then((res: any) => res)
}

export function updateDept(data: any) {
  return request({
    url: `/system/dept/${data.deptId}`,
    method: 'put',
    data
  }).then((res: any) => res)
}

export function delDept(deptId: string) {
  return request({
    url: `/system/dept/${deptId}`,
    method: 'delete'
  }).then((res: any) => res)
}

export function listDeptExcludeChild(deptId: string) {
  return request<{ data: SysDept[] }>({
    url: `/system/dept/list/exclude/${deptId}`,
    method: 'get'
  }).then((res: any) => res.data)
}

export function listDeptTree() {
  // 兼容旧前端用法，直接返回树形结构数据
  return request<{ data: SysDept[] }>({
    url: '/system/dept',
    method: 'get'
  }).then((res: any) => res.data)
}
