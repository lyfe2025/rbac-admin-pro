import { Controller, Get, Query, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CacheService } from './cache.service';

@UseGuards(JwtAuthGuard)
@Controller('monitor/cache')
export class CacheController {
  constructor(private readonly service: CacheService) {}

  @Get()
  async get() {
    return this.service.getCache();
  }

  @Delete('name')
  async clearName(@Query('cacheName') cacheName: string) {
    await this.service.clearCacheName(cacheName);
    return null;
  }

  @Delete('all')
  async clearAll() {
    await this.service.clearCacheAll();
    return null;
  }

  @Get('names')
  async names() {
    return this.service.listCacheName();
  }

  @Get('keys')
  async keys(@Query('cacheName') cacheName: string) {
    return this.service.listCacheKey(cacheName);
  }

  @Get('value')
  async value(
    @Query('cacheName') cacheName: string,
    @Query('cacheKey') cacheKey: string,
  ) {
    return this.service.getCacheValue(cacheName, cacheKey);
  }
}
