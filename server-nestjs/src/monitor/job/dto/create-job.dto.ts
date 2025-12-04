import { IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  jobName!: string;

  @IsString()
  jobGroup!: string;

  @IsString()
  invokeTarget!: string;

  @IsString()
  cronExpression!: string;

  @IsString()
  misfirePolicy!: string;

  @IsString()
  concurrent!: string;

  @IsString()
  status!: string;

  @IsString()
  remark?: string;
}
