import { IsOptional, IsString } from 'class-validator';

export class QueryPostDto {
  @IsOptional()
  @IsString()
  postCode?: string;

  @IsOptional()
  @IsString()
  postName?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  pageNum?: number;

  @IsOptional()
  pageSize?: number;
}
