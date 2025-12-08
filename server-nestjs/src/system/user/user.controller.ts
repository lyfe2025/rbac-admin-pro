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
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Log, BusinessType } from '../../common/decorators/log.decorator';

@ApiTags('用户管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('system/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('getInfo')
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getInfo(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    return this.userService.getUserInfo(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: '更新个人信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateProfile(
    @Request() req: any,
    @Body()
    body: {
      nickName?: string;
      email?: string;
      phonenumber?: string;
      sex?: string;
      avatar?: string;
    },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    return this.userService.updateProfile(userId, body);
  }

  @Post()
  @Log('用户管理', BusinessType.INSERT)
  @ApiOperation({ summary: '新增用户' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '查询用户列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  @Get(':userId')
  @ApiOperation({ summary: '查询用户详情' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findOne(@Param('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Put('resetPwd')
  @ApiOperation({ summary: '重置用户密码' })
  @ApiResponse({ status: 200, description: '重置成功' })
  resetPassword(@Body() body: { userId: string; password: string }) {
    return this.userService.resetPassword(body.userId, body.password);
  }

  @Put('changeStatus')
  @ApiOperation({ summary: '修改用户状态' })
  @ApiResponse({ status: 200, description: '修改成功' })
  changeStatus(@Body() body: { userId: string; status: string }) {
    return this.userService.changeStatus(body.userId, body.status);
  }

  @Put(':userId')
  @Log('用户管理', BusinessType.UPDATE)
  @ApiOperation({ summary: '修改用户' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: '修改成功' })
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  @Log('用户管理', BusinessType.DELETE)
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Param('userId') userId: string) {
    return this.userService.remove(userId);
  }
}
