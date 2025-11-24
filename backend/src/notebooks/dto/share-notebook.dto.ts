// backend/src/notebooks/dto/share-notebook.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ShareNotebookDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}