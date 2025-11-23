// backend/src/notebooks/notebooks.controller.ts
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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNotebookDto: CreateNotebookDto, @Req() req) {
    return this.notebooksService.createNotebook(req.user.id, createNotebookDto);
  }

  @Get()
  findAll(@Req() req) {
    return this.notebooksService.getNotebooksForUser(req.user.id);
  }

  // --- NUEVO: Endpoint para Renombrar ---
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotebookDto: UpdateNotebookDto,
    @Req() req,
  ) {
    return this.notebooksService.update(id, req.user.id, updateNotebookDto);
  }

  // --- NUEVO: Endpoint para Eliminar ---
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.notebooksService.remove(id, req.user.id);
  }
}