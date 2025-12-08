import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OnlineService } from './online.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { QueryOnlineDto } from './dto/query-online.dto';

/**
 * 在线用户接口
 */
@UseGuards(JwtAuthGuard)
@Controller('monitor/online')
export class OnlineController {
  constructor(private readonly onlineService: OnlineService) {}

  @Get('list')
  list(@Query() query: QueryOnlineDto) {
    return this.onlineService.list(query);
  }

  @Delete(':token')
  async remove(@Param('token') token: string) {
    await this.onlineService.remove(token);
    return { removed: true };
  }
}
