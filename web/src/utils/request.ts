import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { useToast } from '@/components/ui/toast/use-toast'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/stores/modules/user'

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
    // 未设置状态码则默认成功状态
    const code = response.data.code || 200
    // 获取错误信息
    const msg = response.data.msg || '系统未知错误，请反馈给管理员'
    
    // 二进制数据则直接返回
    if (response.request.responseType ===  'blob' || response.request.responseType ===  'arraybuffer') {
      return response.data
    }
    
    if (code === 401) {
       // 模拟登出
       const userStore = useUserStore()
       userStore.logout().then(() => {
         location.href = '/login'
       })
       return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      toast({
        title: "系统错误",
        description: msg,
        variant: "destructive",
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      toast({
        title: "操作失败",
        description: msg,
        variant: "destructive",
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  (error: any) => {
    console.log('err' + error)
    let { message } = error
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    
    toast({
      title: "网络错误",
      description: message,
      variant: "destructive",
    })
    return Promise.reject(error)
  }
)

export default service
