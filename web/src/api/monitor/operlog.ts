import { type SysOperLog } from '@/api/system/types'

const operLogList: SysOperLog[] = [
  {
    operId: '1',
    title: '用户管理',
    businessType: 1, // 新增
    method: 'com.ruoyi.project.system.controller.SysUserController.add()',
    requestMethod: 'POST',
    operatorType: 1,
    operName: 'admin',
    deptName: '研发部门',
    operUrl: '/system/user',
    operIp: '127.0.0.1',
    operLocation: '内网IP',
    operParam: '{"userName": "test"}',
    jsonResult: '{"msg": "操作成功", "code": 200}',
    status: 0,
    errorMsg: '',
    operTime: '2023-01-01 12:00:00'
  },
  {
    operId: '2',
    title: '菜单管理',
    businessType: 2, // 修改
    method: 'com.ruoyi.project.system.controller.SysMenuController.edit()',
    requestMethod: 'PUT',
    operatorType: 1,
    operName: 'admin',
    deptName: '研发部门',
    operUrl: '/system/menu',
    operIp: '127.0.0.1',
    operLocation: '内网IP',
    operParam: '{"menuName": "test"}',
    jsonResult: '{"msg": "操作成功", "code": 200}',
    status: 0,
    errorMsg: '',
    operTime: '2023-01-01 12:05:00'
  },
  {
    operId: '3',
    title: '岗位管理',
    businessType: 3, // 删除
    method: 'com.ruoyi.project.system.controller.SysPostController.remove()',
    requestMethod: 'DELETE',
    operatorType: 1,
    operName: 'admin',
    deptName: '研发部门',
    operUrl: '/system/post/1',
    operIp: '127.0.0.1',
    operLocation: '内网IP',
    operParam: '{"postId": 1}',
    jsonResult: '{"msg": "操作成功", "code": 200}',
    status: 0,
    errorMsg: '',
    operTime: '2023-01-01 12:10:00'
  }
]

export function listOperLog(query: any) {
  return new Promise<{ rows: SysOperLog[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = operLogList
      if (query.title) {
        list = list.filter(item => item.title.includes(query.title))
      }
      if (query.operName) {
        list = list.filter(item => item.operName.includes(query.operName))
      }
      if (query.status !== undefined) {
        list = list.filter(item => item.status === Number(query.status))
      }
      if (query.businessType !== undefined) {
         list = list.filter(item => item.businessType === Number(query.businessType))
      }
      resolve({
        rows: list,
        total: list.length
      })
    }, 300)
  })
}

export function delOperLog(operIds: string[]) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function cleanOperLog() {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}
