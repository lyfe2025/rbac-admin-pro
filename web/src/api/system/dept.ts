import { type SysDept } from './types'

// Mock data
const deptList: SysDept[] = [
  {
    deptId: '100',
    parentId: null,
    ancestors: '',
    deptName: '某某科技',
    orderNum: 0,
    leader: '某某',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    delFlag: '0',
    createTime: '2023-01-01 00:00:00',
    children: [
      {
        deptId: '101',
        parentId: '100',
        ancestors: '100',
        deptName: '深圳总公司',
        orderNum: 1,
        leader: '某某',
        phone: '15888888888',
        email: 'ry@qq.com',
        status: '0',
        delFlag: '0',
        createTime: '2023-01-01 00:00:00',
        children: [
          {
            deptId: '103',
            parentId: '101',
            ancestors: '100,101',
            deptName: '研发部门',
            orderNum: 1,
            leader: '某某',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            createTime: '2023-01-01 00:00:00'
          },
          {
            deptId: '104',
            parentId: '101',
            ancestors: '100,101',
            deptName: '市场部门',
            orderNum: 2,
            leader: '某某',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            createTime: '2023-01-01 00:00:00'
          },
          {
            deptId: '105',
            parentId: '101',
            ancestors: '100,101',
            deptName: '测试部门',
            orderNum: 3,
            leader: '某某',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            createTime: '2023-01-01 00:00:00'
          },
          {
            deptId: '106',
            parentId: '101',
            ancestors: '100,101',
            deptName: '财务部门',
            orderNum: 4,
            leader: '某某',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            createTime: '2023-01-01 00:00:00'
          },
          {
            deptId: '107',
            parentId: '101',
            ancestors: '100,101',
            deptName: '运维部门',
            orderNum: 5,
            leader: '某某',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            createTime: '2023-01-01 00:00:00'
          }
        ]
      },
      {
        deptId: '102',
        parentId: '100',
        ancestors: '100',
        deptName: '长沙分公司',
        orderNum: 2,
        leader: '某某',
        phone: '15888888888',
        email: 'ry@qq.com',
        status: '0',
        delFlag: '0',
        createTime: '2023-01-01 00:00:00',
        children: [
          {
            deptId: '108',
            parentId: '102',
            ancestors: '100,102',
            deptName: '市场部门',
            orderNum: 1,
            leader: '某某',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            createTime: '2023-01-01 00:00:00'
          },
          {
            deptId: '109',
            parentId: '102',
            ancestors: '100,102',
            deptName: '财务部门',
            orderNum: 2,
            leader: '某某',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            createTime: '2023-01-01 00:00:00'
          }
        ]
      }
    ]
  }
]

// Flatten helper
function flattenDepts(depts: SysDept[]): SysDept[] {
  let result: SysDept[] = []
  for (const dept of depts) {
    const { children, ...rest } = dept
    result.push(rest as SysDept)
    if (children) {
      result = result.concat(flattenDepts(children))
    }
  }
  return result
}

const flatDeptList = flattenDepts(deptList)

export function listDept(query?: any) {
  return new Promise<{ data: SysDept[] }>((resolve) => {
    setTimeout(() => {
      // 简单模拟搜索
      if (query?.deptName) {
        resolve({ 
          data: flatDeptList.filter(d => d.deptName.includes(query.deptName)) 
        })
      } else {
        resolve({ data: deptList })
      }
    }, 300)
  })
}

export function getDept(deptId: string) {
  return new Promise<{ data: SysDept }>((resolve) => {
    setTimeout(() => {
      const dept = flatDeptList.find(d => d.deptId === deptId)
      resolve({ data: dept as SysDept })
    }, 100)
  })
}

export function addDept(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function updateDept(data: any) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

export function delDept(deptId: string) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '操作成功', code: 200 })
    }, 300)
  })
}

// 查询部门下拉树结构
export function listDeptTree() {
  return new Promise<{ data: any[] }>((resolve) => {
    setTimeout(() => {
      // 简单转换，实际后端会返回特定格式
      const transform = (depts: SysDept[]): any[] => {
        return depts.map(dept => ({
          id: dept.deptId,
          label: dept.deptName,
          children: dept.children ? transform(dept.children) : undefined
        }))
      }
      resolve({ data: transform(deptList) })
    }, 300)
  })
}
