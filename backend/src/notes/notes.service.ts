// backend/src/notes/notes.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  // Método auxiliar para verificar acceso (Dueño O Colaborador)
  private async checkAccess(notebookId: number, userId: number) {
    const notebook = await this.prisma.notebook.findUnique({
        where: { id: notebookId },
        include: { collaborators: true } // Incluir colaboradores para verificar
    });

    if (!notebook) return null;

    const isOwner = notebook.ownerId === userId;
    const isCollaborator = notebook.collaborators.some(c => c.userId === userId);

    if (!isOwner && !isCollaborator) {
        return null; // Sin acceso
    }

    return notebook;
  }

  async findAllByNotebook(notebookId: number, userId: number) {
    // Usamos el helper para verificar acceso
    const notebook = await this.checkAccess(notebookId, userId);
    
    if (!notebook) throw new ForbiddenException('No tienes acceso a este notebook.');
    
    return this.prisma.note.findMany({
      where: { notebookId: notebookId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(dto: CreateNoteDto, userId: number) {
    const { title, notebookId, type, folderId, language } = dto;

    // Verificar acceso
    const notebook = await this.checkAccess(notebookId, userId);
    if (!notebook) throw new ForbiddenException('No tienes permiso para añadir notas.');

    if (folderId) {
      const folder = await this.prisma.folder.findFirst({
        where: { id: folderId, notebookId: notebookId },
      });
      if (!folder) throw new NotFoundException('Carpeta no encontrada.');
    }

    return this.prisma.note.create({
      data: {
        title,
        notebookId,
        folderId,
        content: '',
        type: type || 'markdown',
        language: language || 'javascript',
      },
    });
  }

  async update(noteId: number, userId: number, dto: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: { notebook: true }, // Necesitamos el notebookId para verificar
    });
    if (!note) throw new NotFoundException('Nota no encontrada');

    // Verificar acceso al notebook padre
    const notebook = await this.checkAccess(note.notebookId, userId);
    if (!notebook) throw new ForbiddenException('No tienes permiso para modificar esta nota.');

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

    // Verificar acceso al notebook padre
    const notebook = await this.checkAccess(note.notebookId, userId);
    if (!notebook) throw new ForbiddenException('No tienes permiso para eliminar esta nota.');

    return this.prisma.note.delete({ where: { id: noteId } });
  }
}