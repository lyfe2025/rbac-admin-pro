import { type SysLoginLog } from '@/api/system/types'

const loginLogList: SysLoginLog[] = [
  {
    infoId: '1',
    userName: 'admin',
    ipaddr: '127.0.0.1',
    loginLocation: '内网IP',
    browser: 'Chrome 120',
    os: 'Windows 10',
    status: '0',
    msg: '登录成功',
    loginTime: '2023-01-01 10:00:00'
  },
  {
    infoId: '2',
    userName: 'ry',
    ipaddr: '127.0.0.1',
    loginLocation: '内网IP',
    browser: 'Chrome 120',
    os: 'Windows 10',
    status: '1',
    msg: '密码错误',
    loginTime: '2023-01-01 11:00:00'
  }
]

export function listLogininfor(query: any) {
  return new Promise<{ rows: SysLoginLog[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = loginLogList
      if (query.userName) {
        list = list.filter(item => item.userName.includes(query.userName))
      }
      if (query.status) {
        list = list.filter(item => item.status === query.status)
      }
      resolve({
        rows: list,
        total: list.length
      })
    }, 300)
  })
}

export function delLogininfor(infoIds: string[]) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function cleanLogininfor() {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}
