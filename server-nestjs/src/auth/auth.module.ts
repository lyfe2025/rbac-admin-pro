import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../system/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { MonitorModule } from '../monitor/monitor.module';
import { TokenBlacklistService } from './token-blacklist.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RedisModule } from '../redis/redis.module';
import { CaptchaService } from './captcha.service';
import { TwoFactorService } from './two-factor.service';
import { SecurityConfigService } from './security-config.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    MonitorModule,
    RedisModule,
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'super-secret-key',
        signOptions: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ||
            '24h') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    TokenBlacklistService,
    JwtAuthGuard,
    CaptchaService,
    TwoFactorService,
    SecurityConfigService,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
