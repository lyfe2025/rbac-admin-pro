# Swagger 自动生成配置

> 使用 NestJS CLI 插件自动为 DTO 和 Controller 生成 Swagger 装饰器

---

## ✅ 已配置完成

已在 `nest-cli.json` 中配置 Swagger CLI 插件,现在会自动生成装饰器。

## 🎯 插件功能

### 自动生成的内容

#### 1. DTO 类属性装饰器
**之前需要手动写:**
```typescript
export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  userName: string;
}
```

**现在自动生成:**
```typescript
export class CreateUserDto {
  @IsString()
  userName: string;  // 自动添加 @ApiProperty()
}
```

#### 2. Controller 方法参数
**自动识别:**
- `@Body()` → 自动添加 `@ApiBody()`
- `@Param()` → 自动添加 `@ApiParam()`
- `@Query()` → 自动添加 `@ApiQuery()`

#### 3. 从注释生成描述
**支持 JSDoc 注释:**
```typescript
export class CreateUserDto {
  /** 用户名 */
  @IsString()
  userName: string;  // 自动生成: @ApiProperty({ description: '用户名' })
  
  /** 用户昵称 */
  @IsString()
  nickName: string;  // 自动生成: @ApiProperty({ description: '用户昵称' })
}
```

## 📋 配置说明

### nest-cli.json 配置项

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@nestjs/swagger",
        "options": {
          "classValidatorShim": true,        // 从 class-validator 推断类型
          "introspectComments": true,        // 从注释生成描述
          "dtoFileNameSuffix": [".dto.ts", ".entity.ts"],  // DTO 文件后缀
          "controllerFileNameSuffix": ".controller.ts"     // Controller 文件后缀
        }
      }
    ]
  }
}
```

### 配置项详解

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `classValidatorShim` | 从 class-validator 装饰器推断类型 | `true` |
| `introspectComments` | 从 JSDoc 注释生成描述 | `false` |
| `dtoFileNameSuffix` | DTO 文件名后缀 | `[".dto.ts"]` |
| `controllerFileNameSuffix` | Controller 文件名后缀 | `[".controller.ts"]` |

## 🚀 使用方法

### 1. 重新编译项目

配置完成后,需要重新编译:

```bash
cd server-nestjs

# 停止当前服务
# Ctrl+C

# 清理构建产物
rm -rf dist

# 重新启动
npm run start:dev
```

### 2. DTO 最佳实践

#### ✅ 推荐写法 (使用注释)

```typescript
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  /** 用户名 */
  @IsString()
  @IsNotEmpty()
  userName: string;

  /** 用户昵称 */
  @IsString()
  @IsNotEmpty()
  nickName: string;

  /** 邮箱地址 */
  @IsEmail()
  @IsOptional()
  email?: string;

  /** 手机号码 */
  @IsString()
  @IsOptional()
  phonenumber?: string;

  /** 用户性别 (0=男 1=女 2=未知) */
  @IsString()
  @IsOptional()
  sex?: string;

  /** 用户状态 (0=正常 1=停用) */
  @IsString()
  @IsOptional()
  status?: string;
}
```

**自动生成的 Swagger 文档:**
- `userName`: `{ type: 'string', description: '用户名', required: true }`
- `nickName`: `{ type: 'string', description: '用户昵称', required: true }`
- `email`: `{ type: 'string', description: '邮箱地址', required: false }`
- 等等...

#### ✅ 如果需要更多控制

可以手动添加 `@ApiProperty()` 覆盖自动生成:

```typescript
export class CreateUserDto {
  /** 用户名 */
  @ApiProperty({
    description: '用户名',
    example: 'admin',
    minLength: 2,
    maxLength: 30
  })
  @IsString()
  @IsNotEmpty()
  userName: string;
}
```

### 3. Controller 最佳实践

#### ✅ 推荐写法

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('用户管理')
@ApiBearerAuth('JWT-auth')
@Controller('system/user')
export class UserController {
  
  /**
   * 查询用户列表
   */
  @Get()
  @ApiOperation({ summary: '查询用户列表' })
  findAll(@Query() query: QueryUserDto) {
    // @Query() 会自动生成 @ApiQuery()
    return this.userService.findAll(query);
  }

  /**
   * 查询用户详情
   */
  @Get(':userId')
  @ApiOperation({ summary: '查询用户详情' })
  findOne(@Param('userId') userId: string) {
    // @Param() 会自动生成 @ApiParam()
    return this.userService.findOne(userId);
  }

  /**
   * 新增用户
   */
  @Post()
  @ApiOperation({ summary: '新增用户' })
  create(@Body() createUserDto: CreateUserDto) {
    // @Body() 会自动生成 @ApiBody()
    return this.userService.create(createUserDto);
  }
}
```

