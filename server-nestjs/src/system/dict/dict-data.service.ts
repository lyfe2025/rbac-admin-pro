import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { QueryDictDataDto } from './dto/query-dict-data.dto';
import { CreateDictDataDto } from './dto/create-dict-data.dto';
import { UpdateDictDataDto } from './dto/update-dict-data.dto';

@Injectable()
export class DictDataService {
  constructor(private prisma: PrismaService) {}

  async list(query: QueryDictDataDto) {
    const where: Prisma.SysDictDataWhereInput = {};
    if (query.dictType) where.dictType = { contains: query.dictType };
    if (query.dictLabel) where.dictLabel = { contains: query.dictLabel };
    if (query.status) where.status = query.status;
    const pageNum = Number(query.pageNum ?? 1);
    const pageSize = Number(query.pageSize ?? 10);
    const [total, rows] = await Promise.all([
      this.prisma.sysDictData.count({ where }),
      this.prisma.sysDictData.findMany({
        where,
        skip: Number((pageNum - 1) * pageSize),
        take: Number(pageSize),
        orderBy: [{ dictSort: 'asc' }, { dictCode: 'asc' }],
      }),
    ]);
    return { total, rows };
  }

  async get(dictCode: string) {
    return this.prisma.sysDictData.findUnique({ where: { dictCode: BigInt(dictCode) } });
  }

  async create(dto: CreateDictDataDto) {
    // 可选唯一性校验：同 dictType + dictValue 唯一
    const exist = await this.prisma.sysDictData.findFirst({
      where: { dictType: dto.dictType, dictValue: dto.dictValue },
    });
    if (exist) throw new BadRequestException('字典值已存在');
    return this.prisma.sysDictData.create({
      data: {
        ...dto,
        isDefault: dto.isDefault ?? 'N',
      },
    });
  }

  async update(dictCode: string, dto: UpdateDictDataDto) {
    const data = await this.get(dictCode);
    if (!data) throw new BadRequestException('字典数据不存在');
    return this.prisma.sysDictData.update({
      where: { dictCode: BigInt(dictCode) },
      data: { ...dto },
    });
  }

  async remove(dictCodes: string[]) {
    await this.prisma.sysDictData.deleteMany({
      where: { dictCode: { in: dictCodes.map(id => BigInt(id)) } },
    });
    return {};
  }
}
