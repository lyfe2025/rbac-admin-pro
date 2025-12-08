import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { useToast } from '@/components/ui/toast/use-toast'
import { getToken, setToken } from '@/utils/auth'
import { useUserStore } from '@/stores/modules/user'
import { useAppStore } from '@/stores/modules/app'
import { ErrorCode, shouldRedirectToLogin, getErrorMessage } from '@/types/error-code'

const { toast } = useToast()

// 创建 axios 实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 10000
})

// request 拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 模拟从 pinia 或 localStorage 获取 token
    const token = getToken()
    
    if (token && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    
    // 可以在这里添加其他通用 header，如 tenant-id 等
    return config
  },
  (error: any) => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 滑动过期：检查响应头中是否有新 Token
    const newToken = response.headers['x-new-token']
    if (newToken) {
      setToken(newToken)
    }
    
    // 未设置状态码则默认成功状态
    const code = response.data.code || ErrorCode.SUCCESS
    // 获取错误信息 (优先使用后端返回的 msg,如果没有则使用前端错误码映射)
    const msg = response.data.msg || getErrorMessage(code)
    
    // 二进制数据则直接返回
    if (response.request.responseType ===  'blob' || response.request.responseType ===  'arraybuffer') {
      return response.data
    }
    
    // 判断是否需要跳转登录页 (使用业务错误码)
    if (shouldRedirectToLogin(code)) {
      const errorMsg = msg || '无效的会话，或者会话已过期，请重新登录'
      // 先显示提示，延迟后再跳转登录页
      toast({
        title: "登录已失效",
        description: errorMsg,
        variant: "destructive",
        duration: 3000,
      })
      const userStore = useUserStore()
      const appStore = useAppStore()
      const loginPath = appStore.siteConfig.loginPath || '/login'
      setTimeout(() => {
        userStore.logout().then(() => {
          location.href = loginPath
        })
      }, 2000)
      return Promise.reject(new Error(errorMsg))
    }
    
    // 判断系统内部错误
    if (code === ErrorCode.INTERNAL_ERROR || code === ErrorCode.DATABASE_ERROR) {
      toast({
        title: "系统错误",
        description: msg,
        variant: "destructive",
      })
      return Promise.reject(new Error(msg))
    }
    
    // 判断是否成功
    if (code !== ErrorCode.SUCCESS) {
      toast({
        title: "操作失败",
        description: msg,
        variant: "destructive",
      })
      return Promise.reject(new Error(msg))
    }
    
    // 成功,返回数据
    return response.data
  },
  (error: any) => {
    console.log('err' + error)
    let { message } = error
    let title = "网络错误"
    
    // 尝试从响应中获取后端返回的错误信息
    if (error.response && error.response.data) {
      const httpStatus = error.response.status     // HTTP 状态码
      const { code, msg } = error.response.data    // 业务错误码和消息
      // 优先使用后端返回的 msg,如果没有则使用错误码映射
      const errorMessage = msg || (code ? getErrorMessage(code) : '')
      
      if (httpStatus === 400) {
        title = "参数验证失败"
        message = errorMessage || "请求参数验证失败"
      } else if (httpStatus === 401) {
        title = "登录已失效"
        message = errorMessage || "无效的会话，或者会话已过期，请重新登录"
        // 先显示提示，延迟后再跳转登录页
        toast({
          title,
          description: message,
          variant: "destructive",
          duration: 3000,
        })
        const userStore = useUserStore()
        const appStore = useAppStore()
        const loginPath = appStore.siteConfig.loginPath || '/login'
        setTimeout(() => {
          userStore.logout().then(() => {
            location.href = loginPath
          })
        }, 2000)
        return Promise.reject(new Error(message))
      } else if (httpStatus === 403) {
        title = "权限不足"
        message = errorMessage || "您没有权限执行此操作"
      } else if (httpStatus === 500) {
        title = "系统错误"
        message = errorMessage || "系统内部错误"
      } else if (errorMessage) {
        message = errorMessage
      }
    } else if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    
    toast({
      title,
      description: message,
      variant: "destructive",
    })
    return Promise.reject(new Error(message))
  }
)

export default service
