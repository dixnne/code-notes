// backend/src/notes/notes.module.ts
import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Importamos PrismaModule para tener acceso a PrismaService
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
