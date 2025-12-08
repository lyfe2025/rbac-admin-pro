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

@Controller('system/config')
export class ConfigController {
  constructor(private readonly service: ConfigService) {}

  /**
   * 获取网站公开配置（无需登录）
   */
  @Get('site')
  async getSiteConfig(): Promise<{
    name: string;
    description: string;
    logo: string;
    favicon: string;
    copyright: string;
    icp: string;
    loginPath: string;
  }> {
    return await this.service.getSiteConfig();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Query() query: QueryConfigDto) {
    return this.service.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':configId')
  get(@Param('configId') configId: string) {
    return this.service.findOne(configId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateConfigDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':configId')
  update(@Param('configId') configId: string, @Body() dto: UpdateConfigDto) {
    return this.service.update(configId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@Query('ids') ids: string) {
    const configIds = ids ? ids.split(',') : [];
    return this.service.remove(configIds);
  }

  @UseGuards(JwtAuthGuard)
  @Get('refreshCache')
  refresh() {
    return this.service.refreshCache();
  }
}
