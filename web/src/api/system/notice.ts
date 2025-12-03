import { type BaseEntity } from '../system/types'

export interface SysNotice extends BaseEntity {
  noticeId: number
  noticeTitle: string
  noticeType: string
  noticeContent: string
  status: string
}

const noticeList: SysNotice[] = [
  {
    noticeId: 1,
    noticeTitle: '温馨提醒：2023-01-01 某某新版本发布啦',
    noticeType: '2', // 公告
    noticeContent: '新版本发布啦',
    status: '0',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00'
  },
  {
    noticeId: 2,
    noticeTitle: '维护通知：2023-01-01 系统凌晨维护',
    noticeType: '1', // 通知
    noticeContent: '维护通知',
    status: '0',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00'
  }
]

export function listNotice(query: any) {
  return new Promise<{ rows: SysNotice[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = noticeList
      if (query.noticeTitle) {
        list = list.filter(item => item.noticeTitle.includes(query.noticeTitle))
      }
      if (query.noticeType) {
        list = list.filter(item => item.noticeType === query.noticeType)
      }
      if (query.createBy) {
        list = list.filter(item => item.createBy && item.createBy.includes(query.createBy))
      }
      resolve({
        rows: list,
        total: list.length
      })
    }, 300)
  })
}

export function getNotice(noticeId: number) {
  return new Promise<{ data: SysNotice }>((resolve) => {
    setTimeout(() => {
      const notice = noticeList.find(item => item.noticeId === noticeId)
      resolve({ data: notice as SysNotice })
    }, 100)
  })
}

export function addNotice(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function updateNotice(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function delNotice(noticeIds: number[]) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}
