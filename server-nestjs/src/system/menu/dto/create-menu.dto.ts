import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateMenuDto {
  @IsOptional()
  @IsString()
  parentId?: string;

  @IsNotEmpty({ message: '菜单类型不能为空' })
  @IsIn(['M', 'C', 'F'])
  menuType: string;

  @IsNotEmpty({ message: '菜单名称不能为空' })
  @IsString()
  menuName: string;

  @IsNotEmpty({ message: '显示排序不能为空' })
  @IsNumber()
  orderNum: number;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  component?: string;

  @IsOptional()
  @IsString()
  perms?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  visible?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  isFrame?: number;

  @IsOptional()
  @IsNumber()
  isCache?: number;

  @IsOptional()
  @IsString()
  remark?: string;
}
