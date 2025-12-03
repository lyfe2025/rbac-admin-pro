# RBAC Admin Pro

**企业级全栈后台管理系统 (Enterprise Full-Stack Admin System)**

`Vue 3` + `TypeScript` + `Shadcn-Vue` + `NestJS` (Planned)

---

## 📂 项目结构 (Project Structure)

本项目采用 **Monorepo** 结构管理前后端代码：

```text
rbac-admin-pro/
├── web/               # 🖥️ 前端项目 (Vue 3 + Vite)
│   ├── src/
│   └── ...
├── server-nestjs/     # 🚀 后端项目 (NestJS) - [开发中]
│   ├── src/
│   └── ...
├── db/                # 💾 数据库脚本 (PostgreSQL)
│   ├── schema.sql     # 表结构
│   └── init_data.sql  # 初始化数据
└── docs/              # 📚 开发文档
```

## 🚀 快速开始 (Quick Start)

### 前端 (Web)

```bash
cd web
npm install
npm run dev
```

### 后端 (Server)

*🚧 后端服务初始化中...*

## 📚 文档 (Documentation)

*   [后端开发集成指南](docs/后端开发集成指南.md)
*   [脚本说明与环境配置](docs/脚本说明与环境配置.md)
