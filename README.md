<h1 align="center">RBAC Admin Pro</h1>

<p align="center">
  <strong>企业级全栈后台管理系统</strong>
</p>

<p align="center">
  基于 Vue 3 + NestJS + Prisma 的现代化 RBAC 权限管理系统
</p>

<p align="center">
  <a href="https://rbac.zeabur.app/login" target="_blank">🌐 在线演示</a> |
  <a href="https://api-rbac.zeabur.app/api-docs" target="_blank">📖 API 文档</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs" alt="NestJS">
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

---

## 功能特性

### 权限管理
- **用户管理** - 用户 CRUD、角色分配、部门分配、状态控制、密码重置
- **角色管理** - 角色权限配置、菜单权限绑定、数据权限
- **菜单管理** - 动态菜单配置、按钮级权限控制
- **部门管理** - 树形组织架构、层级关系管理

### 系统监控
- **操作日志** - 用户操作审计记录
- **登录日志** - 登录历史与安全审计
- **在线用户** - 实时在线用户管理、强制下线
- **服务监控** - 服务器状态、CPU、内存监控
- **缓存监控** - Redis 缓存管理
- **数据库监控** - 数据库连接状态监控

### 系统功能
- **岗位管理** - 职位定义与用户关联
- **字典管理** - 系统字典类型与数据维护
- **参数配置** - 系统级参数动态配置
- **通知公告** - 系统公告发布与管理
- **定时任务** - 任务调度管理

### 安全特性
- **JWT 认证** - 无状态 Token 认证
- **双因素认证** - TOTP 二次验证
- **验证码** - 图形验证码防护
- **Token 黑名单** - 安全登出机制

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| **前端** | Vue 3 + Composition API | 3.5 |
| | Vite | 7 |
| | TypeScript | 5.9 |
| | shadcn-vue (Radix Vue + Reka UI) | 2 |
| | Tailwind CSS | 3.4 |
| | Pinia | 3 |
| | VeeValidate + Zod | - |
| **后端** | NestJS | 11 |
| | Prisma ORM | 7 |
| | PostgreSQL | 16 |
| | Redis (ioredis) | - |
| | JWT + Passport | - |
| | Swagger | - |
| | Winston 日志 | - |

---

## 项目结构

```
rbac-admin-pro/
├── web/                  # 前端 (Vue 3 + Vite)
│   └── src/
│       ├── api/          # API 接口 (system/monitor/tool)
│       ├── components/   # 组件 (ui/common/business)
│       ├── views/        # 页面
│       ├── stores/       # Pinia 状态管理
│       ├── router/       # 路由配置
│       ├── directive/    # 自定义指令
│       └── utils/        # 工具函数
├── server-nestjs/        # 后端 (NestJS)
│   ├── src/
│   │   ├── auth/         # 认证模块 (JWT/验证码/双因素)
│   │   ├── system/       # 系统管理 (user/role/dept/menu/dict/config/post/notice)
│   │   ├── monitor/      # 监控模块 (operlog/logininfor/online/server/cache/job)
│   │   ├── common/       # 公共模块 (decorators/guards/filters/interceptors)
│   │   ├── prisma/       # Prisma 服务
│   │   └── redis/        # Redis 服务
│   └── prisma/           # 数据库 Schema & 迁移
├── db/                   # 数据库脚本
├── docs/                 # 项目文档
└── docker-compose.yml    # Docker 编排
```

---

## 快速开始

### 方式一：Docker 一键部署（推荐）

适合快速体验或生产部署。

```bash
# 1. 克隆项目
git clone https://github.com/your-username/rbac-admin-pro.git
cd rbac-admin-pro

# 2. 配置环境变量
cp .env.docker.example .env
# 编辑 .env，修改 POSTGRES_PASSWORD 和 JWT_SECRET

# 3. 启动所有服务
docker-compose up -d
```

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost |
| 后端 API | http://localhost:3000 |
| Swagger 文档 | http://localhost:3000/api-docs |

---

### 方式二：本地开发（pnpm workspace）

适合开发调试，推荐使用 pnpm。

#### 环境要求
- Node.js >= 18
- PostgreSQL 16
- Redis
- pnpm（推荐）/ npm

#### 1. 启动基础服务

```bash
# 使用 Docker 启动数据库和 Redis
docker-compose up -d postgres redis
```

