import { defineStore } from 'pinia'
import { type LoginData } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

interface UserState {
  token: string
  name: string
  avatar: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: getToken() || '',
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  }),
  actions: {
    // 登录
    async login(_userInfo: LoginData) {
      // 模拟登录逻辑
      return new Promise<void>((resolve) => {
        const token = 'mock-token-123456' // 模拟 token
        this.token = token
        setToken(token)
        resolve()
      })
      // 真实对接时使用以下代码：
      /*
      const res = await login(userInfo)
      this.token = res.token
      setToken(res.token)
      */
    },
    // 获取用户信息
    async getInfo() {
      // 模拟获取用户信息
      return new Promise<UserState>((resolve) => {
        this.roles = ['admin']
        this.permissions = ['*:*:*']
        this.name = 'Admin'
        this.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        resolve(this.$state)
      })
       // 真实对接时使用以下代码：
      /*
      const res = await getInfo()
      this.roles = res.roles
      this.permissions = res.permissions
      this.name = res.user.userName
      this.avatar = res.user.avatar
      return res
      */
    },
    // 退出系统
    async logout() {
       // 模拟登出
      return new Promise<void>((resolve) => {
        this.token = ''
        this.roles = []
        this.permissions = []
        removeToken()
        resolve()
      })
       // 真实对接时使用以下代码：
      /*
      await logout()
      this.token = ''
      this.roles = []
      this.permissions = []
      removeToken()
      */
    }
  }
})
