import request from '@/utils/request'

export interface SysUserOnline {
  tokenId: string
  userName: string
  ipaddr: string
  loginLocation: string
  browser: string
  os: string
  loginTime: string
}

export function listOnline(query: any) {
  return request<{ data: { rows: SysUserOnline[]; total: number } }>({
    url: '/monitor/online/list',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function forceLogout(tokenId: string) {
  return request({
    url: `/monitor/online/${tokenId}`,
    method: 'delete'
  }).then((res: any) => res)
}
