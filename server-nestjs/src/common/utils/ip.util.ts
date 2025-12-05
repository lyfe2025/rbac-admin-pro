import * as geoip from 'geoip-lite';
import type { Request } from 'express';

/**
 * IP 工具类
 */
export class IpUtil {
  /**
   * 获取客户端真实 IP
   */
  static getClientIp(request: Request): string {
    // 优先从 x-forwarded-for 获取(代理/负载均衡场景)
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      const ip = typeof forwarded === 'string' 
        ? forwarded.split(',')[0].trim()
        : forwarded[0];
      return ip;
    }

    // 从 x-real-ip 获取
    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      return typeof realIp === 'string' ? realIp : realIp[0];
    }

    // 从 socket 获取
    const socketIp = request.socket.remoteAddress || '';
    
    // 处理 IPv6 的 IPv4 映射地址
    if (socketIp.startsWith('::ffff:')) {
      return socketIp.substring(7);
    }

    return socketIp || request.ip || '未知';
  }

  /**
   * 根据 IP 获取地理位置
   */
  static getLocation(ip: string): string {
    // 本地 IP 直接返回
    if (this.isLocalIp(ip)) {
      return '内网IP';
    }

    try {
      const geo = geoip.lookup(ip);
      if (!geo) {
        return '未知';
      }

      // 中国城市映射
      const cityMap: Record<string, string> = {
        'Beijing': '北京',
        'Shanghai': '上海',
        'Guangzhou': '广州',
        'Shenzhen': '深圳',
        'Hangzhou': '杭州',
        'Chengdu': '成都',
        'Wuhan': '武汉',
        'Nanjing': '南京',
        'Chongqing': '重庆',
        'Tianjin': '天津',
        'Xi\'an': '西安',
        'Suzhou': '苏州',
      };

      const country = geo.country === 'CN' ? '中国' : geo.country;
      const city = geo.city ? (cityMap[geo.city] || geo.city) : '';
      const region = geo.region || '';

      if (country === '中国') {
        return city ? `${country} ${city}` : `${country} ${region}`;
      }

      return city ? `${country} ${city}` : country;
    } catch (error) {
      return '未知';
    }
  }

  /**
   * 判断是否为本地 IP
   */
  private static isLocalIp(ip: string): boolean {
    if (!ip || ip === '未知') return true;
    
    return (
      ip === 'localhost' ||
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.16.') ||
      ip.startsWith('172.17.') ||
      ip.startsWith('172.18.') ||
      ip.startsWith('172.19.') ||
      ip.startsWith('172.20.') ||
      ip.startsWith('172.21.') ||
      ip.startsWith('172.22.') ||
      ip.startsWith('172.23.') ||
      ip.startsWith('172.24.') ||
      ip.startsWith('172.25.') ||
      ip.startsWith('172.26.') ||
      ip.startsWith('172.27.') ||
      ip.startsWith('172.28.') ||
      ip.startsWith('172.29.') ||
      ip.startsWith('172.30.') ||
      ip.startsWith('172.31.')
    );
  }
}
