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
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/permission.decorator';
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

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('system:config:list')
  @Get()
  list(@Query() query: QueryConfigDto) {
    return this.service.findAll(query);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('system:config:query')
  @Get(':configId')
  get(@Param('configId') configId: string) {
    return this.service.findOne(configId);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('system:config:add')
  @Post()
  create(@Body() dto: CreateConfigDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('system:config:edit')
  @Put(':configId')
  update(@Param('configId') configId: string, @Body() dto: UpdateConfigDto) {
    return this.service.update(configId, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('system:config:remove')
  @Delete()
  remove(@Query('ids') ids: string) {
    const configIds = ids ? ids.split(',') : [];
    return this.service.remove(configIds);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('system:config:edit')
  @Get('refreshCache')
  refresh() {
    return this.service.refreshCache();
  }
}
