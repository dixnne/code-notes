// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NotebooksModule } from './notebooks/notebooks.module';
import { NotesModule } from './notes/notes.module'; // 1. Importar el nuevo módulo

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que la configuración esté disponible globalmente
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    NotebooksModule,
    NotesModule, // 2. Añadir el módulo a la lista de imports
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

