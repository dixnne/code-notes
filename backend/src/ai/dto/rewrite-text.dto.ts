import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class RewriteTextDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Formal', 'Casual', 'Poetic'])
  style: string;
}
