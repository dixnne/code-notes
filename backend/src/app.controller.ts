import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 4. Añade este nuevo endpoint
  @Get('health')
  async checkHealth() {
    return this.appService.checkDatabaseConnection();
  }
}