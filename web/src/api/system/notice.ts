import request from '@/utils/request'
import { type SysNotice } from './types'
export type { SysNotice } from './types'

export function listNotice(query: any) {
  return request<{ data: { rows: SysNotice[]; total: number } }>({
    url: '/system/notice',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function getNotice(noticeId: string) {
  return request<{ data: { data: SysNotice } }>({
    url: `/system/notice/${noticeId}`,
    method: 'get'
  }).then((res: any) => res)
}

export function addNotice(data: any) {
  return request({
    url: '/system/notice',
    method: 'post',
    data
  }).then((res: any) => res)
}

export function updateNotice(data: any) {
  return request({
    url: `/system/notice/${data.noticeId}`,
    method: 'put',
    data
  }).then((res: any) => res)
}

export function delNotice(noticeIds: string[]) {
  return request({
    url: '/system/notice',
    method: 'delete',
    params: { ids: noticeIds.join(',') }
  }).then((res: any) => res)
}
