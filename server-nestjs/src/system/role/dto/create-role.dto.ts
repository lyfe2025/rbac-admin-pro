import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: '角色名称不能为空' })
  @IsString()
  roleName: string;

  @IsNotEmpty({ message: '权限字符不能为空' })
  @IsString()
  roleKey: string;

  @IsNotEmpty({ message: '显示顺序不能为空' })
  @IsNumber()
  roleSort: number;

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
