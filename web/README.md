# RBAC Admin Pro - Frontend (Web)

基于 Vue 3 + TypeScript + Shadcn-Vue 的现代化后台管理前端。

## 🛠️ 技术栈 (Tech Stack)

- **Framework**: [Vue 3](https://vuejs.org/) (Script Setup)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [Shadcn-Vue](https://www.shadcn-vue.com/) (Radix Vue + Tailwind CSS)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Router**: [Vue Router 4](https://router.vuejs.org/)
- **Icons**: [Lucide Vue Next](https://lucide.dev/guide/packages/lucide-vue-next)
- **HTTP Client**: [Axios](https://axios-http.com/)

## ✨ 功能特性 (Features)

- **🔐 完善的权限控制**: 
  - 页面级权限 (路由守卫)
  - 按钮级权限 (自定义指令 `v-hasPermi`)
  - 动态路由生成 (基于后端 API)
- **🎨 动态主题系统**: 
  - 支持 7 种主题色切换
  - 深色模式 (Dark Mode) 支持
  - 实时圆角/样式定制
  - 持久化存储配置
- **📱 响应式布局**: 适配移动端与桌面端
- **🧩 丰富的组件库**: 集成 Shadcn-Vue 全套组件
- **📊 仪表盘**: 包含 KPI 卡片与图表展示

## 🚀 开发指南 (Development)

### 环境准备
确保本地已安装 Node.js (推荐 v18+)。

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:5173 即可预览。

### 构建生产环境
```bash
npm run build
```

### 代码检查
```bash
npm run type-check
```

## 📂 目录结构 (Directory Structure)

```text
src/
├── api/             # API 接口定义 (Mock 数据)
├── assets/          # 静态资源
├── components/      # 公共组件
│   └── ui/          # Shadcn UI 组件
├── directive/       # 自定义指令 (权限指令等)
├── layout/          # 布局组件 (Sidebar, Header)
├── router/          # 路由配置
├── stores/          # Pinia 状态管理
├── utils/           # 工具函数 (Request, Auth)
└── views/           # 页面视图
    ├── dashboard/   # 仪表盘
    ├── system/      # 系统管理 (用户/角色/菜单)
    ├── monitor/     # 系统监控
    └── ...
```

## 🔌 后端接口 (API)

当前项目默认使用 Mock 数据。
如需对接真实后端，请修改 `src/utils/request.ts` 中的 `baseURL` 配置，并参考根目录下的 `docs/后端开发集成指南.md`。
