# Swagger API 文档配置指南

## 📋 概述

本项目已集成 Swagger API 文档,访问地址: `http://localhost:3000/api-docs`

## ✅ 已完成配置

### 1. Swagger 模块集成
- ✅ 安装依赖: `@nestjs/swagger`, `swagger-ui-express`
- ✅ 在 `main.ts` 中配置 Swagger
- ✅ 添加 JWT Bearer 认证支持
- ✅ 配置 API 标签分类

### 2. 示例实现
- ✅ `AuthController` 已添加完整的 API 文档装饰器
- ✅ `LoginDto` 已添加 API 属性装饰器

## 📝 装饰器使用指南

### Controller 级别装饰器

```typescript
import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('用户管理')  // API 分组标签
@ApiBearerAuth('JWT-auth')  // 需要 JWT 认证
@Controller('system/user')
export class UserController {
  // ...
}
```

### 方法级别装饰器

```typescript
import { Get, Post, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@Get()
@ApiOperation({ 
  summary: '查询用户列表', 
  description: '分页查询用户列表,支持多条件筛选' 
})
@ApiQuery({ name: 'pageNum', required: false, description: '页码', example: 1 })
@ApiQuery({ name: 'pageSize', required: false, description: '每页数量', example: 10 })
@ApiResponse({ status: 200, description: '查询成功' })
@ApiResponse({ status: 401, description: '未授权' })
async findAll(@Query() query: QueryUserDto) {
  // ...
}

@Get(':id')
@ApiOperation({ summary: '查询用户详情' })
@ApiParam({ name: 'id', description: '用户ID', example: '1' })
@ApiResponse({ status: 200, description: '查询成功' })
@ApiResponse({ status: 404, description: '用户不存在' })
async findOne(@Param('id') id: string) {
  // ...
}

@Post()
@ApiOperation({ summary: '新增用户' })
@ApiBody({ type: CreateUserDto })
@ApiResponse({ status: 201, description: '创建成功' })
@ApiResponse({ status: 400, description: '参数验证失败' })
async create(@Body() createUserDto: CreateUserDto) {
  // ...
}

@Put(':id')
@ApiOperation({ summary: '更新用户' })
@ApiParam({ name: 'id', description: '用户ID' })
@ApiBody({ type: UpdateUserDto })
@ApiResponse({ status: 200, description: '更新成功' })
async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  // ...
}

@Delete(':id')
@ApiOperation({ summary: '删除用户' })
@ApiParam({ name: 'id', description: '用户ID' })
@ApiResponse({ status: 200, description: '删除成功' })
async remove(@Param('id') id: string) {
  // ...
}
```

### DTO 级别装饰器

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
    example: 'zhangsan',
    required: true,
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  userName: string;

  @ApiProperty({
    description: '用户昵称',
    example: '张三',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '昵称不能为空' })
  nickName: string;

  @ApiPropertyOptional({
    description: '邮箱',
    example: 'zhangsan@example.com',
    required: false,
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: '手机号',
    example: '13800138000',
    required: false,
  })
  @IsString()
  @IsOptional()
  phonenumber?: string;

  @ApiProperty({
    description: '用户性别',
    example: '0',
    enum: ['0', '1', '2'],
    required: false,
  })
  @IsOptional()
  sex?: string;

  @ApiProperty({
    description: '用户状态',
    example: '0',
    enum: ['0', '1'],
    default: '0',
  })
  @IsOptional()
  status?: string;
}
```

### 响应模型装饰器

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: '用户ID', example: '1' })
  userId: string;

  @ApiProperty({ description: '用户名', example: 'admin' })
  userName: string;

  @ApiProperty({ description: '昵称', example: '管理员' })
  nickName: string;

  @ApiProperty({ description: '邮箱', example: 'admin@example.com' })
  email: string;

  @ApiProperty({ description: '创建时间', example: '2024-12-05T06:00:00.000Z' })
  createTime: Date;
}

// 在 Controller 中使用
@Get(':id')
@ApiOperation({ summary: '查询用户详情' })
@ApiResponse({ 
  status: 200, 
  description: '查询成功',
  type: UserResponseDto  // 指定响应类型
})
async findOne(@Param('id') id: string): Promise<UserResponseDto> {
  // ...
}
```

