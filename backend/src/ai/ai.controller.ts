import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GenerateTextDto } from './dto/generate-text.dto';
import { TextDto } from './dto/text.dto';
import { RewriteTextDto } from './dto/rewrite-text.dto';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('api-key')
  saveApiKey(@Req() req, @Body('key') key: string) {
    return this.aiService.saveApiKey(req.user.id, key);
  }

  @Post('generate-text')
  generateText(@Req() req, @Body() generateTextDto: GenerateTextDto) {
    return this.aiService.generateText(req.user.id, generateTextDto.prompt);
  }

  @Post('summarize')
  summarize(@Req() req, @Body() textDto: TextDto) {
    return this.aiService.summarizeText(req.user.id, textDto.text);
  }

  @Post('rewrite')
  rewrite(@Req() req, @Body() rewriteTextDto: RewriteTextDto) {
    return this.aiService.rewriteText(req.user.id, rewriteTextDto.text, rewriteTextDto.style);
  }

  @Post('auto-tag')
  autoTag(@Req() req, @Body() textDto: TextDto) {
    return this.aiService.autoTag(req.user.id, textDto.text);
  }

  @Post('auto-title')
  autoTitle(@Req() req, @Body() textDto: TextDto) {
    return this.aiService.autoTitle(req.user.id, textDto.text);
  }
}
