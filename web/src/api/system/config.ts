import { type BaseEntity } from '../system/types'

export interface SysConfig extends BaseEntity {
  configId: number
  configName: string
  configKey: string
  configValue: string
  configType: string
}

const configList: SysConfig[] = [
  {
    configId: 1,
    configName: '主框架页-默认皮肤样式名称',
    configKey: 'sys.index.skinName',
    configValue: 'skin-blue',
    configType: 'Y',
    createTime: '2023-01-01 00:00:00',
    remark: '蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow'
  },
  {
    configId: 2,
    configName: '用户管理-账号初始密码',
    configKey: 'sys.user.initPassword',
    configValue: '123456',
    configType: 'Y',
    createTime: '2023-01-01 00:00:00',
    remark: '初始化密码 123456'
  },
  {
    configId: 3,
    configName: '主框架页-侧边栏主题',
    configKey: 'sys.index.sideTheme',
    configValue: 'theme-dark',
    configType: 'Y',
    createTime: '2023-01-01 00:00:00',
    remark: '深色主题 theme-dark，浅色主题 theme-light'
  },
  {
    configId: 4,
    configName: '网站名称',
    configKey: 'sys.app.name',
    configValue: 'RBAC Admin Pro',
    configType: 'Y',
    createTime: '2023-01-01 00:00:00',
    remark: '系统显示的网站名称'
  },
  {
    configId: 5,
    configName: '网站描述',
    configKey: 'sys.app.description',
    configValue: '基于 Vue 3 + TypeScript + Vite 的后台管理系统',
    configType: 'Y',
    createTime: '2023-01-01 00:00:00',
    remark: '网站的SEO描述或页脚描述'
  },
  {
    configId: 6,
    configName: '版权信息',
    configKey: 'sys.app.copyright',
    configValue: '© 2023 RBAC Admin. All rights reserved.',
    configType: 'Y',
    createTime: '2023-01-01 00:00:00',
    remark: '页脚版权信息'
  },
  {
    configId: 7,
    configName: '备案号',
    configKey: 'sys.app.icp',
    configValue: '京ICP备12345678号',
    configType: 'Y',
    createTime: '2023-01-01 00:00:00',
    remark: '网站备案号'
  },
  {
    configId: 8,
    configName: '联系邮箱',
    configKey: 'sys.app.email',
    configValue: 'support@example.com',
    configType: 'Y',
    createTime: '2023-01-01 00:00:00',
    remark: '联系我们邮箱'
  }
]

export function listConfig(query: any) {
  return new Promise<{ rows: SysConfig[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = configList
      if (query.configName) {
        list = list.filter(item => item.configName.includes(query.configName))
      }
      if (query.configKey) {
        list = list.filter(item => item.configKey.includes(query.configKey))
      }
      if (query.configType) {
        list = list.filter(item => item.configType === query.configType)
      }
      resolve({
        rows: list,
        total: list.length
      })
    }, 300)
  })
}

export function getConfig(configId: number) {
  return new Promise<{ data: SysConfig }>((resolve) => {
    setTimeout(() => {
      const config = configList.find(item => item.configId === configId)
      resolve({ data: config as SysConfig })
    }, 100)
  })
}

export function addConfig(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function updateConfig(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function delConfig(configIds: number[]) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function refreshCache() {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '刷新成功', code: 200 })
    }, 300)
  })
}
