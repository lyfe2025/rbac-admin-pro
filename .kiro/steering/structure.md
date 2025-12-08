# 项目结构

```
rbac-admin-pro/
├── web/                          # 前端 (Vue 3)
│   ├── src/
│   │   ├── api/                  # API 模块 (按领域划分)
│   │   │   ├── system/           # 系统管理 API
│   │   │   └── monitor/          # 监控 API
│   │   ├── components/
│   │   │   ├── ui/               # shadcn-vue 组件 (CLI 安装)
│   │   │   ├── common/           # 通用业务组件
│   │   │   └── business/         # 领域特定组件
│   │   ├── views/                # 页面组件 (按路由划分)
│   │   │   ├── system/           # 系统管理页面
│   │   │   ├── monitor/          # 监控页面
│   │   │   └── tool/             # 工具页面
│   │   ├── stores/modules/       # Pinia stores
│   │   ├── router/               # Vue Router 配置
│   │   ├── utils/                # 工具函数 (request, auth, format)
│   │   ├── types/                # TypeScript 类型定义
│   │   └── directive/            # Vue 指令 (权限)
│   └── components.json           # shadcn-vue 配置
│
├── server-nestjs/                # 后端 (NestJS)
│   ├── src/
│   │   ├── auth/                 # 认证模块
│   │   ├── system/               # 系统管理模块
│   │   │   ├── user/             # 用户 CRUD
│   │   │   ├── role/             # 角色管理
│   │   │   ├── dept/             # 部门层级
│   │   │   ├── menu/             # 菜单配置
│   │   │   ├── dict/             # 字典数据
│   │   │   ├── config/           # 系统参数
│   │   │   ├── post/             # 岗位
│   │   │   └── notice/           # 公告
│   │   ├── monitor/              # 监控模块
│   │   │   ├── operlog/          # 操作日志
│   │   │   ├── logininfor/       # 登录历史
│   │   │   ├── online/           # 在线用户
│   │   │   ├── server/           # 服务状态
│   │   │   ├── cache/            # 缓存管理
│   │   │   └── job/              # 定时任务
│   │   ├── common/               # 公共模块
│   │   │   ├── decorators/       # 自定义装饰器 (@Log)
│   │   │   ├── enums/            # 错误码枚举
│   │   │   ├── exceptions/       # BusinessException
│   │   │   ├── filters/          # 异常过滤器
│   │   │   ├── interceptors/     # 响应转换、日志拦截器
│   │   │   ├── logger/           # Winston 日志
│   │   │   └── middleware/       # HTTP 日志中间件
│   │   ├── prisma/               # Prisma 服务
│   │   └── redis/                # Redis 服务
│   ├── prisma/
│   │   ├── schema.prisma         # 数据库 Schema
│   │   ├── migrations/           # 迁移历史
│   │   └── seed.ts               # 种子数据
│   └── uploads/                  # 文件上传目录
│
├── db/                           # 数据库脚本
│   ├── schema.sql                # 表结构
│   └── init_data.sql             # 初始数据
│
├── docs/                         # 文档 (中文)
│
└── docker-compose.yml            # Docker 编排
```

## 后端模块结构
每个模块遵循以下结构：
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
- Views: 页面组件 `views/{domain}/index.vue`
- UI: shadcn-vue 基础组件 `components/ui/`
- Business: 领域组件 `components/business/`
- Common: 通用组件 `components/common/`

## 数据库表命名
所有表使用 `sys_` 前缀，字段使用 snake_case：
- sys_user, sys_role, sys_dept, sys_menu
- sys_user_role, sys_role_menu (关联表)
- sys_oper_log, sys_login_log (日志表)
