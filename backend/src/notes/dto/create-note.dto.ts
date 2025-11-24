// backend/src/notes/dto/create-note.dto.ts
import { IsNotEmpty, IsInt, IsString, Length, IsOptional, IsIn, IsArray } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  title: string;

  @IsNotEmpty()
  @IsInt()
  notebookId: number;

  @IsOptional()
  @IsInt()
  folderId?: number;

  @IsOptional()
  @IsString()
  @IsIn(['markdown', 'mermaid', 'code'])
  type?: string;

  @IsOptional()
  @IsString()
  language?: string;

  // --- NUEVO CAMPO: Tags ---
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Cada elemento del array debe ser string
  tags?: string[];
}