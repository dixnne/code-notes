// backend/src/notes/dto/create-note.dto.ts
import { IsNotEmpty, IsInt, IsString, Length } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  title: string;

  @IsNotEmpty()
  @IsInt()
  notebookId: number;
}
