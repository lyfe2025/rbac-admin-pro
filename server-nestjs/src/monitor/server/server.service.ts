import { Injectable } from '@nestjs/common';
import os from 'os';

@Injectable()
export class ServerService {
  getInfo() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = totalMem ? +((usedMem / totalMem) * 100).toFixed(2) : 0;

    const cpuCount = os.cpus().length;
    const load = os.loadavg()[0];
    const cpuUsage = cpuCount
      ? +(Math.min(load / cpuCount, 1) * 100).toFixed(2)
      : 0;

    const jvm = {
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      max: Math.round(process.memoryUsage().rss / 1024 / 1024),
      free: Math.round(
        (process.memoryUsage().heapTotal - process.memoryUsage().heapUsed) /
          1024 /
          1024,
      ),
      version: process.version,
      home: process.execPath,
      name: 'Node.js',
      startTime: new Date(process.uptime() * 1000).toISOString(),
      runTime: `${Math.round(process.uptime())}s`,
      usage: Math.round(
        (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) *
          100,
      ),
    };

    return {
      cpu: {
        cpuNum: cpuCount,
        total: 100,
        sys: cpuUsage,
        used: cpuUsage,
        wait: 0,
        free: 100 - cpuUsage,
      },
      mem: {
        total: Math.round(totalMem / 1024 / 1024),
        used: Math.round(usedMem / 1024 / 1024),
        free: Math.round(freeMem / 1024 / 1024),
        usage: memUsage,
      },
      jvm,
      sys: {
        computerName: os.hostname(),
        computerIp: '127.0.0.1',
        userDir: process.cwd(),
        osName: os.type(),
        osArch: os.arch(),
      },
      sysFiles: [],
    };
  }
}
