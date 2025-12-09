import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/permission.decorator';
import { ServerService } from './server.service';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('monitor/server')
export class ServerController {
  constructor(private readonly service: ServerService) {}

  @Get()
  @RequirePermission('monitor:server:list')
  get() {
    return this.service.getInfo();
  }
}
