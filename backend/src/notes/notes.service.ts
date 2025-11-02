// backend/src/notes/notes.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  // --- OBTENER NOTAS (findAllByNotebook) ---
  async findAllByNotebook(notebookId: number, userId: number) {
    // 1. Verificar si el usuario es dueño del notebook
    const notebook = await this.prisma.notebook.findFirst({
      where: {
        id: notebookId,
        ownerId: userId, // Comprobar propiedad aquí
      },
    });

    if (!notebook) {
      throw new ForbiddenException('No tienes acceso a este notebook.');
    }

    // 2. Si es dueño, devolver las notas
    return this.prisma.note.findMany({
      where: {
        notebookId: notebookId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  // --- CREAR NOTA (create) ---
  async create(dto: CreateNoteDto, userId: number) {
    const { title, notebookId } = dto;

    // 1. Verificar que el notebook existe y le pertenece al usuario
    const notebook = await this.prisma.notebook.findFirst({
      where: {
        id: notebookId,
        ownerId: userId,
      },
    });

    if (!notebook) {
      throw new ForbiddenException(
        'No puedes añadir notas a un notebook que no te pertenece.',
      );
    }

    // 2. Crear la nota
    return this.prisma.note.create({
      data: {
        title,
        notebookId,
        content: '', // Iniciar con contenido vacío
      },
    });
  }

  // --- ACTUALIZAR NOTA (update) ---
  async update(noteId: number, userId: number, dto: UpdateNoteDto) {
    // --- LÓGICA CORREGIDA AQUÍ ---

    // 1. Encontrar la nota E incluir su notebook padre
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: {
        notebook: true, // Incluimos el notebook
      },
    });

    // 2. Comprobar si la nota existe
    if (!note) {
      throw new NotFoundException('Nota no encontrada');
    }

    // 3. Comprobar si el usuario es el dueño del notebook al que pertenece la nota
    if (note.notebook.ownerId !== userId) {
      throw new ForbiddenException('No tienes permiso para modificar esta nota.');
    }

    // 4. Si todo está bien, actualizar la nota
    return this.prisma.note.update({
      where: { id: noteId },
      data: dto,
    });
  }

  // --- ELIMINAR NOTA (remove) ---
  async remove(noteId: number, userId: number) {
    // --- LÓGICA CORREGIDA AQUÍ (Tenía el mismo bug) ---

    // 1. Encontrar la nota E incluir su notebook padre
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: {
        notebook: true,
      },
    });

    // 2. Comprobar si la nota existe
    if (!note) {
      throw new NotFoundException('Nota no encontrada');
    }

    // 3. Comprobar si el usuario es el dueño del notebook
    if (note.notebook.ownerId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta nota.');
    }

    // 4. Si todo está bien, eliminar la nota
    return this.prisma.note.delete({
      where: { id: noteId },
    });
  }
}

