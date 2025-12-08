import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEmail,
  ValidateIf,
  Matches,
} from 'class-validator';

export class CreateDeptDto {
  @IsOptional()
  @IsString()
  parentId?: string;

  @IsNotEmpty({ message: '部门名称不能为空' })
  @IsString()
  deptName: string;

  @IsNotEmpty({ message: '显示排序不能为空' })
  @IsNumber()
  orderNum: number;

  @IsOptional()
  @IsString()
  leader?: string;

  @ValidateIf(
    (o) => o.phone !== '' && o.phone !== null && o.phone !== undefined,
  )
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone?: string;

  @ValidateIf(
    (o) => o.email !== '' && o.email !== null && o.email !== undefined,
  )
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
