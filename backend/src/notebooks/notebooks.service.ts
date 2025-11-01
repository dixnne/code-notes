// backend/src/notebooks/notebooks.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';

@Injectable()
export class NotebooksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea un nuevo notebook asociado a un usuario.
   * @param userId El ID del usuario (viene del token)
   * @param createNotebookDto El DTO con el título
   */
  async createNotebook(userId: number, createNotebookDto: CreateNotebookDto) {
    return this.prisma.notebook.create({
      data: {
        title: createNotebookDto.title,
        // Creamos la conexión con el usuario usando su ID
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  /**
   * Obtiene todos los notebooks que pertenecen a un usuario específico.
   * @param userId El ID del usuario (viene del token)
   */
  async getNotebooksForUser(userId: number) {
    return this.prisma.notebook.findMany({
      where: {
        ownerId: userId,
      },
      // Opcional: ordenar por el más reciente primero
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
}
