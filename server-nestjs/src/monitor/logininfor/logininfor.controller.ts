import { Controller, Get, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { LogininforService } from './logininfor.service';
import { QueryLogininforDto } from './dto/query-logininfor.dto';

@UseGuards(JwtAuthGuard)
@Controller('monitor/logininfor')
export class LogininforController {
  constructor(private readonly service: LogininforService) {}

  @Get()
  list(@Query() query: QueryLogininforDto) {
    return this.service.findAll(query);
  }

  @Delete()
  remove(@Query('ids') ids: string) {
    const infoIds = ids ? ids.split(',') : [];
    return this.service.remove(infoIds);
  }

  @Get('clean')
  clean() {
    return this.service.clean();
  }
}
