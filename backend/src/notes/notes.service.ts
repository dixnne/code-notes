// backend/src/notes/notes.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  // Helper para obtener IDs de notebooks accesibles
  private async getAllowedNotebookIds(userId: string) {
    const notebooks = await this.prisma.notebook.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId } } }
        ]
      },
      select: { id: true }
    });
    return notebooks.map(n => n.id);
  }

  // --- NUEVO: Obtener todos los tags usados por el usuario ---
  async getAllTags(userId: string) {
    const notebookIds = await this.getAllowedNotebookIds(userId);

    const tags = await this.prisma.tag.findMany({
      where: {
        notes: {
          some: {
            note: {
              notebookId: { in: notebookIds }
            }
          }
        }
      },
      include: {
        _count: {
          select: {
            notes: {
              where: {
                note: { notebookId: { in: notebookIds } }
              }
            }
          }
        }
      }
    });

    // Formateamos para devolver { name, count }
    return tags.map(t => ({ 
      id: t.id, 
      name: t.name, 
      count: t._count.notes 
    })).sort((a, b) => b.count - a.count);
  }

  // --- NUEVO: Buscar notas globalmente (filtrado por tag opcional) ---
  async findAll(userId: string, tag?: string) {
    const notebookIds = await this.getAllowedNotebookIds(userId);

    return this.prisma.note.findMany({
      where: {
        notebookId: { in: notebookIds },
        ...(tag ? {
          tags: {
            some: {
              tag: { name: tag }
            }
          }
        } : {})
      },
      include: {
        tags: { include: { tag: true } },
        notebook: { select: { id: true, title: true } } // Incluimos info del notebook para contexto
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  // ... (resto de métodos findAllByNotebook, create, update, remove se mantienen igual) ...
  // --- MANTENER MÉTODOS EXISTENTES ---
  private async checkAccess(notebookId: string, userId: string) {
    const notebook = await this.prisma.notebook.findUnique({
        where: { id: notebookId },
        include: { collaborators: true }
    });
    if (!notebook) return null;
    const isOwner = notebook.ownerId === userId;
    const isCollaborator = notebook.collaborators.some(c => c.userId === userId);
    if (!isOwner && !isCollaborator) return null;
    return notebook;
  }

  async findAllByNotebook(notebookId: string, userId: string) {
    const notebook = await this.checkAccess(notebookId, userId);
    if (!notebook) throw new ForbiddenException('No tienes acceso a este notebook.');
    return this.prisma.note.findMany({
      where: { notebookId: notebookId },
      include: { tags: { include: { tag: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(dto: CreateNoteDto, userId: string) {
    const { title, notebookId, type, folderId, language, tags } = dto;
    const notebook = await this.checkAccess(notebookId, userId);
    if (!notebook) throw new ForbiddenException('No tienes permiso para añadir notas.');
    if (folderId) {
      const folder = await this.prisma.folder.findFirst({
        where: { id: folderId, notebookId: notebookId },
      });
      if (!folder) throw new NotFoundException('Carpeta no encontrada.');
    }
    const newNote = await this.prisma.note.create({
      data: { title, notebookId, folderId, content: '', type: type || 'markdown', language: language || 'javascript' },
    });
    if (tags && tags.length > 0) { await this.processTags(newNote.id, tags); }
    return this.prisma.note.findUnique({ where: { id: newNote.id }, include: { tags: { include: { tag: true } } } });
  }

  async update(noteId: string, userId: string, dto: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId }, include: { notebook: true } });
    if (!note) throw new NotFoundException('Nota no encontrada');
    const notebook = await this.checkAccess(note.notebookId, userId);
    if (!notebook) throw new ForbiddenException('No tienes permiso para modificar esta nota.');

    const { tags, ...updateData } = dto;
    const updatedNote = await this.prisma.note.update({ where: { id: noteId }, data: updateData });

    if (tags) {
        await this.processTags(noteId, tags);
    }

    return this.prisma.note.findUnique({ where: { id: noteId }, include: { tags: { include: { tag: true } } } });
  }

  async remove(noteId: string, userId: string) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId }, include: { notebook: true } });
    if (!note) throw new NotFoundException('Nota no encontrada');
    const notebook = await this.checkAccess(note.notebookId, userId);
    if (!notebook) throw new ForbiddenException('No tienes permiso para eliminar esta nota.');
    return this.prisma.note.delete({ where: { id: noteId } });
  }

  private async processTags(noteId: string, tagNames: string[]) {
    await this.prisma.noteTag.deleteMany({ where: { noteId } });
    const uniqueTags = [...new Set(tagNames.filter(t => t.trim() !== ''))];
    for (const name of uniqueTags) {
        const tag = await this.prisma.tag.upsert({ where: { name }, update: {}, create: { name } });
        await this.prisma.noteTag.create({ data: { noteId, tagId: tag.id } });
    }
  }
}