## 🎯 待完成任务

### 需要添加 Swagger 装饰器的 Controller

1. **系统管理模块**
   - [ ] `UserController` - 用户管理
   - [ ] `RoleController` - 角色管理
   - [ ] `MenuController` / `SystemMenuController` - 菜单管理
   - [ ] `DeptController` - 部门管理
   - [ ] `PostController` - 岗位管理
   - [ ] `DictController` - 字典管理
   - [ ] `ConfigController` - 参数配置
   - [ ] `NoticeController` - 通知公告

2. **监控管理模块**
   - [ ] `OnlineController` - 在线用户
   - [ ] `LoginLogController` - 登录日志
   - [ ] `OperLogController` - 操作日志
   - [ ] `ServerController` - 服务器监控
   - [ ] `CacheController` - 缓存监控

### 需要添加 API 属性的 DTO

每个模块的 DTO 文件都需要添加 `@ApiProperty` 或 `@ApiPropertyOptional` 装饰器。

## 📖 使用示例

### 1. 访问 Swagger UI

启动服务后访问: http://localhost:3000/api-docs

### 2. 测试 API

1. 点击 "Authorize" 按钮
2. 先调用 `/auth/login` 接口获取 Token
3. 复制返回的 `token` 值
4. 在弹出的认证对话框中输入: `Bearer <your-token>`
5. 点击 "Authorize" 完成认证
6. 现在可以测试需要认证的接口了

### 3. 导出 API 文档

```bash
# 访问 JSON 格式的 API 文档
curl http://localhost:3000/api-docs-json > api-docs.json

# 或在浏览器访问
http://localhost:3000/api-docs-json
```

## 🔧 高级配置

### 1. 自定义响应格式

```typescript
// 创建通用响应 DTO
export class ApiResponseDto<T> {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '消息', example: '操作成功' })
  msg: string;

  @ApiProperty({ description: '数据' })
  data: T;
}

// 使用泛型响应
@Get()
@ApiOperation({ summary: '查询用户列表' })
@ApiResponse({ 
  status: 200,
  description: '查询成功',
  type: ApiResponseDto<UserResponseDto[]>
})
async findAll() {
  // ...
}
```

### 2. 分页响应

```typescript
export class PaginationDto<T> {
  @ApiProperty({ description: '总记录数', example: 100 })
  total: number;

  @ApiProperty({ description: '数据列表' })
  rows: T[];

  @ApiProperty({ description: '当前页码', example: 1 })
  pageNum: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  pageSize: number;
}
```

### 3. 枚举类型

```typescript
export enum UserStatus {
  NORMAL = '0',
  DISABLED = '1',
}

export class CreateUserDto {
  @ApiProperty({
    description: '用户状态',
    enum: UserStatus,
    example: UserStatus.NORMAL,
  })
  status: UserStatus;
}
```

### 4. 文件上传

```typescript
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Post('upload')
@ApiOperation({ summary: '上传文件' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
})
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  // ...
}
```

## 📚 参考资源

- [NestJS Swagger 官方文档](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI 规范](https://swagger.io/specification/)
- [Swagger UI 文档](https://swagger.io/tools/swagger-ui/)

## 💡 最佳实践

1. **所有 Controller 都应该添加 `@ApiTags`**
2. **所有公开的方法都应该添加 `@ApiOperation`**
3. **所有 DTO 的属性都应该添加 `@ApiProperty`**
4. **为常见的 HTTP 状态码添加 `@ApiResponse`**
5. **使用 `example` 属性提供示例数据**
6. **使用 `description` 属性提供详细说明**
7. **需要认证的 Controller 添加 `@ApiBearerAuth('JWT-auth')`**

## 🚀 快速添加装饰器的脚本

可以创建一个脚本批量为现有 Controller 添加基础装饰器:

```bash
# 示例: 为 UserController 添加装饰器
# 1. 在 import 中添加 Swagger 装饰器
# 2. 在 Controller 类上添加 @ApiTags
# 3. 在每个方法上添加 @ApiOperation
```

---

**最后更新**: 2024-12-05  
**状态**: Swagger 已集成,AuthController 已完成配置,其他 Controller 待完成
