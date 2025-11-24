// backend/src/notebooks/notebooks.service.ts
import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotebooksService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService // Inyectar servicio de usuarios
  ) {}

  async createNotebook(userId: number, createNotebookDto: CreateNotebookDto) {
    return this.prisma.notebook.create({
      data: {
        title: createNotebookDto.title,
        owner: { connect: { id: userId } },
      },
    });
  }

  // --- ACTUALIZADO: Obtener propios Y compartidos ---
  async getNotebooksForUser(userId: number) {
    return this.prisma.notebook.findMany({
      where: {
        OR: [
          { ownerId: userId }, // Notebooks propios
          { 
            collaborators: { // Notebooks donde soy colaborador
              some: { userId: userId } 
            } 
          }
        ]
      },
      include: {
        owner: { // Incluir datos del dueño para mostrar "Compartido por..."
            select: { id: true, username: true, email: true }
        },
        collaborators: true // Para saber si soy colaborador
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async update(id: number, userId: number, updateNotebookDto: UpdateNotebookDto) {
    const notebook = await this.prisma.notebook.findUnique({ where: { id } });
    if (!notebook) throw new NotFoundException('Notebook no encontrado');

    // Solo el dueño puede renombrar
    if (notebook.ownerId !== userId) {
      throw new ForbiddenException('Solo el propietario puede renombrar este notebook');
    }

    return this.prisma.notebook.update({
      where: { id },
      data: updateNotebookDto,
    });
  }

  async remove(id: number, userId: number) {
    const notebook = await this.prisma.notebook.findUnique({ where: { id } });
    if (!notebook) throw new NotFoundException('Notebook no encontrado');

    // Solo el dueño puede eliminar
    if (notebook.ownerId !== userId) {
      throw new ForbiddenException('Solo el propietario puede eliminar este notebook');
    }

    return this.prisma.notebook.delete({ where: { id } });
  }

  // --- NUEVO: Compartir Notebook ---
  async shareNotebook(notebookId: number, ownerId: number, emailToShare: string) {
    // 1. Verificar que el notebook existe y soy el dueño
    const notebook = await this.prisma.notebook.findUnique({ where: { id: notebookId } });
    if (!notebook) throw new NotFoundException('Notebook no encontrado');
    
    if (notebook.ownerId !== ownerId) {
      throw new ForbiddenException('Solo el propietario puede compartir este notebook');
    }

    // 2. Buscar al usuario destino
    const userToShare = await this.usersService.findOneByEmail(emailToShare);
    if (!userToShare) {
      throw new NotFoundException('Usuario no encontrado con ese email');
    }

    if (userToShare.id === ownerId) {
      throw new BadRequestException('No puedes compartir el notebook contigo mismo');
    }

    // 3. Crear la colaboración (si ya existe, Prisma lanzará error de unique constraint, lo capturamos)
    try {
        return await this.prisma.collaborator.create({
            data: {
                notebookId,
                userId: userToShare.id,
                permission: 'EDITOR' // Por defecto
            }
        });
    } catch (error) {
        if (error.code === 'P2002') {
            throw new BadRequestException('Este usuario ya es colaborador de este notebook');
        }
        throw error;
    }
  }
}