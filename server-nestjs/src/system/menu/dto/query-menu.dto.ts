import { IsOptional, IsString } from 'class-validator';

export class QueryMenuDto {
  @IsOptional()
  @IsString()
  menuName?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
