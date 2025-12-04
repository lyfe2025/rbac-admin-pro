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
import { DictDataService } from './dict-data.service';
import { QueryDictDataDto } from './dto/query-dict-data.dto';
import { CreateDictDataDto } from './dto/create-dict-data.dto';
import { UpdateDictDataDto } from './dto/update-dict-data.dto';

@UseGuards(JwtAuthGuard)
@Controller('system/dict/data')
export class DictDataController {
  constructor(private readonly service: DictDataService) {}

  @Get()
  list(@Query() query: QueryDictDataDto) {
    return this.service.list(query);
  }

  @Get(':dictCode')
  get(@Param('dictCode') dictCode: string) {
    return this.service.get(dictCode);
  }

  @Post()
  create(@Body() dto: CreateDictDataDto) {
    return this.service.create(dto);
  }

  @Put(':dictCode')
  update(@Param('dictCode') dictCode: string, @Body() dto: UpdateDictDataDto) {
    return this.service.update(dictCode, dto);
  }

  @Delete()
  remove(@Query('ids') ids: string) {
    const dictCodes = ids ? ids.split(',') : [];
    return this.service.remove(dictCodes);
  }
}
