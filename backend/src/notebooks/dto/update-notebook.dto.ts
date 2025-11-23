// backend/src/notebooks/dto/update-notebook.dto.ts
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateNotebookDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;
}