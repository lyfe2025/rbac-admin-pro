import { IsString, IsOptional } from 'class-validator';

export class UpdateDictDataDto {
  @IsOptional()
  dictSort?: number;

  @IsOptional()
  @IsString()
  dictLabel?: string;

  @IsOptional()
  @IsString()
  dictValue?: string;

  @IsOptional()
  @IsString()
  dictType?: string;

  @IsOptional()
  @IsString()
  cssClass?: string;

  @IsOptional()
  @IsString()
  listClass?: string;

  @IsOptional()
  @IsString()
  isDefault?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
