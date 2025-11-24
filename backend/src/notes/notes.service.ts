// backend/src/notes/notes.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  private async checkAccess(notebookId: number, userId: number) {
    const notebook = await this.prisma.notebook.findUnique({
        where: { id: notebookId },
        include: { collaborators: true }
    });

    if (!notebook) return null;

    const isOwner = notebook.ownerId === userId;
    const isCollaborator = notebook.collaborators.some(c => c.userId === userId);

    if (!isOwner && !isCollaborator) {
        return null;
    }
    return notebook;
  }

  async findAllByNotebook(notebookId: number, userId: number) {
    const notebook = await this.checkAccess(notebookId, userId);
    if (!notebook) throw new ForbiddenException('No tienes acceso a este notebook.');
    
    return this.prisma.note.findMany({
      where: { notebookId: notebookId },
      // Incluir los tags en la respuesta
      include: {
        tags: {
            include: { tag: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(dto: CreateNoteDto, userId: number) {
    const { title, notebookId, type, folderId, language, tags } = dto;

    const notebook = await this.checkAccess(notebookId, userId);
    if (!notebook) throw new ForbiddenException('No tienes permiso para añadir notas.');

    if (folderId) {
      const folder = await this.prisma.folder.findFirst({
        where: { id: folderId, notebookId: notebookId },
      });
      if (!folder) throw new NotFoundException('Carpeta no encontrada.');
    }

    // Crear la nota
    const newNote = await this.prisma.note.create({
      data: {
        title,
        notebookId,
        folderId,
        content: '',
        type: type || 'markdown',
        language: language || 'javascript',
      },
    });

    // Si hay tags, procesarlos
    if (tags && tags.length > 0) {
        await this.processTags(newNote.id, tags);
    }

    // Devolver la nota completa con tags
    return this.prisma.note.findUnique({
        where: { id: newNote.id },
        include: { tags: { include: { tag: true } } }
    });
  }

  async update(noteId: number, userId: number, dto: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: { notebook: true },
    });
    if (!note) throw new NotFoundException('Nota no encontrada');

    const notebook = await this.checkAccess(note.notebookId, userId);
    if (!notebook) throw new ForbiddenException('No tienes permiso para modificar esta nota.');

    // Si se enviaron tags, actualizarlos
    if (dto.tags) {
        // 1. Eliminar relaciones existentes
        await this.prisma.noteTag.deleteMany({ where: { noteId } });
        // 2. Crear nuevas relaciones
        await this.processTags(noteId, dto.tags);
    }

    // Actualizar el resto de campos (eliminamos 'tags' del dto para que no falle prisma update)
    const { tags, ...updateData } = dto;

    return this.prisma.note.update({
      where: { id: noteId },
      data: updateData,
      include: { tags: { include: { tag: true } } } // Devolver tags actualizados
    });
  }

  async remove(noteId: number, userId: number) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: { notebook: true },
    });
    if (!note) throw new NotFoundException('Nota no encontrada');

    const notebook = await this.checkAccess(note.notebookId, userId);
    if (!notebook) throw new ForbiddenException('No tienes permiso para eliminar esta nota.');

    return this.prisma.note.delete({ where: { id: noteId } });
  }

  // Helper para procesar tags (Upsert y Connect)
  private async processTags(noteId: number, tagNames: string[]) {
    // Filtrar duplicados y vacíos
    const uniqueTags = [...new Set(tagNames.filter(t => t.trim() !== ''))];

    for (const name of uniqueTags) {
        // Upsert Tag (Crear si no existe)
        const tag = await this.prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
        });

        // Crear relación NoteTag
        await this.prisma.noteTag.create({
            data: {
                noteId,
                tagId: tag.id
            }
        });
    }
  }
}