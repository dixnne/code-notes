// backend/src/notebooks/notebooks.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Protegemos todo el controlador con nuestro JwtAuthGuard
// Solo los usuarios logueados podrán acceder a estas rutas
@UseGuards(JwtAuthGuard)
@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  /**
   * Endpoint para crear un nuevo notebook.
   * El 'req.user' se obtiene del token JWT verificado por el Guard.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createNotebookDto: CreateNotebookDto,
    @Request() req, // Obtenemos el objeto Request
  ) {
    // Pasamos el ID del usuario (obtenido del token) y el DTO al servicio
    return this.notebooksService.createNotebook(req.user.id, createNotebookDto);
  }

  /**
   * Endpoint para obtener todos los notebooks del usuario logueado.
   */
  @Get()
  findAll(@Request() req) {
    // Obtenemos todos los notebooks que pertenecen al usuario
    return this.notebooksService.getNotebooksForUser(req.user.id);
  }
}
