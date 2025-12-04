import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../system/user/user.service';
import { LoginDto } from './dto/login.dto';
import { LoggerService } from '../common/logger/logger.service';
import { BusinessException } from '../common/exceptions';
import { ErrorCode } from '../common/enums';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private logger: LoggerService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    this.logger.debug(`Login attempt for user: ${username}`, 'AuthService');
    
    const user = await this.userService.findByUsername(username);

    if (!user) {
      this.logger.warn(`Login failed: User not found - ${username}`, 'AuthService');
      throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, '账号或密码错误');
    }

    // 验证密码
    let isMatch = false;
    if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
      // 兼容明文密码 (开发阶段)
      if (!isMatch && user.password === password) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      this.logger.warn(`Login failed: Invalid password - ${username}`, 'AuthService');
      throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, '账号或密码错误');
    }

    // 签发 Token
    // 注意：BigInt 无法被 JSON.stringify，需要转换为 string
    const payload = { 
      sub: user.userId.toString(), 
      username: user.userName 
    };
    
    this.logger.log(`User logged in successfully: ${username} (ID: ${user.userId})`, 'AuthService');
    
    return {
      token: this.jwtService.sign(payload),
    };
  }

  logout() {
    // JWT 是无状态的，后端其实不需要做特殊处理
    // 如果需要使 token 失效，需要引入 Redis 黑名单机制
    this.logger.debug('User logout', 'AuthService');
    return {};
  }
}
