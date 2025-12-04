import { IsOptional, IsString } from 'class-validator';

export class UpdateNoticeDto {
  @IsOptional()
  @IsString()
  noticeTitle?: string;

  @IsOptional()
  @IsString()
  noticeType?: string;

  @IsOptional()
  @IsString()
  noticeContent?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
