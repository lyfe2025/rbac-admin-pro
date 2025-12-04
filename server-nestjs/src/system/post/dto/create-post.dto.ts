import { IsString, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsString()
  postCode!: string;

  @IsString()
  postName!: string;

  @IsInt()
  postSort!: number;

  @IsString()
  status!: string;

  @IsString()
  remark?: string;
}
