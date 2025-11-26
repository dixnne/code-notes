import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todos los endpoints de la API
  app.setGlobalPrefix('api');

  // Configuración dinámica de CORS desde variables de entorno
  const corsOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Habilita un pipe de validación global para los DTOs
  // Esto asegura que toda la data que entra a la API sea validada
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no permitidas
    transform: true, // Transforma el payload a una instancia del DTO
  }));

  // El backend escuchará en el puerto 3000 dentro del contenedor
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}/api`);
  console.log(`🔒 CORS enabled for: ${corsOrigins.join(', ')}`);
}
bootstrap();
