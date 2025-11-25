import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateFolderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUUID()
  notebookId: string;

  // --- NUEVO: ID de la carpeta padre (opcional) ---
  @IsOptional()
  @IsUUID()
  parentId?: string;
}