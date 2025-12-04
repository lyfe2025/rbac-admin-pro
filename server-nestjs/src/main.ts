import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局前缀
  // app.setGlobalPrefix('api'); // 前端 .env 配置为 /api，如果我们不使用代理重写，可能需要这个配置

  // 全局拦截器与过滤器
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // 启用 CORS (跨域资源共享)
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
