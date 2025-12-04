import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('system/menu')
export class SystemMenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  findAll(@Query() query: QueryMenuDto) {
    return this.menuService.findAll(query);
  }

  @Get('treeselect')
  treeSelect(@Query() query: QueryMenuDto) {
    return this.menuService.listTree(query);
  }

  @Get('roleMenuTreeselect/:roleId')
  async roleMenuTreeselect(@Param('roleId') roleId: string) {
    const menus = await this.menuService.listTree({});
    return { menus };
  }

  @Get(':menuId')
  findOne(@Param('menuId') menuId: string) {
    return this.menuService.findOne(menuId);
  }

  @Put(':menuId')
  update(
    @Param('menuId') menuId: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.update(menuId, updateMenuDto);
  }

  @Delete(':menuId')
  remove(@Param('menuId') menuId: string) {
    return this.menuService.remove(menuId);
  }
}
