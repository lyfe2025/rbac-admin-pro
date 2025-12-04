import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

// 全局 BigInt 序列化支持
// 解决 "TypeError: Do not know how to serialize a BigInt" 错误
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  app.useGlobalFilters(new AllExceptionsFilter());

  // 启用 CORS (跨域资源共享)
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
void bootstrap();
