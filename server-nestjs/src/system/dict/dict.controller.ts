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
import { DictService } from './dict.service';
import { QueryDictTypeDto } from './dto/query-dict-type.dto';
import { CreateDictTypeDto } from './dto/create-dict-type.dto';
import { UpdateDictTypeDto } from './dto/update-dict-type.dto';

@UseGuards(JwtAuthGuard)
@Controller('system/dict/type')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Get()
  list(@Query() query: QueryDictTypeDto) {
    return this.dictService.listTypes(query);
  }

  @Get(':dictId')
  get(@Param('dictId') dictId: string) {
    return this.dictService.getType(dictId);
  }

  @Post()
  create(@Body() dto: CreateDictTypeDto) {
    return this.dictService.createType(dto);
  }

  @Put(':dictId')
  update(@Param('dictId') dictId: string, @Body() dto: UpdateDictTypeDto) {
    return this.dictService.updateType(dictId, dto);
  }

  @Delete()
  remove(@Query('ids') ids: string) {
    const dictIds = ids ? ids.split(',') : [];
    return this.dictService.removeTypes(dictIds);
  }
}
