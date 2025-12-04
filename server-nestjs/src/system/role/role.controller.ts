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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('system/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll(@Query() query: QueryRoleDto) {
    return this.roleService.findAll(query);
  }

  @Get(':roleId')
  findOne(@Param('roleId') roleId: string) {
    return this.roleService.findOne(roleId);
  }

  @Put(':roleId')
  update(
    @Param('roleId') roleId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(roleId, updateRoleDto);
  }

  @Delete(':roleId')
  remove(@Param('roleId') roleId: string) {
    return this.roleService.remove(roleId);
  }

  @Put('changeStatus')
  changeStatus(@Body() body: { roleId: string; status: string }) {
    return this.roleService.changeStatus(body.roleId, body.status);
  }
}
