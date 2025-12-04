import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
} from 'class-validator';

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsIn(['M', 'C', 'F'])
  menuType?: string;

  @IsOptional()
  @IsString()
  menuName?: string;

  @IsOptional()
  @IsNumber()
  orderNum?: number;

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
}
