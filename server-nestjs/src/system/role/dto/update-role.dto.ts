import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
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
  dataScope?: string;

  @IsOptional()
  @IsBoolean()
  menuCheckStrictly?: boolean;

  @IsOptional()
  @IsBoolean()
  deptCheckStrictly?: boolean;

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