#### 2. 安装依赖并初始化

```bash
# 安装 pnpm（如未安装）
npm install -g pnpm

# 在根目录安装所有依赖
pnpm install

# 初始化数据库
cp server-nestjs/.env.example server-nestjs/.env  # 配置数据库连接
pnpm db:migrate                                    # 应用迁移
pnpm db:seed                                       # 导入种子数据
```

#### 3. 启动开发服务器

```bash
# 一键启动前后端
pnpm dev

# 或分别启动
pnpm dev:web      # 只启动前端 (http://localhost:5173)
pnpm dev:server   # 只启动后端 (http://localhost:3000)
```

#### 交互式控制台（可选）

```bash
./monorepo.sh     # 交互式菜单（使用 npm）
```

`monorepo.sh` 提供交互式菜单，包含：一键启停、数据库迁移、Prisma Studio、代码检查、API 冒烟测试、数据库重置等功能。

---

**默认账号:** `admin` / `admin123`

---

## 常用命令

<details>
<summary><b>根目录命令（pnpm workspace）</b></summary>

```bash
pnpm dev              # 同时启动前后端
pnpm dev:web          # 只启动前端
pnpm dev:server       # 只启动后端
pnpm build            # 构建前后端
pnpm lint             # 检查所有代码
pnpm format           # 格式化所有代码
pnpm type-check       # 前端类型检查
pnpm validate         # 后端 lint + 类型检查
pnpm db:migrate       # 数据库迁移
pnpm db:seed          # 种子数据
pnpm db:studio        # Prisma GUI
```

</details>

<details>
<summary><b>前端命令 (web/)</b></summary>

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run type-check   # TypeScript 类型检查
npm run lint         # ESLint 检查
npm run format       # Prettier 格式化
```

</details>

<details>
<summary><b>后端命令 (server-nestjs/)</b></summary>

```bash
npm run start:dev    # 启动开发服务器 (热重载)
npm run build        # 编译构建
npm run validate     # lint + 类型检查
npm run format       # Prettier 格式化
```

</details>

<details>
<summary><b>数据库命令 (Prisma)</b></summary>

```bash
npx prisma migrate dev    # 创建并应用迁移
npx prisma generate       # 重新生成客户端
npx prisma studio         # 数据库 GUI
npx prisma db seed        # 运行种子脚本
```

</details>

---

## MCP Server 配置

本项目前端使用 [shadcn-vue](https://www.shadcn-vue.com/) 组件库，支持通过 MCP (Model Context Protocol) 让 AI 助手更好地理解和使用组件。

### 配置方法

在 IDE 的 MCP 配置文件中添加以下配置：

<details>
<summary><b>Cursor / VS Code / Kiro</b></summary>

编辑 `.cursor/mcp.json`、`.vscode/mcp.json` 或 `.kiro/settings/mcp.json`：

```json
{
  "mcpServers": {
    "shadcn-vue": {
      "command": "npx",
      "args": ["-y", "@shadcn-vue/mcp@latest"]
    }
  }
}
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) 或 `%APPDATA%\Claude\claude_desktop_config.json` (Windows)：

```json
{
  "mcpServers": {
    "shadcn-vue": {
      "command": "npx",
      "args": ["-y", "@shadcn-vue/mcp@latest"]
    }
  }
}
```

</details>

### 功能说明

配置后，AI 助手可以：
- 浏览和搜索 shadcn-vue 组件库
- 获取组件使用示例和 API 文档
- 智能推荐适合的组件
- 生成符合项目规范的组件代码

更多信息请参考：[shadcn-vue MCP 文档](https://www.shadcn-vue.com/docs/mcp)

---

## 文档

- [文档中心](docs/README.md)
- [环境配置说明](docs/指南/环境配置说明.md)
- [Prisma 使用指南](docs/指南/Prisma使用指南.md)
- [Swagger 使用指南](docs/指南/Swagger使用指南.md)
- [Docker 部署指南](docs/指南/Docker部署指南.md)
- [文件存储配置指南](docs/指南/文件存储配置指南.md)
- [SMTP 邮件配置指南](docs/指南/SMTP邮件配置指南.md)
- [pnpm 使用指南](docs/指南/pnpm使用指南.md)

---

## License

[MIT](LICENSE)
