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
import { NoticeService } from './notice.service';
import { QueryNoticeDto } from './dto/query-notice.dto';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@UseGuards(JwtAuthGuard)
@Controller('system/notice')
export class NoticeController {
  constructor(private readonly service: NoticeService) {}

  @Get()
  list(@Query() query: QueryNoticeDto) {
    return this.service.findAll(query);
  }

  @Get(':noticeId')
  get(@Param('noticeId') noticeId: string) {
    return this.service.findOne(noticeId);
  }

  @Post()
  create(@Body() dto: CreateNoticeDto) {
    return this.service.create(dto);
  }

  @Put(':noticeId')
  update(@Param('noticeId') noticeId: string, @Body() dto: UpdateNoticeDto) {
    return this.service.update(noticeId, dto);
  }

  @Delete()
  remove(@Query('ids') ids: string) {
    const noticeIds = ids ? ids.split(',') : [];
    return this.service.remove(noticeIds);
  }
}
