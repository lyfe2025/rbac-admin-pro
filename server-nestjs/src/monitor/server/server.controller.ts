import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ServerService } from './server.service';

@UseGuards(JwtAuthGuard)
@Controller('monitor/server')
export class ServerController {
  constructor(private readonly service: ServerService) {}

  @Get()
  get() {
    return this.service.getInfo();
  }
}
