import { IsString } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  noticeTitle!: string;

  @IsString()
  noticeType!: string;

  @IsString()
  noticeContent!: string;

  @IsString()
  status!: string;
}
