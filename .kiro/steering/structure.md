# Project Structure

```
rbac-admin-pro/
├── web/                          # Frontend (Vue 3)
│   ├── src/
│   │   ├── api/                  # API modules by domain
│   │   │   ├── system/           # System management APIs
│   │   │   └── monitor/          # Monitoring APIs
│   │   ├── components/
│   │   │   ├── ui/               # shadcn-vue components (CLI installed)
│   │   │   ├── common/           # Reusable business components
│   │   │   └── business/         # Domain-specific components
│   │   ├── views/                # Page components by route
│   │   │   ├── system/           # System management pages
│   │   │   ├── monitor/          # Monitoring pages
│   │   │   └── tool/             # Tool pages
│   │   ├── stores/modules/       # Pinia stores
│   │   ├── router/               # Vue Router config
│   │   ├── utils/                # Utilities (request, auth, format)
│   │   ├── types/                # TypeScript types
│   │   └── directive/            # Vue directives (permissions)
│   └── components.json           # shadcn-vue config
│
├── server-nestjs/                # Backend (NestJS)
│   ├── src/
│   │   ├── auth/                 # Authentication module
│   │   ├── system/               # System management modules
│   │   │   ├── user/             # User CRUD
│   │   │   ├── role/             # Role management
│   │   │   ├── dept/             # Department hierarchy
│   │   │   ├── menu/             # Menu configuration
│   │   │   ├── dict/             # Dictionary data
│   │   │   ├── config/           # System parameters
│   │   │   ├── post/             # Job positions
│   │   │   └── notice/           # Announcements
│   │   ├── monitor/              # Monitoring modules
│   │   │   ├── operlog/          # Operation logs
│   │   │   ├── logininfor/       # Login history
│   │   │   ├── online/           # Online users
│   │   │   ├── server/           # Server status
│   │   │   ├── cache/            # Cache management
│   │   │   └── job/              # Scheduled jobs
│   │   ├── common/               # Shared utilities
│   │   │   ├── decorators/       # Custom decorators (@Log)
│   │   │   ├── enums/            # Error codes
│   │   │   ├── exceptions/       # BusinessException
│   │   │   ├── filters/          # Exception filters
│   │   │   ├── interceptors/     # Response transform, logging
│   │   │   ├── logger/           # Winston logger
│   │   │   └── middleware/       # HTTP logging
│   │   ├── prisma/               # Prisma service
│   │   └── redis/                # Redis service
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   ├── migrations/           # Migration history
│   │   └── seed.ts               # Seed data
│   └── uploads/                  # File uploads
│
├── db/                           # Database scripts
│   ├── schema.sql                # Table definitions
│   └── init_data.sql             # Initial data
│
├── docs/                         # Documentation (Chinese)
│   ├── 指南/                     # Usage guides
│   ├── 开发规范/                 # Development standards
│   └── 历史记录/                 # Change history
│
└── docker-compose.yml            # Docker orchestration
```

## Module Pattern (Backend)
Each module follows this structure:
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

## Component Pattern (Frontend)
- Views: Full page components in `views/{domain}/index.vue`
- UI: shadcn-vue primitives in `components/ui/`
- Business: Domain components in `components/business/`
- Common: Reusable widgets in `components/common/`
