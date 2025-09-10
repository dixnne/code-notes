import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todos los endpoints de la API
  app.setGlobalPrefix('api');

  // Habilita un pipe de validación global para los DTOs
  // Esto asegura que toda la data que entra a la API sea validada
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no permitidas
    transform: true, // Transforma el payload a una instancia del DTO
  }));

  // El backend escuchará en el puerto 3000 dentro del contenedor
  await app.listen(3000);
}
bootstrap();
