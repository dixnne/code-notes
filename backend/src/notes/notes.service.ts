import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async findAllByNotebook(notebookId: number, userId: number) {
    const notebook = await this.prisma.notebook.findFirst({
      where: { id: notebookId, ownerId: userId },
    });
    if (!notebook) throw new ForbiddenException('No tienes acceso a este notebook.');
    
    // Devolvemos solo las notas que están en la RAÍZ (folderId es null)
    // Las notas dentro de carpetas se obtienen a través del servicio de carpetas
    // o podríamos devolver todas y filtrar en el frontend. 
    // Para simplificar, devolvemos TODAS y el frontend las organiza.
    return this.prisma.note.findMany({
      where: { notebookId: notebookId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(dto: CreateNoteDto, userId: number) {
    const { title, notebookId, type, folderId, language } = dto;

    const notebook = await this.prisma.notebook.findFirst({
      where: { id: notebookId, ownerId: userId },
    });

    if (!notebook) {
      throw new ForbiddenException('No puedes añadir notas a un notebook que no te pertenece.');
    }

    // Validar que la carpeta pertenece al notebook (si se proporciona folderId)
    if (folderId) {
      const folder = await this.prisma.folder.findFirst({
        where: { id: folderId, notebookId: notebookId },
      });
      if (!folder) throw new NotFoundException('La carpeta especificada no existe en este notebook.');
    }

    return this.prisma.note.create({
      data: {
        title,
        notebookId,
        folderId, // Guardar la relación con la carpeta
        content: '',
        type: type || 'markdown',
        language: language || 'javascript',
      },
    });
  }

  async update(noteId: number, userId: number, dto: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: { notebook: true },
    });
    if (!note) throw new NotFoundException('Nota no encontrada');
    if (note.notebook.ownerId !== userId) throw new ForbiddenException('No tienes permiso.');

    return this.prisma.note.update({
      where: { id: noteId },
      data: dto,
    });
  }

  async remove(noteId: number, userId: number) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: { notebook: true },
    });
    if (!note) throw new NotFoundException('Nota no encontrada');
    if (note.notebook.ownerId !== userId) throw new ForbiddenException('No tienes permiso.');

    return this.prisma.note.delete({ where: { id: noteId } });
  }
}