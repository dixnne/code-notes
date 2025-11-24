// backend/src/notebooks/notebooks.module.ts
import { Module } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { NotebooksController } from './notebooks.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module'; // Importar UsersModule

@Module({
  imports: [
    PrismaModule,
    UsersModule // Necesario para buscar usuarios por email al compartir
  ],
  controllers: [NotebooksController],
  providers: [NotebooksService],
  exports: [NotebooksService], // Exportar por si otros módulos lo necesitan
})
export class NotebooksModule {}