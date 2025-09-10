import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Esta función asegura que se establezca una conexión a la base de datos
    // cuando la aplicación se inicie.
    await this.$connect();
  }
}
