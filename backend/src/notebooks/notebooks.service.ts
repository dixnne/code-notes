// backend/src/notebooks/notebooks.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@Injectable()
export class NotebooksService {
  constructor(private prisma: PrismaService) {}

  // ... (create y getNotebooksForUser existentes) ...
  async createNotebook(userId: number, createNotebookDto: CreateNotebookDto) {
    return this.prisma.notebook.create({
      data: {
        title: createNotebookDto.title,
        owner: { connect: { id: userId } },
      },
    });
  }

  async getNotebooksForUser(userId: number) {
    return this.prisma.notebook.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // --- NUEVO: Actualizar Notebook ---
  async update(id: number, userId: number, updateNotebookDto: UpdateNotebookDto) {
    // 1. Verificar existencia y propiedad
    const notebook = await this.prisma.notebook.findUnique({
      where: { id },
    });

    if (!notebook) {
      throw new NotFoundException('Notebook no encontrado');
    }

    if (notebook.ownerId !== userId) {
      throw new ForbiddenException('No tienes permiso para editar este notebook');
    }

    // 2. Actualizar
    return this.prisma.notebook.update({
      where: { id },
      data: updateNotebookDto,
    });
  }

  // --- NUEVO: Eliminar Notebook ---
  async remove(id: number, userId: number) {
    // 1. Verificar existencia y propiedad
    const notebook = await this.prisma.notebook.findUnique({
      where: { id },
    });

    if (!notebook) {
      throw new NotFoundException('Notebook no encontrado');
    }

    if (notebook.ownerId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este notebook');
    }

    // 2. Eliminar (El delete cascade de Prisma borrará notas y carpetas)
    return this.prisma.notebook.delete({
      where: { id },
    });
  }
}