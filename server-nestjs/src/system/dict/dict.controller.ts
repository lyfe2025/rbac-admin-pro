import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/permission.decorator';
import { DictService } from './dict.service';
import { QueryDictTypeDto } from './dto/query-dict-type.dto';
import { CreateDictTypeDto } from './dto/create-dict-type.dto';
import { UpdateDictTypeDto } from './dto/update-dict-type.dto';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('system/dict/type')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Get()
  @RequirePermission('system:dict:list')
  list(@Query() query: QueryDictTypeDto) {
    return this.dictService.listTypes(query);
  }

  @Get(':dictId')
  @RequirePermission('system:dict:query')
  get(@Param('dictId') dictId: string) {
    return this.dictService.getType(dictId);
  }

  @Post()
  @RequirePermission('system:dict:add')
  create(@Body() dto: CreateDictTypeDto) {
    return this.dictService.createType(dto);
  }

  @Put(':dictId')
  @RequirePermission('system:dict:edit')
  update(@Param('dictId') dictId: string, @Body() dto: UpdateDictTypeDto) {
    return this.dictService.updateType(dictId, dto);
  }

  @Delete()
  @RequirePermission('system:dict:remove')
  remove(@Query('ids') ids: string) {
    const dictIds = ids ? ids.split(',') : [];
    return this.dictService.removeTypes(dictIds);
  }
}
