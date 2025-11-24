// backend/src/notes/dto/update-note.dto.ts
import { IsOptional, IsString, Length, IsArray } from 'class-validator';

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
  language?: string;

  // --- NUEVO CAMPO: Tags ---
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}