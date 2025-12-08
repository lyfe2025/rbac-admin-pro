import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryJobDto } from './dto/query-job.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryJobDto) {
    const where: Prisma.SysJobWhereInput = {};
    if (query.jobName) where.jobName = { contains: query.jobName };
    if (query.jobGroup) where.jobGroup = { contains: query.jobGroup };
    if (query.status) where.status = query.status;
    const pageNum = Number(query.pageNum ?? 1);
    const pageSize = Number(query.pageSize ?? 10);

    const [total, rows] = await Promise.all([
      this.prisma.sysJob.count({ where }),
      this.prisma.sysJob.findMany({
        where,
        skip: Number((pageNum - 1) * pageSize),
        take: Number(pageSize),
        orderBy: { jobId: 'asc' },
      }),
    ]);
    return { total, rows };
  }

  async findOne(jobId: string) {
    return this.prisma.sysJob.findUnique({ where: { jobId: BigInt(jobId) } });
  }

  async create(dto: CreateJobDto) {
    return this.prisma.sysJob.create({
      data: { ...dto, createTime: new Date() },
    });
  }

  async update(jobId: string, dto: UpdateJobDto) {
    const job = await this.findOne(jobId);
    if (!job) throw new BadRequestException('任务不存在');
    return this.prisma.sysJob.update({
      where: { jobId: BigInt(jobId) },
      data: { ...dto, updateTime: new Date() },
    });
  }

  async remove(jobIds: string[]) {
    await this.prisma.sysJob.deleteMany({
      where: { jobId: { in: jobIds.map((id) => BigInt(id)) } },
    });
    return {};
  }

  async run(jobId: string, jobGroup: string) {
    await this.prisma.sysJob.update({
      where: { jobId: BigInt(jobId) },
      data: { remark: `手动执行于 ${new Date().toISOString()}(${jobGroup})` },
    });
    return {};
  }

  async changeStatus(jobId: string, status: string) {
    return this.prisma.sysJob.update({
      where: { jobId: BigInt(jobId) },
      data: { status, updateTime: new Date() },
    });
  }
}
