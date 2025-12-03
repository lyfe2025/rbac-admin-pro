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

// 登录方法
export function login(data: LoginData) {
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
