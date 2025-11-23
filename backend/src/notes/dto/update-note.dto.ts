import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  language?: string; // Permitir actualizar el lenguaje
}