import {
  IsOptional,
  IsString,
  IsNumber,
  IsEmail,
  ValidateIf,
  Matches,
} from 'class-validator';

export class UpdateDeptDto {
  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  deptName?: string;

  @IsOptional()
  @IsNumber()
  orderNum?: number;

  @IsOptional()
  @IsString()
  leader?: string;

  @ValidateIf((o) => o.phone !== '' && o.phone !== null && o.phone !== undefined)
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone?: string;

  @ValidateIf((o) => o.email !== '' && o.email !== null && o.email !== undefined)
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
