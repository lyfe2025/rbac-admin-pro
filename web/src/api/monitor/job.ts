import request from '@/utils/request'
import { type SysJob } from '@/api/system/types'

const jobList: SysJob[] = []

export function listJob(query: any) {
  return request<{ data: { rows: SysJob[]; total: number } }>({
    url: '/monitor/job',
    method: 'get',
    params: query
  }).then((res: any) => res.data)
}

export function getJob(jobId: string) {
  return request<{ data: SysJob }>({
    url: `/monitor/job/${jobId}`,
    method: 'get'
  }).then((res: any) => res.data)
}

export function addJob(data: any) {
  return request({
    url: '/monitor/job',
    method: 'post',
    data
  }).then((res: any) => res)
}

export function updateJob(data: any) {
  return request({
    url: `/monitor/job/${data.jobId}`,
    method: 'put',
    data
  }).then((res: any) => res)
}

export function delJob(jobIds: string[]) {
  return request({
    url: '/monitor/job',
    method: 'delete',
    params: { ids: jobIds.join(',') }
  }).then((res: any) => res)
}

export function runJob(jobId: string, jobGroup: string) {
  return request({
    url: '/monitor/job/run',
    method: 'get',
    params: { jobId, jobGroup }
  }).then((res: any) => res)
}

export function changeJobStatus(jobId: string, status: string) {
  return request({
    url: '/monitor/job/changeStatus',
    method: 'put',
    data: { jobId, status }
  }).then((res: any) => res)
}
