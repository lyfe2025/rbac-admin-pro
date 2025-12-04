import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryDictTypeDto } from './dto/query-dict-type.dto';
import { CreateDictTypeDto } from './dto/create-dict-type.dto';
import { UpdateDictTypeDto } from './dto/update-dict-type.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DictService {
  constructor(private prisma: PrismaService) {}

  async listTypes(query: QueryDictTypeDto) {
    const { dictName, dictType, status } = query;
    const pageNum = Number(query.pageNum ?? 1);
    const pageSize = Number(query.pageSize ?? 10);
    const where: Prisma.SysDictTypeWhereInput = {};
    if (dictName) where.dictName = { contains: dictName };
    if (dictType) where.dictType = { contains: dictType };
    if (status) where.status = status;

    const [total, rows] = await Promise.all([
      this.prisma.sysDictType.count({ where }),
      this.prisma.sysDictType.findMany({
        where,
        skip: Number((pageNum - 1) * pageSize),
        take: Number(pageSize),
        orderBy: { dictId: 'asc' },
      }),
    ]);

    return { total, rows };
  }

  async getType(dictId: string) {
    return this.prisma.sysDictType.findUnique({ where: { dictId: BigInt(dictId) } });
  }

  async createType(dto: CreateDictTypeDto) {
    // 唯一约束：dictType 不重复
    const exist = await this.prisma.sysDictType.findFirst({
      where: { dictType: dto.dictType },
    });
    if (exist) throw new BadRequestException('字典类型已存在');

    return this.prisma.sysDictType.create({
      data: { ...dto, status: dto.status ?? '0', createTime: new Date() },
    });
  }

  async updateType(dictId: string, dto: UpdateDictTypeDto) {
    const type = await this.getType(dictId);
    if (!type) throw new BadRequestException('字典类型不存在');

    return this.prisma.sysDictType.update({
      where: { dictId: BigInt(dictId) },
      data: { ...dto, updateTime: new Date() },
    });
  }

  async removeTypes(dictIds: string[]) {
    if (!dictIds || dictIds.length === 0)
      throw new BadRequestException('参数为空');
    await this.prisma.sysDictType.deleteMany({
      where: { dictId: { in: dictIds.map(id => BigInt(id)) } },
    });
    return {};
  }
}
