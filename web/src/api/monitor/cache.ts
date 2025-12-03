// Cache Monitor Mock Data
export interface CacheInfo {
  redis_version: string
  redis_mode: string
  tcp_port: string
  connected_clients: string
  uptime_in_days: string
  used_memory_human: string
  used_cpu_user_children: string
  maxmemory_human: string
  aof_enabled: string
  rdb_last_bgsave_status: string
  dbSize: number
  commandStats: { name: string; value: string }[]
}

export function getCache() {
  return new Promise<{ data: CacheInfo }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          redis_version: '5.0.14',
          redis_mode: 'standalone',
          tcp_port: '6379',
          connected_clients: '10',
          uptime_in_days: '15',
          used_memory_human: '1.5M',
          used_cpu_user_children: '0.1',
          maxmemory_human: '0',
          aof_enabled: '0',
          rdb_last_bgsave_status: 'ok',
          dbSize: 100,
          commandStats: [
            { name: 'get', value: '1203' },
            { name: 'set', value: '450' },
            { name: 'del', value: '120' },
            { name: 'keys', value: '50' },
            { name: 'expire', value: '30' }
          ]
        }
      })
    }, 500)
  })
}

export function clearCacheName(cacheName: string) {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '清理成功', code: 200 })
    }, 300)
  })
}

export function clearCacheAll() {
  return new Promise<{ msg: string; code: number }>((resolve) => {
    setTimeout(() => {
      resolve({ msg: '清理成功', code: 200 })
    }, 300)
  })
}

export function listCacheName() {
  return new Promise<{ data: any[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          { cacheName: 'sys_config', remark: '参数配置' },
          { cacheName: 'sys_dict', remark: '数据字典' },
          { cacheName: 'sys_notice', remark: '通知公告' }
        ]
      })
    }, 300)
  })
}

export function listCacheKey(cacheName: string) {
   return new Promise<{ data: string[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
           cacheName + ':key1',
           cacheName + ':key2',
           cacheName + ':key3'
        ]
      })
    }, 300)
  })
}

export function getCacheValue(cacheName: string, cacheKey: string) {
   return new Promise<{ data: any }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
           cacheName,
           cacheKey,
           cacheValue: 'mock-value-' + Math.random(),
           remark: 'Mock Value'
        }
      })
    }, 300)
  })
}
