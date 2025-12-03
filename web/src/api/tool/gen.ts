import { type BaseEntity } from '@/api/system/types'

export interface GenTable extends BaseEntity {
  tableId: number
  tableName: string
  tableComment: string
  className: string
  tplCategory: string
  packageName: string
  moduleName: string
  businessName: string
  functionName: string
  functionAuthor: string
  genType: string
  genPath: string
}

const tableList: GenTable[] = [
  {
    tableId: 1,
    tableName: 'sys_user',
    tableComment: '用户信息表',
    className: 'SysUser',
    tplCategory: 'crud',
    packageName: 'com.ruoyi.system',
    moduleName: 'system',
    businessName: 'user',
    functionName: '用户',
    functionAuthor: 'ruoyi',
    genType: '0',
    genPath: '/',
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00'
  },
  {
    tableId: 2,
    tableName: 'sys_role',
    tableComment: '角色信息表',
    className: 'SysRole',
    tplCategory: 'crud',
    packageName: 'com.ruoyi.system',
    moduleName: 'system',
    businessName: 'role',
    functionName: '角色',
    functionAuthor: 'ruoyi',
    genType: '0',
    genPath: '/',
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00'
  }
]

export function listTable(query: any) {
  return new Promise<{ rows: GenTable[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = tableList
      if (query.tableName) {
        list = list.filter(item => item.tableName.includes(query.tableName))
      }
      if (query.tableComment) {
        list = list.filter(item => item.tableComment.includes(query.tableComment))
      }
      resolve({
        rows: list,
        total: list.length
      })
    }, 300)
  })
}

export function getGenTable(tableId: number) {
  return new Promise<{ data: GenTable }>((resolve) => {
    setTimeout(() => {
      const table = tableList.find(item => item.tableId === tableId)
      resolve({ data: table as GenTable })
    }, 100)
  })
}

export function updateGenTable(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function delTable(tableIds: number[]) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function previewTable(tableId: number) {
  return new Promise<{ data: Record<string, string> }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          'domain.java': 'public class SysUser {}',
          'mapper.java': 'public interface SysUserMapper {}',
          'service.java': 'public interface ISysUserService {}',
          'controller.java': 'public class SysUserController {}',
          'index.vue': '<template>...</template>'
        }
      })
    }, 300)
  })
}

export function genCode(tableName: string) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '生成成功', code: 200 })
    }, 300)
  })
}

export function importTable(tableNames: string[]) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '导入成功', code: 200 })
    }, 300)
  })
}
