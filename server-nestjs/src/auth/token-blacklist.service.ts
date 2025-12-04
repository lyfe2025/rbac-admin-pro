import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

function parseExpiresIn(str?: string): number {
  if (!str) return 24 * 3600;
  const m = String(str).trim();
  if (/^\d+$/.test(m)) return Number(m); // seconds
  const match = m.match(/^(\d+)([smhd])$/); // s/m/h/d
  if (!match) return 24 * 3600;
  const num = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case 's':
      return num;
    case 'm':
      return num * 60;
    case 'h':
      return num * 3600;
    case 'd':
      return num * 86400;
    default:
      return 24 * 3600;
  }
}

@Injectable()
export class TokenBlacklistService {
  constructor(
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  private key(token: string) {
    return `jwt:blacklist:${token}`;
  }

  async add(token: string) {
    if (!token) return;
    const ttl = parseExpiresIn(
      this.config.get<string>('JWT_EXPIRES_IN') || '24h',
    );
    const client = this.redis.getClient();
    await client.setex(this.key(token), ttl, '1');
  }

  async isBlacklisted(token: string) {
    if (!token) return false;
    const client = this.redis.getClient();
    const exists = await client.exists(this.key(token));
    return exists === 1;
  }
}
