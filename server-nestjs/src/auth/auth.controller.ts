import { Body, Controller, Post, Req, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request } from 'express';
import { OnlineService } from '../monitor/online/online.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { CaptchaService } from './captcha.service';
import { BusinessException } from '../common/exceptions';
import { ErrorCode } from '../common/enums';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private onlineService: OnlineService,
    private tokenBlacklist: TokenBlacklistService,
    private captchaService: CaptchaService,
  ) {}

  @Get('captchaImage')
  @ApiOperation({
    summary: '获取验证码',
    description: '获取图形验证码，返回 base64 编码的图片和 uuid',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getCaptchaImage() {
    const captchaEnabled = await this.captchaService.isCaptchaEnabled();
    if (!captchaEnabled) {
      return { captchaEnabled: false };
    }
    const { uuid, img } = await this.captchaService.generate();
    return { captchaEnabled: true, uuid, img };
  }

  @Post('login')
  @ApiOperation({
    summary: '用户登录',
    description: '用户名密码登录获取 JWT Token',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    // 检查验证码
    const captchaEnabled = await this.captchaService.isCaptchaEnabled();
    if (captchaEnabled) {
      if (!loginDto.code || !loginDto.uuid) {
        throw new BusinessException(ErrorCode.CAPTCHA_ERROR, '验证码不能为空');
      }
      const valid = await this.captchaService.verify(
        loginDto.uuid,
        loginDto.code,
      );
      if (!valid) {
        throw new BusinessException(
          ErrorCode.CAPTCHA_ERROR,
          '验证码错误或已过期',
        );
      }
    }

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
