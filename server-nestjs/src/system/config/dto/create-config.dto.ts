import { IsString, IsOptional } from 'class-validator';

export class CreateConfigDto {
  @IsString()
  configName!: string;

  @IsString()
  configKey!: string;

  @IsString()
  configValue!: string;

  @IsOptional()
  @IsString()
  configType?: string;
}
