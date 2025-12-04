import { IsOptional, IsString } from 'class-validator';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  jobName?: string;

  @IsOptional()
  @IsString()
  jobGroup?: string;

  @IsOptional()
  @IsString()
  invokeTarget?: string;

  @IsOptional()
  @IsString()
  cronExpression?: string;

  @IsOptional()
  @IsString()
  misfirePolicy?: string;

  @IsOptional()
  @IsString()
  concurrent?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}
