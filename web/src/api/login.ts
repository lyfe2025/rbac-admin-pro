import request from '@/utils/request'

export interface LoginData {
  username?: string
  password?: string
  code?: string
  uuid?: string
}

export interface LoginResult {
  token: string
}

export interface CaptchaResult {
  captchaEnabled: boolean
  uuid?: string
  img?: string
}

// 登录方法
export function login(data: LoginData) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: data
  })
}

// 获取验证码
export function getCaptchaImage() {
  return request<CaptchaResult>({
    url: '/auth/captchaImage',
    method: 'get'
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// 获取路由
export function getRouters() {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}
