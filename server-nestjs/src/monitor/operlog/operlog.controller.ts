import { Controller, Get, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { OperlogService } from './operlog.service';
import { QueryOperLogDto } from './dto/query-operlog.dto';

@UseGuards(JwtAuthGuard)
@Controller('monitor/operlog')
export class OperlogController {
  constructor(private readonly service: OperlogService) {}

  @Get()
  list(@Query() query: QueryOperLogDto) {
    return this.service.findAll(query);
  }

  @Delete()
  remove(@Query('ids') ids: string) {
    const operIds = ids ? ids.split(',') : [];
    return this.service.remove(operIds);
  }

  @Get('clean')
  clean() {
    return this.service.clean();
  }
}
