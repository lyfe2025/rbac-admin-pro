import { IsOptional, IsString } from 'class-validator';

export class QueryUserDto {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  phonenumber?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  deptId?: string;

  @IsOptional()
  pageNum?: number;

  @IsOptional()
  pageSize?: number;
}
