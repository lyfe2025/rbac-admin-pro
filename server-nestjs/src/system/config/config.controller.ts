import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ConfigService } from './config.service';
import { QueryConfigDto } from './dto/query-config.dto';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@UseGuards(JwtAuthGuard)
@Controller('system/config')
export class ConfigController {
  constructor(private readonly service: ConfigService) {}

  @Get()
  list(@Query() query: QueryConfigDto) {
    return this.service.findAll(query);
  }

  @Get(':configId')
  get(@Param('configId') configId: string) {
    return this.service.findOne(configId);
  }

  @Post()
  create(@Body() dto: CreateConfigDto) {
    return this.service.create(dto);
  }

  @Put(':configId')
  update(@Param('configId') configId: string, @Body() dto: UpdateConfigDto) {
    return this.service.update(configId, dto);
  }

  @Delete()
  remove(@Query('ids') ids: string) {
    const configIds = ids ? ids.split(',') : [];
    return this.service.remove(configIds);
  }

  @Get('refreshCache')
  refresh() {
    return this.service.refreshCache();
  }
}
