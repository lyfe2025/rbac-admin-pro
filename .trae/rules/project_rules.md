# 项目开发规范 (Monorepo)

## 📂 目录结构
- **web/**: 前端项目 (Vue 3 + Vite)
- **server-nestjs/**: 后端项目 (NestJS)
- **db/**: 数据库脚本
- **docs/**: 项目文档

## 🛠️ 技术栈

### 前端 (web)
- **框架**: Vue 3 (Script Setup) + TypeScript + Vite
- **UI**: shadcn-vue (Tailwind CSS)
- **图标**: Lucide Vue Next
- **状态**: Pinia
- **路由**: Vue Router 4

### 后端 (server-nestjs)
- **框架**: NestJS (TypeScript)
- **数据库**: PostgreSQL

## 🧩 组件管理 (前端)
- **位置**: `web/src/components/ui/`
- **安装命令**: 必须进入 `web` 目录执行
  ```bash
  cd web
  npx shadcn-vue@latest add <组件名>
  ```
- **严禁复制粘贴代码**，必须使用 CLI 安装。

## 📝 代码规范

### TypeScript
- **接口定义**: 需与 `db/schema.sql` 中的表结构保持一致。
- **配置**: 
  - 前端配置: `web/tsconfig.app.json`
  - 后端配置: `server-nestjs/tsconfig.json`

### Vue (前端)
- **语法**: 统一使用 `<script setup lang="ts">`。
- **页面路径**: `web/src/views/<模块>/<页面>/index.vue`。
- **Mock 数据**: 
  - 存放在 `web/src/api/`。
  - 当前使用 `Promise` + `setTimeout` 模拟，未来对接 `server-nestjs`。

## 🚀 常用命令

所有前端命令需在 `web/` 目录下执行：

- **启动**: `cd web && npm run dev`
- **检查**: `cd web && npm run type-check`
- **构建**: `cd web && npm run build`
