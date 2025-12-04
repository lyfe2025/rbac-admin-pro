import request from '@/utils/request'
import { type BaseEntity } from '@/api/system/types'

export interface GenTable extends BaseEntity {
  tableId: number
  tableName: string
  tableComment: string
  className: string
  tplCategory: string
  packageName: string
  moduleName: string
  businessName: string
  functionName: string
  functionAuthor: string
  genType: string
  genPath: string
}


export function listTable(query: any) {
  return request<{ data: { rows: GenTable[]; total: number } }>({
    url: '/tool/gen/table',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function getGenTable(tableId: number) {
  return request<{ data: { data: GenTable } }>({
    url: `/tool/gen/table/${tableId}`,
    method: 'get'
  }).then((res: any) => res)
}

export function updateGenTable(data: any) {
  return request({
    url: '/tool/gen/table',
    method: 'put',
    data
  }).then((res: any) => res)
}

export function delTable(tableIds: number[]) {
  return request({
    url: '/tool/gen/table',
    method: 'delete',
    params: { ids: tableIds.join(',') }
  }).then((res: any) => res)
}

export function previewTable(tableId: number) {
  return request<{ data: { data: Record<string, string> } }>({
    url: `/tool/gen/preview/${tableId}`,
    method: 'get'
  }).then((res: any) => res)
}

export function genCode(tableName: string) {
  return request({
    url: '/tool/gen/genCode',
    method: 'post',
    data: { tableName }
  }).then((res: any) => res)
}

export function importTable(tableNames: string[]) {
  return request({
    url: '/tool/gen/import',
    method: 'post',
    data: { tableNames }
  }).then((res: any) => res)
}
