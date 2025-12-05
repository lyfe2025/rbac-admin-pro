import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OperationLogInterceptor } from '../../common/interceptors/operation-log.interceptor';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, OperationLogInterceptor],
  exports: [UserService],
})
export class UserModule {}
