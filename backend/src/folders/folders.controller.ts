import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post('folders')
  create(@Req() req, @Body() createFolderDto: CreateFolderDto) {
    return this.foldersService.create(req.user.id, createFolderDto);
  }

  @Get('notebooks/:id/folders')
  findAllByNotebook(@Req() req, @Param('id') notebookId: string) {
    return this.foldersService.findAllByNotebook(req.user.id, notebookId);
  }

  @Delete('folders/:id')
  remove(@Req() req, @Param('id') folderId: string) {
    return this.foldersService.remove(req.user.id, folderId);
  }
}