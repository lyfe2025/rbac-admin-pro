import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  postCode?: string;

  @IsOptional()
  @IsString()
  postName?: string;

  @IsOptional()
  @IsInt()
  postSort?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}