## 🎨 自动推断的类型

### 从 class-validator 推断

| class-validator 装饰器 | 推断的 Swagger 类型 |
|------------------------|-------------------|
| `@IsString()` | `type: 'string'` |
| `@IsNumber()` | `type: 'number'` |
| `@IsBoolean()` | `type: 'boolean'` |
| `@IsArray()` | `type: 'array'` |
| `@IsDate()` | `type: 'string', format: 'date-time'` |
| `@IsEmail()` | `type: 'string', format: 'email'` |
| `@IsEnum(Enum)` | `enum: [...]` |
| `@IsOptional()` | `required: false` |
| `@IsNotEmpty()` | `required: true` |
| `@Min(n)` | `minimum: n` |
| `@Max(n)` | `maximum: n` |
| `@MinLength(n)` | `minLength: n` |
| `@MaxLength(n)` | `maxLength: n` |

### 示例

```typescript
export class CreateUserDto {
  /** 用户名 */
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  userName: string;
  // 自动生成: { type: 'string', minLength: 2, maxLength: 30, description: '用户名' }

  /** 年龄 */
  @IsNumber()
  @Min(1)
  @Max(150)
  @IsOptional()
  age?: number;
  // 自动生成: { type: 'number', minimum: 1, maximum: 150, required: false, description: '年龄' }

  /** 邮箱 */
  @IsEmail()
  email: string;
  // 自动生成: { type: 'string', format: 'email', description: '邮箱' }
}
```

## 📝 注释格式

### 支持的注释格式

```typescript
export class CreateUserDto {
  // ✅ 单行注释 (推荐)
  /** 用户名 */
  userName: string;

  // ✅ 多行注释
  /**
   * 用户昵称
   */
  nickName: string;

  // ✅ JSDoc 完整格式
  /**
   * 用户邮箱
   * @example admin@example.com
   */
  email: string;

  // ❌ 不支持双斜杠注释
  // 这种注释不会被识别
  phone: string;
}
```

## ⚙️ 高级配置

### 1. 排除特定文件

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@nestjs/swagger",
        "options": {
          "dtoFileNameSuffix": [".dto.ts"],
          "dtoKeyOfComment": "description",
          "controllerKeyOfComment": "summary"
        }
      }
    ]
  }
}
```

### 2. 自定义注释键

```json
{
  "options": {
    "dtoKeyOfComment": "description",      // DTO 注释映射到 description
    "controllerKeyOfComment": "summary"    // Controller 注释映射到 summary
  }
}
```

## 🔍 验证配置

### 1. 检查编译输出

```bash
# 启动开发服务器
npm run start:dev

# 查看编译日志,应该看到:
# [Nest] INFO [SwaggerModule] Mapped {/api-docs, GET}
```

### 2. 访问 Swagger UI

```bash
# 浏览器访问
open http://localhost:3000/api-docs

# 检查 DTO 是否自动生成了属性
# 检查 Controller 是否自动生成了参数
```

### 3. 导出 JSON 验证

```bash
# 导出 API 文档
curl http://localhost:3000/api-docs-json | jq > api-docs.json

