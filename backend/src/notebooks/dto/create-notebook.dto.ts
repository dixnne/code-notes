// backend/src/notebooks/dto/create-notebook.dto.ts
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNotebookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
}
