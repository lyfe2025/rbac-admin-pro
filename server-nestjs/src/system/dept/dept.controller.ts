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
import { DeptService } from './dept.service';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { QueryDeptDto } from './dto/query-dept.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('system/dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post()
  create(@Body() createDeptDto: CreateDeptDto) {
    return this.deptService.create(createDeptDto);
  }

  @Get()
  findAll(@Query() query: QueryDeptDto) {
    return this.deptService.findAll(query);
  }

  @Get('list/exclude/:deptId')
  listExcludeChild(@Param('deptId') deptId: string) {
    return this.deptService.listExcludeChild(deptId);
  }

  @Get(':deptId')
  findOne(@Param('deptId') deptId: string) {
    return this.deptService.findOne(deptId);
  }

  @Put(':deptId')
  update(
    @Param('deptId') deptId: string,
    @Body() updateDeptDto: UpdateDeptDto,
  ) {
    return this.deptService.update(deptId, updateDeptDto);
  }

  @Delete(':deptId')
  remove(@Param('deptId') deptId: string) {
    return this.deptService.remove(deptId);
  }
}
