import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OperationLogInterceptor } from '../../common/interceptors/operation-log.interceptor';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => ConfigModule)],
  controllers: [UserController],
  providers: [UserService, OperationLogInterceptor],
  exports: [UserService],
})
export class UserModule {}
