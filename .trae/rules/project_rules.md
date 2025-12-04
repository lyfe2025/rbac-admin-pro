# 🏗️ 项目开发规范 (Monorepo)

## 📂 目录结构
- **web/**: 前端项目 (Vue 3 + Vite)
- **server-nestjs/**: 后端项目 (NestJS)
- **db/**: 数据库初始化脚本
- **docs/**: 项目文档 (已按前后端分类)

---

## 🎨 前端规范 (Web)

### 🛠 技术栈
- **核心**: Vue 3 (Script Setup) + TypeScript + Vite
- **UI库**: shadcn-vue (Tailwind CSS) + Lucide Icons
- **状态**: Pinia
- **路由**: Vue Router 4

### 📏 命名与文件
- **组件文件**: 使用 `PascalCase` (如 `UserProfile.vue`)。
- **普通文件**: 使用 `kebab-case` (如 `user-service.ts`)。
- **目录名称**: 统一使用 `kebab-case` (如 `user-management/`)。

### 🧩 组件与开发
1.  **UI组件**:
    - 存放: `web/src/components/ui/`
    - **安装**: **严禁手动复制**，必须进入 `web` 目录使用 CLI：
      ```bash
      npx shadcn-vue@latest add <组件名>
      ```
2.  **页面开发**:
    - 路径: `web/src/views/<模块>/<页面>/index.vue`
    - 语法: 统一使用 `<script setup lang="ts">`
    - **组合式API**: 复杂逻辑抽取为 `useXxx` (Composables)。
3.  **API 交互**:
    - 位置: `web/src/api/`
    - 规范: 保持与后端统一的响应结构 `{ code, msg, data }`。
    - 命名: 使用动词开头 (如 `getUser`, `updateRole`)。

### 🚀 常用命令
> 需在 `web/` 目录下执行
- **启动**: `npm run dev`
- **检查**: `npm run type-check` (TypeScript 类型检查)
- **构建**: `npm run build`

---

## ⚙️ 后端规范 (Server)

### 🛠 技术栈
- **核心**: NestJS (TypeScript)
- **数据库**: PostgreSQL + Prisma ORM

### 🧱 架构与分层
1.  **Controller (控制器)**:
    - 仅负责路由定义、DTO 校验和调用 Service。
    - **严禁**在 Controller 中写业务逻辑。
2.  **Service (服务层)**:
    - 包含所有核心业务逻辑。
    - 数据库操作应通过 Prisma Client 进行。
3.  **DTO (数据传输对象)**:
    - 必须使用 `class-validator` 进行参数验证。
    - 放在 `dto/` 目录下，命名如 `create-user.dto.ts`。

### 💾 数据库管理 (Prisma)
- **Schema**: `server-nestjs/prisma/schema.prisma` 为单一事实来源。
- **变更**: 修改 Schema 后，必须执行 `npx prisma migrate dev` 生成迁移文件并同步数据库。
- **Client**: 变更后需执行 `npx prisma generate` 更新 TypeScript 类型。

### 🚀 常用命令
> 需在 `server-nestjs/` 目录下执行
- **启动(开发)**: `npm run start:dev`
- **检查**: `npm run lint` (ESLint) / `npm run check` (TSC)
- **数据库UI**: `npx prisma studio` (浏览器查看数据)

---

## 🔗 通用规范

### TypeScript
- **接口一致性**: 前端 `interface` 需与后端 `Prisma Model` (数据库表) 保持字段定义一致。
- **类型安全**: 避免使用 `any`，应充分利用 TypeScript 类型推导。

### Git 规范
- **提交格式**: `<type>(<scope>): <subject>`
- **示例**: `feat(auth): add login api`, `fix(user): fix update logic`

### 📝 注释规范
- **语言**: 统一使用 **中文** 进行注释。
- **原则**: 
  - **关键逻辑**: 必须添加注释，解释“为什么这样做”而不是“做了什么”。
  - **接口/方法**: 必须包含 JSDoc 风格的注释，说明参数、返回值和可能的异常。
  - **复杂算法**: 在代码块前简要说明算法思路。

---

## 🤖 AI 协作指南 (For Trae)
1.  **先搜索，后创建**: 在编写新代码前，先搜索项目中是否已有类似的工具函数或组件，避免重复造轮子。
2.  **保持上下文**: 修改文件时，注意保留原有的注释和代码风格。
3.  **破坏性变更**: 如果需要删除文件或修改数据库 Schema，**必须**先向用户解释原因并请求确认。
4.  **代码解释与注释**: 
    - 对于复杂的逻辑修改，**必须**在代码中添加清晰的 **中文注释**。
    - 在回答中简要说明实现思路。
5.  **强制自我校验**: 每次修改代码后，**必须**运行相应的检查命令（前端 `npm run type-check`，后端 `npm run validate` 或相关测试），确保没有引入错误。
6.  **验证建议**: 完成代码修改后，主动建议用户如何验证（如：“你可以运行 `npm run dev` 并访问 `/login` 页面进行测试”）。
