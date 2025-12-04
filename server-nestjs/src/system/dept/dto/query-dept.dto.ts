import { IsOptional, IsString } from 'class-validator';

export class QueryDeptDto {
  @IsOptional()
  @IsString()
  deptName?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
