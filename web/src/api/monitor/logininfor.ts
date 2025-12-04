import request from '@/utils/request'
import { type SysLoginLog } from '@/api/system/types'

export function listLogininfor(query: any) {
  return request<{ data: { total: number; rows: SysLoginLog[] } }>({
    url: '/monitor/logininfor',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function delLogininfor(infoIds: string[]) {
  return request({
    url: '/monitor/logininfor',
    method: 'delete',
    params: { ids: infoIds.join(',') }
  }).then((res: any) => res)
}

export function cleanLogininfor() {
  return request({
    url: '/monitor/logininfor/clean',
    method: 'get'
  }).then((res: any) => res)
}
