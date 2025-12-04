import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { OnlineService } from './online.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * 在线用户接口
 */
@UseGuards(JwtAuthGuard)
@Controller('monitor/online')
export class OnlineController {
  constructor(private readonly onlineService: OnlineService) {}

  @Get('list')
  list() {
    return this.onlineService.list();
  }

  @Delete(':token')
  remove(@Param('token') token: string) {
    this.onlineService.remove(token);
    return { removed: true };
  }
}
