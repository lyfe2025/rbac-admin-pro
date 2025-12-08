import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request } from 'express';
import { OnlineService } from '../monitor/online/online.service';
import { TokenBlacklistService } from './token-blacklist.service';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private onlineService: OnlineService,
    private tokenBlacklist: TokenBlacklistService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: '用户登录',
    description: '用户名密码登录获取 JWT Token',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    // 登录日志已在 AuthService 中记录,这里只处理在线用户
    const res = await this.authService.login(loginDto);

    // 解析 User-Agent
    const userAgent = req.headers['user-agent'] || '';
    const { browser, os } = this.parseUserAgent(userAgent);

    // 注册在线用户
    await this.onlineService.add({
      token: res.token,
      userName: loginDto.username,
      ipaddr: req.ip || '',
      loginTime: new Date(),
      browser,
      os,
    });

    return res;
  }

  /**
   * 解析 User-Agent
   */
  private parseUserAgent(userAgent: string): { browser: string; os: string } {
    let browser = 'Unknown';
    let os = 'Unknown';

    // 解析浏览器
    if (userAgent.includes('Edg')) browser = 'Edge';
    else if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Opera')) browser = 'Opera';

    // 解析操作系统
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac OS')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return { browser, os };
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    const auth = req.headers['authorization'];
    const token = auth?.startsWith('Bearer ') ? auth.substring(7) : '';
    if (token) {
      await this.onlineService.remove(token);
      void this.tokenBlacklist.add(token);
    }
    return this.authService.logout();
  }
}
