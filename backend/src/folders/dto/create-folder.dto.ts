import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateFolderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  notebookId: number;

  // --- NUEVO: ID de la carpeta padre (opcional) ---
  @IsOptional()
  @IsInt()
  parentId?: number;
}