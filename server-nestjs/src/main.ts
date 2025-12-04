import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';

// 全局 BigInt 序列化支持
// 解决 "TypeError: Do not know how to serialize a BigInt" 错误
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // 缓冲日志直到自定义 logger 就绪
  });

  // 使用自定义日志服务
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // 全局前缀
  // app.setGlobalPrefix('api'); // 前端 .env 配置为 /api，如果我们不使用代理重写，可能需要这个配置

  // 全局参数校验管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剔除 DTO 中未定义的属性
      transform: true, // 自动类型转换
    }),
  );

  // 全局拦截器与过滤器
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // 启用 CORS (跨域资源共享)
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on: http://0.0.0.0:${port}`, 'Bootstrap');
}
void bootstrap();
