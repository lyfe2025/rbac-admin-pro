import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { MenuService } from './menu.service';

@Controller()
export class MenuController {
  constructor(private menuService: MenuService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getRouters')
  async getRouters(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    return this.menuService.getRouters(userId);
  }
}
