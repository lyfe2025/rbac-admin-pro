# 技术栈

## 架构
Monorepo 结构，包含两个主要包：
- `web/` - 前端 (Vue 3 SPA)
- `server-nestjs/` - 后端 (NestJS REST API)

## 前端 (`web/`)
- 框架：Vue 3 + Composition API (`<script setup lang="ts">`)
- 构建：Vite 7
- 语言：TypeScript
- UI 组件库：shadcn-vue (基于 Radix Vue)
- 样式：Tailwind CSS
- 状态管理：Pinia
- 路由：Vue Router 4
- HTTP 客户端：Axios
- 表单验证：VeeValidate + Zod
- 图标：Lucide Vue Next

## 后端 (`server-nestjs/`)
- 框架：NestJS 11
- 语言：TypeScript
- ORM：Prisma 7
- 数据库：PostgreSQL 16
- 认证：JWT (Passport)
- 验证：class-validator + class-transformer
- API 文档：Swagger (@nestjs/swagger)
- 日志：Winston + daily-rotate-file
- 缓存：Redis (ioredis)

## 常用命令

### 前端 (`web/` 目录)
```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建 (含类型检查)
npm run type-check   # TypeScript 类型检查
npm run lint         # ESLint 检查
npm run format       # Prettier 格式化
```

### 后端 (`server-nestjs/` 目录)
```bash
npm run start:dev    # 启动开发服务器 (热重载)
npm run build        # 编译到 dist/
npm run check        # TypeScript 检查 (tsc --noEmit)
npm run lint         # ESLint 检查
npm run validate     # lint + check 组合
```

### 数据库 (Prisma)
```bash
npx prisma migrate dev    # 创建并应用迁移
npx prisma generate       # 重新生成客户端类型
npx prisma studio         # 数据库 GUI
npx prisma db seed        # 运行种子脚本
```

### Docker
```bash
docker-compose up -d      # 启动所有服务
docker-compose down       # 停止服务
```

## API 响应格式
所有 API 响应遵循统一结构：
```json
{
  "code": 200,
  "msg": "success",
  "data": { ... }
}
```
- `code: 200` = 成功
- 其他错误码见 `server-nestjs/src/common/enums/error-code.enum.ts`

## 错误码规范
- 1xxxx: 通用错误
- 2xxxx: 认证授权
- 3xxxx: 用户管理
- 4xxxx: 角色管理
- 5xxxx: 部门管理
- 6xxxx: 菜单管理
- 7xxxx: 字典/岗位管理
- 8xxxx: 系统配置
- 9xxxx: 监控日志
