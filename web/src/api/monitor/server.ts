// Mock Server Data
export interface ServerInfo {
  cpu: {
    cpuNum: number
    total: number
    sys: number
    used: number
    wait: number
    free: number
  }
  mem: {
    total: number
    used: number
    free: number
    usage: number
  }
  jvm: {
    total: number
    max: number
    free: number
    version: string
    home: string
    name: string
    startTime: string
    runTime: string
    usage: number
  }
  sys: {
    computerName: string
    computerIp: string
    userDir: string
    osName: string
    osArch: string
  }
  sysFiles: {
    dirName: string
    sysTypeName: string
    typeName: string
    total: string
    free: string
    used: string
    usage: number
  }[]
}

export function getServer() {
  return new Promise<{ data: ServerInfo }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          cpu: {
            cpuNum: 4,
            total: 100,
            sys: 5.2,
            used: 12.5,
            wait: 0,
            free: 82.3
          },
          mem: {
            total: 16,
            used: 8.5,
            free: 7.5,
            usage: 53.12
          },
          jvm: {
            total: 1024,
            max: 4096,
            free: 512,
            version: '1.8.0_111',
            home: '/usr/java/jdk1.8.0_111/jre',
            name: 'Java HotSpot(TM) 64-Bit Server VM',
            startTime: '2023-01-01 00:00:00',
            runTime: '10天 5小时',
            usage: 50
          },
          sys: {
            computerName: 'RuoYi-Server',
            computerIp: '127.0.0.1',
            userDir: '/root/ruoyi',
            osName: 'Linux',
            osArch: 'amd64'
          },
          sysFiles: [
            {
              dirName: '/',
              sysTypeName: 'ext4',
              typeName: '本地磁盘',
              total: '50GB',
              free: '20GB',
              used: '30GB',
              usage: 60
            },
            {
              dirName: '/home',
              sysTypeName: 'ext4',
              typeName: '本地磁盘',
              total: '100GB',
              free: '80GB',
              used: '20GB',
              usage: 20
            }
          ]
        }
      })
    }, 500)
  })
}
