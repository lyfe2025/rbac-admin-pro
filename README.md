# RBAC Admin Pro

<p align="center">
  <strong>🚀 企业级全栈后台管理系统</strong>
</p>

<p align="center">
  基于 Vue 3 + NestJS + Prisma 的现代化 RBAC 权限管理系统
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

## ✨ 功能特性

### 🔐 权限管理
- **用户管理** - 用户 CRUD、角色分配、部门分配、状态控制
- **角色管理** - 角色权限配置、菜单权限绑定
- **菜单管理** - 动态菜单配置、按钮级权限控制
- **部门管理** - 树形组织架构、层级关系管理

### 📊 系统监控
- **操作日志** - 用户操作审计记录
- **登录日志** - 登录历史与安全审计
- **在线用户** - 实时在线用户管理、强制下线
- **服务监控** - 服务器状态、JVM、内存监控
- **缓存监控** - Redis 缓存管理

### 🛠️ 系统功能
- **岗位管理** - 职位定义与用户关联
- **字典管理** - 系统字典类型与数据维护
- **参数配置** - 系统级参数动态配置
- **通知公告** - 系统公告发布与管理

---

## 🖼️ 系统截图

> 📸 截图待添加

<!-- 
![登录页面](docs/screenshots/login.png)
![首页](docs/screenshots/dashboard.png)
![用户管理](docs/screenshots/user.png)
-->

---

## 🛠️ 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| **前端** | Vue 3 + Composition API | 3.5 |
| | Vite | 7 |
| | TypeScript | 5.9 |
| | shadcn-vue (Radix Vue) | - |
| | Tailwind CSS | 3.4 |
| | Pinia | 3 |
| **后端** | NestJS | 11 |
| | Prisma ORM | 7 |
| | PostgreSQL | 16 |
| | Redis | - |
| | JWT + Passport | - |
| | Swagger | - |

---

## �  项目结构

```
rbac-admin-pro/
├── web/                  # 前端 (Vue 3 + Vite)
│   ├── src/
│   │   ├── api/          # API 接口
│   │   ├── components/   # 组件 (ui/common/business)
│   │   ├── views/        # 页面
│   │   ├── stores/       # Pinia 状态管理
│   │   ├── router/       # 路由配置
│   │   └── utils/        # 工具函数
│   └── ...
├── server-nestjs/        # 后端 (NestJS)
│   ├── src/
│   │   ├── auth/         # 认证模块
│   │   ├── system/       # 系统管理 (user/role/dept/menu...)
│   │   ├── monitor/      # 监控模块 (operlog/online/cache...)
│   │   └── common/       # 公共模块
│   ├── prisma/           # 数据库 Schema & 迁移
│   └── ...
├── db/                   # 数据库脚本
├── docs/                 # 项目文档
└── docker-compose.yml    # Docker 编排
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- PostgreSQL 16
- Redis
- pnpm / npm

### 1. 克隆项目

```bash
git clone https://github.com/your-username/rbac-admin-pro.git
cd rbac-admin-pro
```

### 2. 启动基础服务

```bash
docker-compose up -d   # 启动 PostgreSQL + Redis
```

### 3. 启动后端

```bash
cd server-nestjs
npm install
cp .env.example .env          # 配置环境变量
npx prisma migrate dev        # 初始化数据库
npx prisma db seed            # 导入种子数据
npm run start:dev             # 启动服务
```

### 4. 启动前端

```bash
cd web
npm install
npm run dev
```

### 5. 访问系统

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:5173 |
| 后端 API | http://localhost:3000 |
| Swagger 文档 | http://localhost:3000/api-docs |

**默认账号:** `admin` / `admin123`

---

## 📋 常用命令

<details>
<summary><b>前端命令</b></summary>

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run type-check   # TypeScript 类型检查
npm run lint         # ESLint 检查
npm run format       # Prettier 格式化
```

</details>

<details>
<summary><b>后端命令</b></summary>

```bash
npm run start:dev    # 启动开发服务器 (热重载)
npm run build        # 编译构建
npm run validate     # lint + 类型检查
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

## 📚 文档

- [📖 文档中心](docs/README.md)
- [🔧 环境配置说明](docs/指南/环境配置说明.md)
- [💾 Prisma 使用指南](docs/指南/Prisma使用指南.md)
- [📝 Swagger 使用指南](docs/指南/Swagger使用指南.md)
- [🐳 Docker 部署指南](docs/指南/Docker部署指南.md)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 License

[MIT](LICENSE)
