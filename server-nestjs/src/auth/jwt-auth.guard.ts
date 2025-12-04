import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenBlacklistService } from './token-blacklist.service';
import type { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly moduleRef: ModuleRef) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ok = (await super.canActivate(context)) as boolean;
    const req = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string> }>();
    const auth = req.headers?.['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.substring(7) : '';
    const blacklist = this.moduleRef.get(TokenBlacklistService, {
      strict: false,
    });
    if (blacklist && token && (await blacklist.isBlacklisted(token))) {
      throw new UnauthorizedException('Token 已失效');
    }
    return ok;
  }
}
