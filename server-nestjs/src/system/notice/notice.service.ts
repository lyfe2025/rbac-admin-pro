import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { QueryNoticeDto } from './dto/query-notice.dto';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticeService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryNoticeDto) {
    const where: Prisma.SysNoticeWhereInput = {};
    if (query.noticeTitle) where.noticeTitle = { contains: query.noticeTitle };
    if (query.noticeType) where.noticeType = query.noticeType;
    const pageNum = Number(query.pageNum ?? 1);
    const pageSize = Number(query.pageSize ?? 10);
    const [total, rows] = await Promise.all([
      this.prisma.sysNotice.count({ where }),
      this.prisma.sysNotice.findMany({
        where,
        skip: Number((pageNum - 1) * pageSize),
        take: Number(pageSize),
        orderBy: { noticeId: 'asc' },
      }),
    ]);
    return { total, rows };
  }

  async findOne(noticeId: string) {
    return this.prisma.sysNotice.findUnique({ where: { noticeId: BigInt(noticeId) } });
  }

  async create(dto: CreateNoticeDto) {
    return this.prisma.sysNotice.create({
      data: { ...dto, createTime: new Date() },
    });
  }

  async update(noticeId: string, dto: UpdateNoticeDto) {
    const notice = await this.findOne(noticeId);
    if (!notice) throw new BadRequestException('公告不存在');
    return this.prisma.sysNotice.update({
      where: { noticeId: BigInt(noticeId) },
      data: { ...dto, updateTime: new Date() },
    });
  }

  async remove(noticeIds: string[]) {
    await this.prisma.sysNotice.deleteMany({
      where: { noticeId: { in: noticeIds.map(id => BigInt(id)) } },
    });
    return {};
  }
}
