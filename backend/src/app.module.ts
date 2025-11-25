import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NotebooksModule } from './notebooks/notebooks.module';
import { NotesModule } from './notes/notes.module';
import { FoldersModule } from './folders/folders.module'; // Importar Folders
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    NotebooksModule,
    NotesModule,
    FoldersModule,
    AiModule, // Añadir al array de imports
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}