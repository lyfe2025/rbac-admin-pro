import { IsOptional, IsString } from 'class-validator';

export class QueryOperLogDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  operName?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  pageNum?: number;

  @IsOptional()
  pageSize?: number;
}
