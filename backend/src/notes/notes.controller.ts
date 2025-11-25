// backend/src/notes/notes.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseUUIDPipe, Query
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // --- NUEVO: Obtener todos los tags ---
  @Get('tags')
  getAllTags(@Req() req) {
    return this.notesService.getAllTags(req.user.id);
  }

  // --- NUEVO: Obtener todas las notas (con filtro opcional) ---
  @Get('notes')
  findAll(@Req() req, @Query('tag') tag?: string) {
    return this.notesService.findAll(req.user.id, tag);
  }

  // ... (endpoints existentes) ...
  @Get('notebooks/:id/notes')
  findAllByNotebook(@Param('id', ParseUUIDPipe) notebookId: string, @Req() req) {
    return this.notesService.findAllByNotebook(notebookId, req.user.id);
  }

  @Post('notes')
  create(@Body() createNoteDto: CreateNoteDto, @Req() req) {
    return this.notesService.create(createNoteDto, req.user.id);
  }

  @Patch('notes/:id')
  update(@Param('id', ParseUUIDPipe) noteId: string, @Body() updateNoteDto: UpdateNoteDto, @Req() req) {
    return this.notesService.update(noteId, req.user.id, updateNoteDto);
  }

  @Delete('notes/:id')
  remove(@Param('id', ParseUUIDPipe) noteId: string, @Req() req) {
    return this.notesService.remove(noteId, req.user.id);
  }
}