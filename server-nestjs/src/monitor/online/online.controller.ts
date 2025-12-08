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
import { TokenBlacklistService } from '../../auth/token-blacklist.service';

/**
 * 在线用户接口
 */
@UseGuards(JwtAuthGuard)
@Controller('monitor/online')
export class OnlineController {
  constructor(
    private readonly onlineService: OnlineService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  @Get('list')
  list(@Query() query: QueryOnlineDto) {
    return this.onlineService.list(query);
  }

  @Delete(':token')
  async remove(@Param('token') token: string) {
    // 将 token 加入黑名单，使其立即失效
    await this.tokenBlacklistService.add(token);
    // 从在线用户列表中移除
    await this.onlineService.remove(token);
    return { removed: true };
  }
}
