import { IsOptional, IsString } from 'class-validator';

export class QueryLogininforDto {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  pageNum?: number;

  @IsOptional()
  pageSize?: number;
}
