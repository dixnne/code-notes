// backend/src/notes/dto/create-note.dto.ts
import { IsNotEmpty, IsString, Length, IsOptional, IsIn, IsArray, IsUUID } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  title: string;

  @IsNotEmpty()
  @IsUUID()
  notebookId: string;

  @IsOptional()
  @IsUUID()
  folderId?: string;

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