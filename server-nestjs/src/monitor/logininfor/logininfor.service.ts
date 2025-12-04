import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryLogininforDto } from './dto/query-logininfor.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LogininforService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryLogininforDto) {
    const where: Prisma.SysLoginLogWhereInput = {};
    if (query.userName) where.userName = { contains: query.userName };
    if (query.status) where.status = query.status;

    const pageNum = Number(query.pageNum ?? 1);
    const pageSize = Number(query.pageSize ?? 10);

    const [total, rows] = await Promise.all([
      this.prisma.sysLoginLog.count({ where }),
      this.prisma.sysLoginLog.findMany({
        where,
        skip: Number((pageNum - 1) * pageSize),
        take: Number(pageSize),
        orderBy: { infoId: 'asc' },
      }),
    ]);
    return { total, rows };
  }

  async remove(infoIds: string[]) {
    await this.prisma.sysLoginLog.deleteMany({
      where: { infoId: { in: infoIds.map(id => BigInt(id)) } },
    });
    return {};
  }

  async clean() {
    await this.prisma.sysLoginLog.deleteMany({});
    return {};
  }
}
