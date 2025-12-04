import request from '@/utils/request'
import { type SysDictType as DictType, type SysDictData as DictData } from './types'
export type { SysDictType as DictType, SysDictData as DictData } from './types'

export function listType(query: any) {
  return request<{ data: { total: number; rows: DictType[] } }>({
    url: '/system/dict/type',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function getType(dictId: string) {
  return request<{ data: { data: DictType } }>({
    url: `/system/dict/type/${dictId}`,
    method: 'get'
  }).then((res: any) => res)
}

export function addType(data: any) {
  return request({
    url: '/system/dict/type',
    method: 'post',
    data
  }).then((res: any) => res)
}

export function updateType(data: any) {
  return request({
    url: `/system/dict/type/${data.dictId}`,
    method: 'put',
    data
  }).then((res: any) => res)
}

export function delType(dictIds: string[]) {
  return request({
    url: `/system/dict/type`,
    method: 'delete',
    params: { ids: dictIds.join(',') }
  }).then((res: any) => res)
}

// 字典数据
export function listData(query: any) {
  return request<{ data: { rows: DictData[]; total: number } }>({
    url: '/system/dict/data',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function getData(dictCode: string) {
  return request<{ data: { data: DictData } }>({
    url: `/system/dict/data/${dictCode}`,
    method: 'get'
  }).then((res: any) => res)
}

export function addData(data: any) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data
  }).then((res: any) => res)
}

export function updateData(data: any) {
  return request({
    url: `/system/dict/data/${data.dictCode}`,
    method: 'put',
    data
  }).then((res: any) => res)
}

export function delData(dictCodes: string[]) {
  return request({
    url: '/system/dict/data',
    method: 'delete',
    params: { ids: dictCodes.join(',') }
  }).then((res: any) => res)
}
