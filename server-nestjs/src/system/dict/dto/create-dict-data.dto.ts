import { IsString, IsOptional } from 'class-validator';

export class CreateDictDataDto {
  @IsOptional()
  dictSort?: number;

  @IsString()
  dictLabel!: string;

  @IsString()
  dictValue!: string;

  @IsString()
  dictType!: string;

  @IsOptional()
  @IsString()
  cssClass?: string;

  @IsOptional()
  @IsString()
  listClass?: string;

  @IsOptional()
  @IsString()
  isDefault?: string; // Y/N

  @IsOptional()
  @IsString()
  status?: string; // 0/1
}
