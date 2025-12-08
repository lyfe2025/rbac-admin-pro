import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DatabaseService } from './database.service';

@UseGuards(JwtAuthGuard)
@Controller('monitor/database')
export class DatabaseController {
  constructor(private readonly service: DatabaseService) {}

  @Get()
  getInfo() {
    return this.service.getInfo();
  }
}
