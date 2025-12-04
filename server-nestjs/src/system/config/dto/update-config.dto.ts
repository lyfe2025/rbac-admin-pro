import { IsString, IsOptional } from 'class-validator';

export class UpdateConfigDto {
  @IsOptional()
  @IsString()
  configName?: string;

  @IsOptional()
  @IsString()
  configKey?: string;

  @IsOptional()
  @IsString()
  configValue?: string;

  @IsOptional()
  @IsString()
  configType?: string;
}
