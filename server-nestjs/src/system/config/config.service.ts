import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryConfigDto } from './dto/query-config.dto';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryConfigDto) {
    const where: Prisma.SysConfigWhereInput = {};
    if (query.configName) where.configName = { contains: query.configName };
    if (query.configKey) where.configKey = { contains: query.configKey };
    if (query.configType) where.configType = query.configType;
    const pageNum = Number(query.pageNum ?? 1);
    const pageSize = Number(query.pageSize ?? 10);
    const [total, rows] = await Promise.all([
      this.prisma.sysConfig.count({ where }),
      this.prisma.sysConfig.findMany({
        where,
        skip: Number((pageNum - 1) * pageSize),
        take: Number(pageSize),
        orderBy: { configId: 'asc' },
      }),
    ]);
    return { total, rows };
  }

  async findOne(configId: string) {
    return this.prisma.sysConfig.findUnique({ where: { configId: BigInt(configId) } });
  }

  async create(dto: CreateConfigDto) {
    const exist = await this.prisma.sysConfig.findFirst({
      where: { configKey: dto.configKey },
    });
    if (exist) throw new BadRequestException('参数键已存在');
    return this.prisma.sysConfig.create({
      data: { ...dto, createTime: new Date() },
    });
  }

  async update(configId: string, dto: UpdateConfigDto) {
    const config = await this.findOne(configId);
    if (!config) throw new BadRequestException('参数不存在');
    return this.prisma.sysConfig.update({
      where: { configId: BigInt(configId) },
      data: { ...dto, updateTime: new Date() },
    });
  }

  async remove(configIds: string[]) {
    await this.prisma.sysConfig.deleteMany({
      where: { configId: { in: configIds.map(id => BigInt(id)) } },
    });
    return {};
  }

  async refreshCache() {
    await Promise.resolve();
    return {};
  }
}
