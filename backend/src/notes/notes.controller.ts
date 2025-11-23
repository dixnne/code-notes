// backend/src/notes/notes.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Protege todas las rutas con JWT
@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  /**
   * Obtener todas las notas de un notebook
   * GET /api/notebooks/:id/notes
   */
  @Get('notebooks/:id/notes')
  findAllByNotebook(
    @Param('id', ParseIntPipe) notebookId: number,
    @Req() req,
  ) {
    // En el payload del JWT (req.user), el ID suele venir como 'id' o 'sub'
    // dependiendo de cómo lo guardamos en jwt.strategy.ts.
    // Asumimos req.user.id basado en implementaciones previas.
    const userId = req.user.id;
    return this.notesService.findAllByNotebook(notebookId, userId);
  }

  /**
   * Crear una nueva nota
   * POST /api/notes
   */
  @Post('notes')
  create(@Body() createNoteDto: CreateNoteDto, @Req() req) {
    const userId = req.user.id;
    // createNoteDto ahora incluye opcionalmente el campo 'type'
    return this.notesService.create(createNoteDto, userId);
  }

  /**
   * Actualizar una nota
   * PATCH /api/notes/:id
   */
  @Patch('notes/:id')
  update(
    @Param('id', ParseIntPipe) noteId: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    // IMPORTANTE: El orden de los argumentos debe coincidir con NotesService.update
    // update(noteId: number, userId: number, dto: UpdateNoteDto)
    return this.notesService.update(noteId, userId, updateNoteDto);
  }

  /**
   * Eliminar una nota
   * DELETE /api/notes/:id
   */
  @Delete('notes/:id')
  remove(@Param('id', ParseIntPipe) noteId: number, @Req() req) {
    const userId = req.user.id;
    return this.notesService.remove(noteId, userId);
  }
}