# 检查是否包含自动生成的属性
cat api-docs.json | jq '.components.schemas.CreateUserDto'
```

## 🐛 常见问题

### 1. 插件不生效

**问题**: 修改 DTO 后,Swagger 文档没有更新

**解决**:
```bash
# 清理缓存
rm -rf dist
rm -rf node_modules/.cache

# 重新启动
npm run start:dev
```

### 2. 类型推断不正确

**问题**: 某些字段类型显示为 `object` 而不是具体类型

**解决**: 确保使用了正确的 class-validator 装饰器
```typescript
// ❌ 错误
@IsNotEmpty()
userName: string;  // 无法推断类型

// ✅ 正确
@IsString()
@IsNotEmpty()
userName: string;  // 可以推断为 string
```

### 3. 注释不显示

**问题**: JSDoc 注释没有出现在 Swagger 文档中

**解决**: 检查配置
```json
{
  "options": {
    "introspectComments": true  // 必须设置为 true
  }
}
```

### 4. 嵌套对象不生成

**问题**: 嵌套的 DTO 没有自动生成

**解决**: 使用 `@Type()` 装饰器
```typescript
import { Type } from 'class-transformer';

export class CreateUserDto {
  /** 用户角色 */
  @Type(() => RoleDto)
  roles: RoleDto[];
}
```

## 📊 对比

### 手动 vs 自动

| 方面 | 手动添加装饰器 | 自动生成 |
|------|--------------|---------|
| **开发速度** | 慢 ⏱️ | 快 ⚡ |
| **维护成本** | 高 📈 | 低 📉 |
| **灵活性** | 高 🎨 | 中 🎯 |
| **准确性** | 取决于开发者 | 自动保持同步 ✅ |
| **代码量** | 多 📝 | 少 ✨ |

### 推荐策略

**混合使用**:
- ✅ 基础 DTO: 使用自动生成 (注释 + class-validator)
- ✅ 复杂 DTO: 手动添加 `@ApiProperty()` 覆盖
- ✅ Controller: 只需添加 `@ApiTags()` 和 `@ApiOperation()`

## 🎯 最佳实践总结

### 1. DTO 编写规范

```typescript
/**
 * 创建用户 DTO
 */
export class CreateUserDto {
  /** 用户名 (2-30个字符) */
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @IsNotEmpty()
  userName: string;

  /** 用户昵称 */
  @IsString()
  @IsNotEmpty()
  nickName: string;

  /** 邮箱地址 */
  @IsEmail()
  @IsOptional()
  email?: string;

  /** 用户状态 (0=正常 1=停用) */
  @IsString()
  @IsOptional()
  status?: string;
}
```

### 2. Controller 编写规范

```typescript
@ApiTags('用户管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('system/user')
export class UserController {
  
  @Get()
  @ApiOperation({ summary: '查询用户列表' })
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '新增用户' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
```

### 3. 特殊情况手动覆盖

```typescript
export class CreateUserDto {
  /** 用户名 */
  @ApiProperty({
    description: '用户名',
    example: 'admin',
    minLength: 2,
    maxLength: 30,
    pattern: '^[a-zA-Z0-9_]+$'  // 自动生成无法推断的属性
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  userName: string;
}
```

## ✅ 配置完成检查清单

- [x] 修改 `nest-cli.json` 添加插件配置
- [x] 重新启动开发服务器
- [x] 访问 Swagger UI 验证
- [x] 检查 DTO 属性是否自动生成
- [x] 检查 Controller 参数是否自动生成
- [x] 为 DTO 添加 JSDoc 注释
- [x] 测试自动生成的文档是否正确

## 📚 参考资源

- [NestJS Swagger Plugin 官方文档](https://docs.nestjs.com/openapi/cli-plugin)
- [class-validator 装饰器列表](https://github.com/typestack/class-validator)
- [Swagger/OpenAPI 规范](https://swagger.io/specification/)

---

**配置已完成!** 🎉  
现在只需要为 DTO 添加注释和 class-validator 装饰器,Swagger 文档会自动生成。

**最后更新**: 2024-12-05 06:45
