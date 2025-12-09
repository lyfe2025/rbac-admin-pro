# 技术栈

## 架构
Monorepo 结构：
- `web/` - 前端 Vue 3 SPA
- `server-nestjs/` - 后端 NestJS REST API

## 前端 (web/)
- Vue 3 + Composition API (`<script setup lang="ts">`)
- Vite 7 构建
- TypeScript 5.9
- shadcn-vue (基于 Radix Vue) UI 组件
- Tailwind CSS 样式
- Pinia 状态管理
- Vue Router 4
- Axios HTTP 客户端
- VeeValidate + Zod 表单验证
- Lucide Vue Next 图标

## 后端 (server-nestjs/)
- NestJS 11
- TypeScript
- Prisma 7 ORM
- PostgreSQL 16
- Redis (ioredis) 缓存
- JWT + Passport 认证
- class-validator + class-transformer 验证
- Swagger API 文档
- Winston + daily-rotate-file 日志

## 常用命令

### 前端 (web/)
```bash
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run type-check   # TypeScript 检查
npm run lint         # ESLint
npm run format       # Prettier
```

### 后端 (server-nestjs/)
```bash
npm run start:dev    # 开发服务器 (热重载)
npm run build        # 编译
npm run check        # tsc --noEmit
npm run validate     # lint + check
```

### Prisma
```bash
npx prisma migrate dev    # 创建并应用迁移
npx prisma generate       # 生成客户端类型
npx prisma studio         # 数据库 GUI
npx prisma db seed        # 种子数据
```

### Docker
```bash
docker-compose up -d      # 启动 PostgreSQL + Redis
docker-compose down       # 停止服务
```

## API 响应格式
```json
{
  "code": 200,
  "msg": "success",
  "data": { ... }
}
```

## 错误码规范
- 1xxxx: 通用错误
- 2xxxx: 认证授权
- 3xxxx: 用户管理
- 4xxxx: 角色管理
- 5xxxx: 部门管理
- 6xxxx: 菜单管理
- 7xxxx: 字典/岗位
- 8xxxx: 系统配置
- 9xxxx: 监控日志

详见 `server-nestjs/src/common/enums/error-code.enum.ts`
