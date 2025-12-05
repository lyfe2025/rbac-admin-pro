import { defineStore } from 'pinia'
import { login, logout, getInfo, type LoginData } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { useMenuStore } from './menu'

interface RoleInfo {
  roleId: string
  roleName: string
  roleKey: string
}

interface UserState {
  token: string
  userId: string
  name: string
  avatar: string
  email: string
  roles: string[]
  roleList: RoleInfo[]
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: getToken() || '',
    userId: '',
    name: '',
    avatar: '',
    email: '',
    roles: [],
    roleList: [],
    permissions: []
  }),
  actions: {
    // 登录
    async login(userInfo: LoginData) {
      const res = await login(userInfo)
      // 注意：根据后端返回结构，token 可能在 res.data.token 或者 res.token
      // request.ts 拦截器返回的是 response.data，即 { code: 200, msg: 'success', data: { token: '...' } }
      // 但拦截器最后 return response.data，所以这里的 res 就是后端返回的整个 JSON 对象
      // 后端 TransformInterceptor 返回 { code: 200, msg: 'success', data: { token: '...' } }
      
      // 让我们仔细看看 request.ts: 
      // const code = response.data.code || 200
      // return response.data
      
      // 所以 res 是 { code: 200, msg: 'success', data: { token: '...' } }
      // 我们需要从 res.data.token 获取
      
      // 但是，有些若依版本的前端 request.ts 会直接返回 res.data (payload) 如果 code===200
      // 我们的 request.ts: return response.data
      
      // 所以我们需要确认 res 的结构。
      // 如果后端返回 { code: 200, data: { token: '...' } }
      // 那么 res 就是这个对象。
      
      const data = res.data as { token: string }
      this.token = data.token
      setToken(data.token)
    },
    // 获取用户信息
    async getInfo() {
      const res = await getInfo()
      const data = res.data // { user, roles, roleList, permissions }
      
      if (data.roles && data.roles.length > 0) {
        this.roles = data.roles
        this.roleList = data.roleList || []
        this.permissions = data.permissions
      } else {
        this.roles = ['ROLE_DEFAULT']
        this.roleList = []
      }
      
      this.userId = data.user.userId?.toString() || ''
      this.name = data.user.nickName || data.user.userName
      this.avatar = data.user.avatar || ''
      this.email = data.user.email || ''
      return data
    },
    // 退出系统
    async logout() {
      await logout()
      this.token = ''
      this.roles = []
      this.permissions = []
      removeToken()
      
      // 清空菜单缓存
      const menuStore = useMenuStore()
      menuStore.clearMenus()
    }
  }
})
