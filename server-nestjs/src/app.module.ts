import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './system/user/user.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './system/menu/menu.module';
import { DeptModule } from './system/dept/dept.module';
import { RoleModule } from './system/role/role.module';
import { DictModule } from './system/dict/dict.module';
import { SysConfigModule } from './system/config/config.module';
import { NoticeModule } from './system/notice/notice.module';
import { OperLogInterceptor } from './common/interceptors/oper-log.interceptor';
import { PostModule } from './system/post/post.module';
import { MonitorModule } from './monitor/monitor.module';
import { LoggerModule } from './common/logger/logger.module';
import { HttpLoggerMiddleware } from './common/middleware/http-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局可用
    }),
    LoggerModule,
    PrismaModule,
    UserModule,
    AuthModule,
    MenuModule,
    DeptModule,
    RoleModule,
    DictModule,
    SysConfigModule,
    NoticeModule,
    MonitorModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: OperLogInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
