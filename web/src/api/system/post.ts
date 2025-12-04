import request from '@/utils/request'
import { type SysPost } from './types'

export function listPost(query: any) {
  return request<{ data: { total: number; rows: SysPost[] } }>({
    url: '/system/post',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function getPost(postId: string) {
  return request<{ data: { data: SysPost } }>({
    url: `/system/post/${postId}`,
    method: 'get'
  }).then((res: any) => res)
}

export function addPost(data: any) {
  return request({
    url: '/system/post',
    method: 'post',
    data
  }).then((res: any) => res)
}

export function updatePost(data: any) {
  return request({
    url: `/system/post/${data.postId}`,
    method: 'put',
    data
  }).then((res: any) => res)
}

export function delPost(postIds: string[]) {
  return request({
    url: '/system/post',
    method: 'delete',
    params: { ids: postIds.join(',') }
  }).then((res: any) => res)
}
