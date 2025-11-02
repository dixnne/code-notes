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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Proteger todas las rutas de este controlador
@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // --- OBTENER TODAS LAS NOTAS DE UN NOTEBOOK ---
  // GET /api/notebooks/:id/notes
  @Get('notebooks/:id/notes')
  findAllByNotebook(
    @Param('id', ParseIntPipe) notebookId: number,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.notesService.findAllByNotebook(notebookId, userId);
  }

  // --- CREAR UNA NUEVA NOTA ---
  // POST /api/notes
  @Post('notes')
  create(@Body() createNoteDto: CreateNoteDto, @Req() req) {
    const userId = req.user.id;
    return this.notesService.create(createNoteDto, userId);
  }

  // --- ACTUALIZAR UNA NOTA ---
  // PATCH /api/notes/:id
  @Patch('notes/:id')
  update(
    @Param('id', ParseIntPipe) noteId: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    
    // --- CORRECCIÓN DE ARGUMENTOS AQUÍ ---
    // El servicio espera (noteId, userId, dto)
    return this.notesService.update(noteId, userId, updateNoteDto);
  }

  // --- ELIMINAR UNA NOTA ---
  // DELETE /api/notes/:id
  @Delete('notes/:id')
  remove(@Param('id', ParseIntPipe) noteId: number, @Req() req) {
    const userId = req.user.id;
    return this.notesService.remove(noteId, userId);
  }
}

