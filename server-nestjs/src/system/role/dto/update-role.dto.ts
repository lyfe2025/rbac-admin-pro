import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
} from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  roleName?: string;

  @IsOptional()
  @IsString()
  roleKey?: string;

  @IsOptional()
  @IsNumber()
  roleSort?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsArray()
  menuIds?: string[];
}
