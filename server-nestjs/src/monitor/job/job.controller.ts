import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { JobService } from './job.service';
import { QueryJobDto } from './dto/query-job.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@UseGuards(JwtAuthGuard)
@Controller('monitor/job')
export class JobController {
  constructor(private readonly service: JobService) {}

  @Get()
  list(@Query() query: QueryJobDto) {
    return this.service.findAll(query);
  }

  @Get(':jobId')
  get(@Param('jobId') jobId: string) {
    return this.service.findOne(jobId);
  }

  @Post()
  create(@Body() dto: CreateJobDto) {
    return this.service.create(dto);
  }

  @Put(':jobId')
  update(@Param('jobId') jobId: string, @Body() dto: UpdateJobDto) {
    return this.service.update(jobId, dto);
  }

  @Delete()
  remove(@Query('ids') ids: string) {
    const jobIds = ids ? ids.split(',') : [];
    return this.service.remove(jobIds);
  }

  @Get('run')
  run(@Query('jobId') jobId: string, @Query('jobGroup') jobGroup: string) {
    return this.service.run(jobId, jobGroup);
  }

  @Put('changeStatus')
  changeStatus(@Body() body: { jobId: string; status: string }) {
    return this.service.changeStatus(body.jobId, body.status);
  }
}
