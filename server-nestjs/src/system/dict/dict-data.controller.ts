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
import { DictDataService } from './dict-data.service';
import { QueryDictDataDto } from './dto/query-dict-data.dto';
import { CreateDictDataDto } from './dto/create-dict-data.dto';
import { UpdateDictDataDto } from './dto/update-dict-data.dto';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('system/dict/data')
export class DictDataController {
  constructor(private readonly service: DictDataService) {}

  @Get()
  @RequirePermission('system:dict:list')
  list(@Query() query: QueryDictDataDto) {
    return this.service.list(query);
  }

  @Get(':dictCode')
  @RequirePermission('system:dict:query')
  get(@Param('dictCode') dictCode: string) {
    return this.service.get(dictCode);
  }

  @Post()
  @RequirePermission('system:dict:add')
  create(@Body() dto: CreateDictDataDto) {
    return this.service.create(dto);
  }

  @Put(':dictCode')
  @RequirePermission('system:dict:edit')
  update(@Param('dictCode') dictCode: string, @Body() dto: UpdateDictDataDto) {
    return this.service.update(dictCode, dto);
  }

  @Delete()
  @RequirePermission('system:dict:remove')
  remove(@Query('ids') ids: string) {
    const dictCodes = ids ? ids.split(',') : [];
    return this.service.remove(dictCodes);
  }
}
