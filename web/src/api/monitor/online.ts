import { type SysUser } from '@/api/system/types'

// Reuse SysUser but simplified for online display
export interface SysUserOnline {
  tokenId: string
  userName: string
  ipaddr: string
  loginLocation: string
  browser: string
  os: string
  loginTime: string
}

const onlineList: SysUserOnline[] = [
  {
    tokenId: 'uuid-1',
    userName: 'admin',
    ipaddr: '127.0.0.1',
    loginLocation: '内网IP',
    browser: 'Chrome 120',
    os: 'Windows 10',
    loginTime: '2023-01-01 10:00:00'
  },
  {
    tokenId: 'uuid-2',
    userName: 'ry',
    ipaddr: '127.0.0.1',
    loginLocation: '内网IP',
    browser: 'Chrome 120',
    os: 'Windows 10',
    loginTime: '2023-01-01 11:00:00'
  }
]

export function listOnline(query: any) {
  return new Promise<{ rows: SysUserOnline[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = onlineList
      if (query.userName) {
        list = list.filter(item => item.userName.includes(query.userName))
      }
      if (query.ipaddr) {
        list = list.filter(item => item.ipaddr.includes(query.ipaddr))
      }
      resolve({
        rows: list,
        total: list.length
      })
    }, 300)
  })
}

export function forceLogout(tokenId: string) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}
