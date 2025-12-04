import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryPostDto } from './dto/query-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryPostDto) {
    const where: Prisma.SysPostWhereInput = {};
    if (query.postCode) where.postCode = { contains: query.postCode };
    if (query.postName) where.postName = { contains: query.postName };
    if (query.status) where.status = query.status;

    const pageNum = Number(query.pageNum ?? 1);
    const pageSize = Number(query.pageSize ?? 10);
    const [total, rows] = await Promise.all([
      this.prisma.sysPost.count({ where }),
      this.prisma.sysPost.findMany({
        where,
        skip: Number((pageNum - 1) * pageSize),
        take: Number(pageSize),
        orderBy: [{ postSort: 'asc' }, { postId: 'asc' }],
      }),
    ]);
    return { total, rows };
  }

  async findOne(postId: string) {
    return this.prisma.sysPost.findUnique({ where: { postId: BigInt(postId) } });
  }

  async create(dto: CreatePostDto) {
    const exist = await this.prisma.sysPost.findFirst({
      where: { postCode: dto.postCode },
    });
    if (exist) throw new BadRequestException('岗位编码已存在');
    return this.prisma.sysPost.create({
      data: { ...dto, createTime: new Date() },
    });
  }

  async update(postId: string, dto: UpdatePostDto) {
    const post = await this.findOne(postId);
    if (!post) throw new BadRequestException('岗位不存在');
    return this.prisma.sysPost.update({
      where: { postId: BigInt(postId) },
      data: { ...dto, updateTime: new Date() },
    });
  }

  async remove(postIds: string[]) {
    if (!postIds || postIds.length === 0)
      throw new BadRequestException('参数为空');
    await this.prisma.sysPost.deleteMany({
      where: { postId: { in: postIds.map(id => BigInt(id)) } },
    });
    return {};
  }
}
