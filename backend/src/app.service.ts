import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service'; // <-- 1. Importa PrismaService

@Injectable()
export class AppService {
  // 2. Inyecta PrismaService en el constructor
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return '¡Bienvenido a la API de CodeNotes!';
  }

  // 3. Añade este nuevo método
  async checkDatabaseConnection() {
    try {
      // Ejecuta una consulta simple para verificar que la conexión funciona
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', message: 'Conexión a la base de datos exitosa' };
    } catch (error) {
      // Si hay un error, lo devolvemos
      return { status: 'error', message: 'No se pudo conectar a la base de datos', details: error.message };
    }
  }
}