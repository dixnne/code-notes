import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateFolderDto) {
    // Verificar propiedad del notebook
    const notebook = await this.prisma.notebook.findFirst({
      where: { id: dto.notebookId, ownerId: userId },
    });

    if (!notebook) {
      throw new ForbiddenException('No tienes acceso a este notebook.');
    }

    // Si hay parentId, verificar que la carpeta padre exista y pertenezca al mismo notebook
    if (dto.parentId) {
      const parentFolder = await this.prisma.folder.findFirst({
        where: { id: dto.parentId, notebookId: dto.notebookId },
      });
      if (!parentFolder) {
        throw new NotFoundException('La carpeta padre no existe.');
      }
    }

    return this.prisma.folder.create({
      data: {
        name: dto.name,
        notebookId: dto.notebookId,
        parentId: dto.parentId, // Guardamos la relación jerárquica
      },
    });
  }

  async findAllByNotebook(userId: string, notebookId: string) {
    const notebook = await this.prisma.notebook.findFirst({
      where: { id: notebookId, ownerId: userId },
    });

    if (!notebook) {
      throw new ForbiddenException('No tienes acceso a este notebook.');
    }

    // Devolvemos todas las carpetas (la jerarquía se puede armar en el frontend)
    // Incluimos children para facilitar si se quisiera armar en backend, pero es más flexible devolver lista plana
    return this.prisma.folder.findMany({
      where: { notebookId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async remove(userId: string, folderId: string) {
    const folder = await this.prisma.folder.findUnique({
      where: { id: folderId },
      include: { notebook: true },
    });

    if (!folder || folder.notebook.ownerId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta carpeta.');
    }

    // Gracias a onDelete: Cascade en el schema, esto borrará subcarpetas y notas automáticamente
    return this.prisma.folder.delete({
      where: { id: folderId },
    });
  }
}