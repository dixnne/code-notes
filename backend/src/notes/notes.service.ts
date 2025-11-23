// backend/src/notes/notes.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  // ... (findAllByNotebook se mantiene igual) ...
  async findAllByNotebook(notebookId: number, userId: number) {
    const notebook = await this.prisma.notebook.findFirst({
      where: { id: notebookId, ownerId: userId },
    });
    if (!notebook) throw new ForbiddenException('No tienes acceso a este notebook.');
    return this.prisma.note.findMany({
      where: { notebookId: notebookId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // --- CREATE ACTUALIZADO ---
  async create(dto: CreateNoteDto, userId: number) {
    const { title, notebookId, type } = dto; // Extraemos el tipo

    const notebook = await this.prisma.notebook.findFirst({
      where: { id: notebookId, ownerId: userId },
    });

    if (!notebook) {
      throw new ForbiddenException('No puedes añadir notas a un notebook que no te pertenece.');
    }

    return this.prisma.note.create({
      data: {
        title,
        notebookId,
        content: '', 
        type: type || 'markdown', // Guardamos el tipo (default a markdown)
      },
    });
  }

  // ... (update y remove se mantienen igual, Prisma maneja el campo 'type' automáticamente en update si se enviara, pero por ahora no lo cambiamos) ...
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