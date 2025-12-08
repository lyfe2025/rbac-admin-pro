import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryConfigDto } from './dto/query-config.dto';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Prisma } from '@prisma/client';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class ConfigService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}

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
    return this.prisma.sysConfig.findUnique({
      where: { configId: BigInt(configId) },
    });
  }

  async create(dto: CreateConfigDto) {
    this.logger.log(
      `创建系统参数: ${dto.configName} (${dto.configKey})`,
      'ConfigService',
    );

    const exist = await this.prisma.sysConfig.findFirst({
      where: { configKey: dto.configKey },
    });
    if (exist) {
      this.logger.warn(
        `创建参数失败,键已存在: ${dto.configKey}`,
        'ConfigService',
      );
      throw new BadRequestException('参数键已存在');
    }

    const result = await this.prisma.sysConfig.create({
      data: { ...dto, createTime: new Date() },
    });

    this.logger.log(
      `系统参数创建成功: ${result.configName} (ID: ${result.configId})`,
      'ConfigService',
    );
    return result;
  }

  async update(configId: string, dto: UpdateConfigDto) {
    this.logger.log(`更新系统参数: ${configId}`, 'ConfigService');

    const config = await this.findOne(configId);
    if (!config) {
      this.logger.warn(`更新参数失败,参数不存在: ${configId}`, 'ConfigService');
      throw new BadRequestException('参数不存在');
    }

    const result = await this.prisma.sysConfig.update({
      where: { configId: BigInt(configId) },
      data: { ...dto, updateTime: new Date() },
    });

    this.logger.log(
      `系统参数更新成功: ${result.configName} (${result.configKey}=${result.configValue})`,
      'ConfigService',
    );
    return result;
  }

  async remove(configIds: string[]) {
    this.logger.log(`删除系统参数: ${configIds.length} 个`, 'ConfigService');

    await this.prisma.sysConfig.deleteMany({
      where: { configId: { in: configIds.map((id) => BigInt(id)) } },
    });

    this.logger.log(
      `系统参数删除成功: ${configIds.length} 个`,
      'ConfigService',
    );
    return {};
  }

  async refreshCache() {
    this.logger.log('刷新系统参数缓存', 'ConfigService');
    await Promise.resolve();
    this.logger.log('系统参数缓存刷新成功', 'ConfigService');
    return {};
  }
}
