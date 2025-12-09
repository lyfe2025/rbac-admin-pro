# 项目结构

```
rbac-admin-pro/
├── web/                          # 前端 Vue 3
│   └── src/
│       ├── api/                  # API 模块 (system/, monitor/)
│       ├── components/
│       │   ├── ui/               # shadcn-vue 组件
│       │   ├── common/           # 通用组件
│       │   └── business/         # 业务组件
│       ├── views/                # 页面 (system/, monitor/, tool/)
│       ├── stores/modules/       # Pinia stores
│       ├── router/               # 路由配置
│       ├── utils/                # 工具函数
│       ├── types/                # TypeScript 类型
│       └── directive/            # Vue 指令
│
├── server-nestjs/                # 后端 NestJS
│   ├── src/
│   │   ├── auth/                 # 认证模块
│   │   ├── system/               # 系统管理
│   │   │   └── user|role|dept|menu|dict|config|post|notice/
│   │   ├── monitor/              # 监控模块
│   │   │   └── operlog|logininfor|online|server|cache|job/
│   │   ├── common/               # 公共模块
│   │   │   └── decorators|enums|exceptions|filters|interceptors|logger|middleware/
│   │   ├── prisma/               # Prisma 服务
│   │   └── redis/                # Redis 服务
│   └── prisma/
│       ├── schema.prisma         # 数据库 Schema
│       ├── migrations/           # 迁移文件
│       └── seed.ts               # 种子数据
│
├── db/                           # SQL 脚本
├── docs/                         # 文档 (中文)
└── docker-compose.yml
```

## 后端模块结构
```
module-name/
├── dto/
│   ├── create-xxx.dto.ts
│   ├── update-xxx.dto.ts
│   └── query-xxx.dto.ts
├── xxx.controller.ts
├── xxx.service.ts
└── xxx.module.ts
```

## 前端组件分类
- `views/{domain}/index.vue` - 页面组件
- `components/ui/` - shadcn-vue 基础组件
- `components/business/` - 业务组件
- `components/common/` - 通用组件

## 数据库命名
- 表名：`sys_` 前缀，snake_case
- 字段：snake_case
- 主表：sys_user, sys_role, sys_dept, sys_menu
- 关联表：sys_user_role, sys_role_menu
- 日志表：sys_oper_log, sys_login_log
