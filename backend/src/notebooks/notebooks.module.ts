// backend/src/notebooks/notebooks.module.ts
import { Module } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { NotebooksController } from './notebooks.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Importamos PrismaModule para que el servicio pueda usarlo
  controllers: [NotebooksController],
  providers: [NotebooksService],
})
export class NotebooksModule {}
