import {
  IsOptional,
  IsString,
  IsArray,
  IsEmail,
  ValidateIf,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  nickName?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  deptId?: string;

  @ValidateIf(
    (o) =>
      o.phonenumber !== '' &&
      o.phonenumber !== null &&
      o.phonenumber !== undefined,
  )
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phonenumber?: string;

  @ValidateIf(
    (o) => o.email !== '' && o.email !== null && o.email !== undefined,
  )
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsOptional()
  @IsString()
  userType?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsArray()
  roleIds?: string[];

  @IsOptional()
  @IsArray()
  postIds?: string[];
}
