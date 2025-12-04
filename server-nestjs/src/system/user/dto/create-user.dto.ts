import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsEmail,
  ValidateIf,
  Matches,
} from 'class-validator';

/**
 * 创建用户 DTO
 */
export class CreateUserDto {
  /** 用户账号 */
  @IsNotEmpty({ message: '用户名称不能为空' })
  @IsString()
  userName: string;

  /** 用户昵称 */
  @IsNotEmpty({ message: '用户昵称不能为空' })
  @IsString()
  nickName: string;

  /** 用户密码 */
  @IsOptional()
  @IsString()
  password?: string;

  /** 部门ID */
  @IsOptional()
  @IsString()
  deptId?: string;

  /** 手机号码 */
  @ValidateIf((o) => o.phonenumber !== '' && o.phonenumber !== null && o.phonenumber !== undefined)
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phonenumber?: string;

  /** 邮箱地址 */
  @ValidateIf((o) => o.email !== '' && o.email !== null && o.email !== undefined)
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  /** 用户性别 (0=男 1=女 2=未知) */
  @IsOptional()
  @IsString()
  sex?: string;

  /** 用户状态 (0=正常 1=停用) */
  @IsOptional()
  @IsString()
  status?: string;

  /** 备注信息 */
  @IsOptional()
  @IsString()
  remark?: string;

  /** 角色ID列表 */
  @IsOptional()
  @IsArray()
  roleIds?: string[];

  /** 岗位ID列表 */
  @IsOptional()
  @IsArray()
  postIds?: string[];
}
