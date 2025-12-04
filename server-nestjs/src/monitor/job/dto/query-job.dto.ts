import { IsOptional, IsString } from 'class-validator';

export class QueryJobDto {
  @IsOptional()
  @IsString()
  jobName?: string;

  @IsOptional()
  @IsString()
  jobGroup?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  pageNum?: number;

  @IsOptional()
  pageSize?: number;
}
