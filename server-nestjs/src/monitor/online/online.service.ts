import { Injectable } from '@nestjs/common';
import { QueryOnlineDto } from './dto/query-online.dto';

export interface OnlineUser {
  token: string;
  userName: string;
  ipaddr: string;
  loginTime: Date;
  browser?: string;
  os?: string;
}

/**
 * 在线用户服务（内存实现）
 * 如需持久化可替换为 Redis
 */
@Injectable()
export class OnlineService {
  private store = new Map<string, OnlineUser>();

  async add(user: OnlineUser) {
    this.store.set(user.token, user);
    await Promise.resolve();
  }

  async remove(token: string) {
    this.store.delete(token);
    await Promise.resolve();
  }

  async list(query?: QueryOnlineDto): Promise<{ total: number; rows: any[] }> {
    await Promise.resolve();
    let rows = Array.from(this.store.values());
    // 简单过滤
    if (query?.userName)
      rows = rows.filter((x) => x.userName.includes(query.userName || ''));
    if (query?.ipaddr)
      rows = rows.filter((x) => x.ipaddr.includes(query.ipaddr || ''));
    const pageNum = Number(query?.pageNum ?? 1);
    const pageSize = Number(query?.pageSize ?? 10);
    const total = rows.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const pageRows = rows
      .sort((a, b) => +new Date(b.loginTime) - +new Date(a.loginTime))
      .slice(start, end)
      .map((r) => ({
        tokenId: r.token,
        userName: r.userName,
        ipaddr: r.ipaddr,
        loginLocation: '',
        browser: r.browser ?? '',
        os: r.os ?? '',
        loginTime:
          r.loginTime instanceof Date
            ? r.loginTime.toISOString()
            : String(r.loginTime),
      }));
    return { total, rows: pageRows };
  }
}
