import request from '@/utils/request'
import { type SysMenu } from './types'

export function listMenu(query?: any) {
  return request<{ data: SysMenu[] }>({
    url: '/system/menu',
    method: 'get',
    params: query
  }).then((res: any) => res)
}

export function getMenu(menuId: string) {
  return request<{ data: SysMenu }>({
    url: `/system/menu/${menuId}`,
    method: 'get'
  }).then((res: any) => res)
}

export function addMenu(data: any) {
  return request({
    url: '/system/menu',
    method: 'post',
    data
  }).then((res: any) => res)
}

export function updateMenu(data: any) {
  return request({
    url: `/system/menu/${data.menuId}`,
    method: 'put',
    data
  }).then((res: any) => res)
}

export function delMenu(menuId: string) {
  return request({
    url: `/system/menu/${menuId}`,
    method: 'delete'
  }).then((res: any) => res)
}

export function treeselect() {
  return request<{ data: SysMenu[] }>({
    url: '/system/menu/treeselect',
    method: 'get'
  }).then((res: any) => res)
}

export function roleMenuTreeselect(roleId: string) {
  return request({
    url: `/system/menu/roleMenuTreeselect/${roleId}`,
    method: 'get'
  }).then((res: any) => res)
}
