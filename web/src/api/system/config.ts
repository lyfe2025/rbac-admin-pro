import request from '@/utils/request'
import { type SysConfig } from './types'
export type { SysConfig } from './types'

export function listConfig(query: any) {
  return request<{ data: { rows: SysConfig[]; total: number } }>({
    url: '/system/config',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function getConfig(configId: string) {
  return request<{ data: { data: SysConfig } }>({
    url: `/system/config/${configId}`,
    method: 'get'
  }).then((res: any) => res)
}

export function addConfig(data: any) {
  return request({
    url: '/system/config',
    method: 'post',
    data
  }).then((res: any) => res)
}

export function updateConfig(data: any) {
  return request({
    url: `/system/config/${data.configId}`,
    method: 'put',
    data
  }).then((res: any) => res)
}

export function delConfig(configIds: string[]) {
  return request({
    url: '/system/config',
    method: 'delete',
    params: { ids: configIds.join(',') }
  }).then((res: any) => res)
}

export function refreshCache() {
  return request({
    url: '/system/config/refreshCache',
    method: 'get'
  }).then((res: any) => res)
}
