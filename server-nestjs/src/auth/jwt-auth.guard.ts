import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from './token-blacklist.service';
import { SecurityConfigService } from './security-config.service';
import type { ExecutionContext } from '@nestjs/common';
import type { Response } from 'express';

interface JwtPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly moduleRef: ModuleRef) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ok = (await super.canActivate(context)) as boolean;
    const req = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string>; user?: JwtPayload }>();
    const res = context.switchToHttp().getResponse<Response>();
    const auth = req.headers?.['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.substring(7) : '';

    const blacklist = this.moduleRef.get(TokenBlacklistService, {
      strict: false,
    });
    if (blacklist && token && (await blacklist.isBlacklisted(token))) {
      throw new UnauthorizedException('Token 已失效，请重新登录');
    }

    // 滑动过期：检查 Token 是否快过期，如果是则刷新
    await this.checkAndRefreshToken(req.user, res);

    return ok;
  }

  /**
   * 检查并刷新 Token（滑动过期）
   * 刷新阈值为会话超时时间的 1/6（如 30 分钟超时则剩余 5 分钟时刷新）
   */
  private async checkAndRefreshToken(
    user: JwtPayload | undefined,
    res: Response,
  ): Promise<void> {
    if (!user?.exp) return;

    try {
      const jwtService = this.moduleRef.get(JwtService, { strict: false });
      const securityConfig = this.moduleRef.get(SecurityConfigService, {
        strict: false,
      });

      if (!jwtService || !securityConfig) return;

      const sessionTimeout = await securityConfig.getSessionTimeoutSeconds();
      // 刷新阈值为会话超时时间的 1/6
      const refreshThreshold = Math.floor(sessionTimeout / 6);

      const now = Math.floor(Date.now() / 1000);
      const remaining = user.exp - now;

      // 如果剩余时间少于阈值，签发新 Token
      if (remaining > 0 && remaining < refreshThreshold) {
        const newToken = jwtService.sign(
          { sub: user.sub, username: user.username },
          { expiresIn: sessionTimeout },
        );
        // 通过响应头返回新 Token
        res.setHeader('X-New-Token', newToken);
      }
    } catch {
      // 刷新失败不影响正常请求
    }
  }
}
