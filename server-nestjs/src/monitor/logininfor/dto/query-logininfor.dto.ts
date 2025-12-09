import { IsOptional, IsString, IsDateString } from 'class-validator';

export class QueryLogininforDto {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  ipaddr?: string;

  @IsOptional()
  @IsDateString()
  beginTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  pageNum?: number;

  @IsOptional()
  pageSize?: number;
}
