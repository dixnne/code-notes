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
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { ShareNotebookDto } from './dto/share-notebook.dto'; // Importar nuevo DTO
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

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNotebookDto: UpdateNotebookDto,
    @Req() req,
  ) {
    return this.notebooksService.update(id, req.user.id, updateNotebookDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.notebooksService.remove(id, req.user.id);
  }

  // --- NUEVO: Endpoint para Compartir ---
  @Post(':id/share')
  share(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() shareNotebookDto: ShareNotebookDto,
    @Req() req
  ) {
    return this.notebooksService.shareNotebook(id, req.user.id, shareNotebookDto.email);
  }
}