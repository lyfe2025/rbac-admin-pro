import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';

function parseInfo(info: string) {
  const map = new Map<string, string>();
  info.split('\n').forEach((line) => {
    const m = line.match(/^([a-zA-Z_]+):(.+)$/);
    if (m) map.set(m[1], m[2]);
  });
  return map;
}

@Injectable()
export class CacheService {
  constructor(private readonly redis: RedisService) {}

  async getCache() {
    const client = this.redis.getClient();
    const info = await client.info();
    const map = parseInfo(info);
    const commandStats: { name: string; value: string }[] = [];
    const cmd = await client.info('commandstats');
    cmd.split('\n').forEach((line) => {
      const m = line.match(/^cmdstat_(\w+):.*calls=(\d+)/);
      if (m) commandStats.push({ name: m[1], value: m[2] });
    });
    const dbSize = await client.dbsize();
    return {
      redis_version: map.get('redis_version') || '',
      redis_mode: map.get('redis_mode') || '',
      tcp_port: map.get('tcp_port') || '',
      connected_clients: map.get('connected_clients') || '',
      uptime_in_days: map.get('uptime_in_days') || '',
      used_memory_human: map.get('used_memory_human') || '',
      used_cpu_user_children: map.get('used_cpu_user_children') || '',
      maxmemory_human: map.get('maxmemory_human') || '',
      aof_enabled: map.get('aof_enabled') || '',
      rdb_last_bgsave_status: map.get('rdb_last_bgsave_status') || '',
      dbSize,
      commandStats,
    };
  }

  async clearCacheName(cacheName: string) {
    const client = this.redis.getClient();
    const iter = client.scanStream({ match: `${cacheName}:*`, count: 100 });
    const keys: string[] = [];
    return new Promise<void>((resolve) => {
      iter.on('data', (ks: string[]) => keys.push(...ks));
      iter.on('end', () => {
        if (keys.length) {
          for (const k of keys) client.del(k);
        }
        resolve();
      });
    });
  }

  async clearCacheAll() {
    const client = this.redis.getClient();
    await client.flushdb();
  }

  async listCacheName() {
    const client = this.redis.getClient();
    const iter = client.scanStream({ match: '*', count: 100 });
    const names = new Set<string>();
    return new Promise<{ cacheName: string; remark: string }[]>((resolve) => {
      iter.on('data', (ks: string[]) => {
        ks.forEach((k) => {
          const idx = k.indexOf(':');
          if (idx > 0) names.add(k.substring(0, idx));
        });
      });
      iter.on('end', () => {
        resolve(Array.from(names).map((n) => ({ cacheName: n, remark: '' })));
      });
    });
  }

  async listCacheKey(cacheName: string) {
    const client = this.redis.getClient();
    const iter = client.scanStream({ match: `${cacheName}:*`, count: 100 });
    const keys: string[] = [];
    return new Promise<string[]>((resolve) => {
      iter.on('data', (ks: string[]) => keys.push(...ks));
      iter.on('end', () => resolve(keys));
    });
  }

  async getCacheValue(cacheName: string, cacheKey: string) {
    const client = this.redis.getClient();
    const key = `${cacheName}:${cacheKey}`;
    const value = await client.get(key);
    return { cacheName, cacheKey, cacheValue: value, remark: '' };
  }
}
