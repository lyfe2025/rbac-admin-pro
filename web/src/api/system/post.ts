import { type SysPost } from './types'

const postList: SysPost[] = [
  {
    postId: '1',
    postCode: 'ceo',
    postName: '董事长',
    postSort: 1,
    status: '0',
    createTime: '2023-01-01 00:00:00',
    remark: '负责集团决策'
  },
  {
    postId: '2',
    postCode: 'se',
    postName: '项目经理',
    postSort: 2,
    status: '0',
    createTime: '2023-01-01 00:00:00',
    remark: '负责项目管理'
  },
  {
    postId: '3',
    postCode: 'hr',
    postName: '人力资源',
    postSort: 3,
    status: '0',
    createTime: '2023-01-01 00:00:00',
    remark: '负责人事管理'
  },
  {
    postId: '4',
    postCode: 'user',
    postName: '普通员工',
    postSort: 4,
    status: '0',
    createTime: '2023-01-01 00:00:00',
    remark: '普通员工'
  }
]

export function listPost(query: any) {
  return new Promise<{ rows: SysPost[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = postList
      if (query.postCode) {
        list = list.filter(item => item.postCode.includes(query.postCode))
      }
      if (query.postName) {
        list = list.filter(item => item.postName.includes(query.postName))
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

export function getPost(postId: string) {
  return new Promise<{ data: SysPost }>((resolve) => {
    setTimeout(() => {
      const post = postList.find(item => item.postId === postId)
      resolve({ data: post as SysPost })
    }, 100)
  })
}

export function addPost(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function updatePost(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function delPost(postIds: string[]) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}
