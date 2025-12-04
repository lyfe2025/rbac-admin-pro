import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request } from 'express';
import { LoginLogService } from '../monitor/login-log/login-log.service';
import { OnlineService } from '../monitor/online/online.service';
import { TokenBlacklistService } from './token-blacklist.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private loginLogService: LoginLogService,
    private onlineService: OnlineService,
    private tokenBlacklist: TokenBlacklistService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    try {
      const res = await this.authService.login(loginDto);
      // 登录成功记录日志
      await this.loginLogService.record({
        userName: loginDto.username,
        ipaddr: req.ip || '',
        ua: req.headers['user-agent'],
        status: '0',
        msg: '登录成功',
      });
      // 注册在线用户
      this.onlineService.add({
        token: res.token,
        userName: loginDto.username,
        ipaddr: req.ip || '',
        loginTime: new Date(),
      });
      return res;
    } catch (e) {
      const message = (() => {
        try {
          return (e as { message?: string }).message ?? '登录失败';
        } catch {
          return '登录失败';
        }
      })();
      // 登录失败记录日志
      await this.loginLogService.record({
        userName: loginDto.username,
        ipaddr: req.ip || '',
        ua: req.headers['user-agent'],
        status: '1',
        msg: message,
      });
      throw e;
    }
  }

  @Post('logout')
  logout(@Req() req: Request) {
    const auth = req.headers['authorization'];
    const token = auth?.startsWith('Bearer ') ? auth.substring(7) : '';
    if (token) {
      this.onlineService.remove(token);
      void this.tokenBlacklist.add(token);
    }
    return this.authService.logout();
  }
}
