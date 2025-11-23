import { IsNotEmpty, IsInt, IsString, Length, IsOptional, IsIn } from 'class-validator';

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
  folderId?: number; // Nuevo campo opcional

  @IsOptional()
  @IsString()
  @IsIn(['markdown', 'mermaid', 'code'])
  type?: string;

  @IsOptional()
  @IsString()
  language?: string;
}