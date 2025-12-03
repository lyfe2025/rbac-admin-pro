import { type SysJob } from '@/api/system/types'

const jobList: SysJob[] = [
  {
    jobId: '1',
    jobName: '系统默认（无参）',
    jobGroup: 'DEFAULT',
    invokeTarget: 'ryTask.ryNoParams',
    cronExpression: '0/10 * * * * ?',
    misfirePolicy: '1',
    concurrent: '1',
    status: '0',
    createTime: '2023-01-01 00:00:00',
    remark: ''
  },
  {
    jobId: '2',
    jobName: '系统默认（有参）',
    jobGroup: 'DEFAULT',
    invokeTarget: 'ryTask.ryParams(\'ry\')',
    cronExpression: '0/15 * * * * ?',
    misfirePolicy: '1',
    concurrent: '1',
    status: '1', // 暂停
    createTime: '2023-01-01 00:00:00',
    remark: ''
  },
  {
    jobId: '3',
    jobName: '系统默认（多参）',
    jobGroup: 'DEFAULT',
    invokeTarget: 'ryTask.ryMultipleParams(\'ry\', true, 2000L, 316.50D, 100)',
    cronExpression: '0/20 * * * * ?',
    misfirePolicy: '1',
    concurrent: '1',
    status: '0',
    createTime: '2023-01-01 00:00:00',
    remark: ''
  }
]

export function listJob(query: any) {
  return new Promise<{ rows: SysJob[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = jobList
      if (query.jobName) {
        list = list.filter(item => item.jobName.includes(query.jobName))
      }
      if (query.jobGroup) {
        list = list.filter(item => item.jobGroup.includes(query.jobGroup))
      }
      if (query.status) {
        list = list.filter(item => item.status === query.status)
      }
      resolve({
        rows: list,
        total: list.length
      })
    }, 300)
  })
}

export function getJob(jobId: string) {
  return new Promise<{ data: SysJob }>((resolve) => {
    setTimeout(() => {
      const job = jobList.find(item => item.jobId === jobId)
      resolve({ data: job as SysJob })
    }, 100)
  })
}

export function addJob(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function updateJob(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function delJob(jobIds: string[]) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function runJob(jobId: string, jobGroup: string) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function changeJobStatus(jobId: string, status: string) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}
