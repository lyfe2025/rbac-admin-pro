import { IsString, IsOptional } from 'class-validator';

export class CreateDictTypeDto {
  @IsString()
  dictName!: string;

  @IsString()
  dictType!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}
