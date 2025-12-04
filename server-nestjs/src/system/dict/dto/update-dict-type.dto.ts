import { IsString, IsOptional } from 'class-validator';

export class UpdateDictTypeDto {
  @IsOptional()
  @IsString()
  dictName?: string;

  @IsOptional()
  @IsString()
  dictType?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}
