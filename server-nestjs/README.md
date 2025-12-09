# RBAC Admin Pro - Backend (NestJS)

基于 NestJS + TypeScript + PostgreSQL 的企业级后台管理系统后端服务。

## 技术栈

- **框架**: NestJS 11
- **语言**: TypeScript
- **数据库**: PostgreSQL 16
- **ORM**: Prisma 7
- **认证**: JWT + Passport
- **验证**: class-validator + class-transformer
- **日志**: Winston + daily-rotate-file
- **缓存**: Redis (ioredis)
- **API 文档**: Swagger

## 快速开始

### 环境要求

- Node.js >= 18
- PostgreSQL >= 16
- Redis >= 7

### 安装依赖

```bash
npm install
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 配置数据库连接等
```

### 初始化数据库

```bash
# 应用迁移
npx prisma migrate dev

# 生成 Prisma Client
npx prisma generate

# 填充种子数据
npx prisma db seed
```

### 运行开发服务器

```bash
npm run start:dev
```

服务运行在 http://localhost:3000

API 文档: http://localhost:3000/api-docs

## 常用命令

```bash
npm run start:dev    # 开发模式 (热重载)
npm run build        # 编译到 dist/
npm run check        # TypeScript 类型检查
npm run lint         # ESLint 检查
npm run validate     # lint + check 组合
```

### 数据库命令

```bash
npx prisma migrate dev     # 创建并应用迁移
npx prisma generate        # 重新生成 Client
npx prisma studio          # 数据库 GUI
npx prisma db seed         # 运行种子脚本
./scripts/reset-prisma.sh  # 重置数据库
```

## 目录结构

```
server-nestjs/
├── src/
│   ├── auth/              # 认证模块
│   ├── system/            # 系统管理模块
│   │   ├── user/          # 用户管理
│   │   ├── role/          # 角色管理
│   │   ├── dept/          # 部门管理
│   │   ├── menu/          # 菜单管理
│   │   ├── dict/          # 字典管理
│   │   ├── config/        # 参数配置
│   │   ├── post/          # 岗位管理
│   │   └── notice/        # 通知公告
│   ├── monitor/           # 监控模块
│   │   ├── operlog/       # 操作日志
│   │   ├── logininfor/    # 登录日志
│   │   ├── online/        # 在线用户
│   │   ├── server/        # 服务监控
│   │   ├── cache/         # 缓存监控
│   │   └── job/           # 定时任务
│   ├── common/            # 公共模块
│   ├── prisma/            # Prisma 服务
│   └── redis/             # Redis 服务
├── prisma/
│   ├── schema.prisma      # 数据库模型
│   ├── migrations/        # 迁移文件
│   └── seed.ts            # 种子数据
├── scripts/               # 工具脚本
└── uploads/               # 文件上传目录
```

## API 响应格式

```json
{
  "code": 200,
  "msg": "success",
  "data": { ... }
}
```

## 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 超级管理员 |
