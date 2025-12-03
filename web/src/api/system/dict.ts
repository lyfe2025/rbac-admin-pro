import { ref } from 'vue'

export interface DictType {
  dictId: number
  dictName: string
  dictType: string
  status: string
  createBy: string
  createTime: string
  remark: string
}

export interface DictData {
  dictCode: number
  dictSort: number
  dictLabel: string
  dictValue: string
  dictType: string
  cssClass: string
  listClass: string
  isDefault: string
  status: string
  createBy: string
  createTime: string
  remark: string
}

// Mock data
const dictTypes = ref<DictType[]>([
  {
    dictId: 1,
    dictName: '用户性别',
    dictType: 'sys_user_sex',
    status: '0',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '用户性别列表'
  },
  {
    dictId: 2,
    dictName: '菜单状态',
    dictType: 'sys_show_hide',
    status: '0',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '菜单状态列表'
  },
  {
    dictId: 3,
    dictName: '系统开关',
    dictType: 'sys_normal_disable',
    status: '0',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '系统开关列表'
  },
  {
    dictId: 4,
    dictName: '任务状态',
    dictType: 'sys_job_status',
    status: '0',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '任务状态列表'
  },
  {
    dictId: 5,
    dictName: '任务分组',
    dictType: 'sys_job_group',
    status: '0',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '任务分组列表'
  },
  {
    dictId: 6,
    dictName: '系统是否',
    dictType: 'sys_yes_no',
    status: '0',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '系统是否列表'
  },
  {
    dictId: 7,
    dictName: '通知类型',
    dictType: 'sys_notice_type',
    status: '0',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '通知类型列表'
  },
  {
    dictId: 8,
    dictName: '通知状态',
    dictType: 'sys_notice_status',
    status: '0',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '通知状态列表'
  },
  {
    dictId: 9,
    dictName: '操作类型',
    dictType: 'sys_oper_type',
    status: '0',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '操作类型列表'
  },
  {
    dictId: 10,
    dictName: '系统状态',
    dictType: 'sys_common_status',
    status: '0',
    createBy: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '登录状态列表'
  }
])

export function listType(query: any) {
  return new Promise<{ rows: DictType[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = dictTypes.value
      if (query.dictName) {
        list = list.filter(item => item.dictName.includes(query.dictName))
      }
      if (query.dictType) {
        list = list.filter(item => item.dictType.includes(query.dictType))
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

export function getType(dictId: number) {
  return new Promise<{ data: DictType }>((resolve) => {
    setTimeout(() => {
      const dict = dictTypes.value.find(item => item.dictId === dictId)
      resolve({ data: dict as DictType })
    }, 100)
  })
}

export function addType(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      const newId = dictTypes.value.length > 0 ? Math.max(...dictTypes.value.map(item => item.dictId)) + 1 : 1
      dictTypes.value.unshift({
        dictId: newId,
        ...data,
        createTime: new Date().toLocaleString().replace(/\//g, '-')
      })
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function updateType(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      const index = dictTypes.value.findIndex(item => item.dictId === data.dictId)
      if (index !== -1) {
        dictTypes.value[index] = { ...dictTypes.value[index], ...data }
      }
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function delType(dictIds: number[]) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      dictTypes.value = dictTypes.value.filter(item => !dictIds.includes(item.dictId))
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}
