import { IsOptional, IsString } from 'class-validator';

export class QueryRoleDto {
  @IsOptional()
  @IsString()
  roleName?: string;

  @IsOptional()
  @IsString()
  roleKey?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  pageNum?: number;

  @IsOptional()
  pageSize?: number;
}
