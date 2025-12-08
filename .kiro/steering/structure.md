# Project Structure

## Root
```
├── web/                 # Vue 3 frontend
├── server-nestjs/       # NestJS backend
├── db/                  # Database scripts (schema.sql, init_data.sql)
├── docs/                # Documentation (Chinese)
└── docker-compose.yml   # Full stack deployment
```

## Backend (server-nestjs/src/)
```
├── main.ts              # Bootstrap, Swagger setup
├── app.module.ts        # Root module, global interceptors
├── auth/                # JWT authentication
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── dto/
├── system/              # Core business modules
│   ├── user/            # User management
│   ├── role/            # Role management
│   ├── menu/            # Menu/permission management
│   ├── dept/            # Department management
│   ├── dict/            # Dictionary (type + data)
│   ├── config/          # System parameters
│   ├── notice/          # Announcements
│   └── post/            # Job positions
├── monitor/             # Monitoring modules
│   ├── operlog/         # Operation logs
│   ├── logininfor/      # Login history
│   ├── online/          # Online users
│   ├── server/          # Server status
│   ├── cache/           # Redis cache
│   └── job/             # Scheduled jobs
├── common/              # Shared utilities
│   ├── decorators/      # @Log decorator
│   ├── enums/           # ErrorCode enum
│   ├── exceptions/      # BusinessException
│   ├── filters/         # Global exception filter
│   ├── interceptors/    # Transform, OperationLog
│   ├── logger/          # Winston logger service
│   ├── middleware/      # HTTP logger
│   └── utils/           # IP utilities
├── prisma/              # Prisma module
└── redis/               # Redis module
```

## Module Pattern (Backend)
Each module follows:
```
module-name/
├── module-name.module.ts    # NestJS module
├── module-name.controller.ts # REST endpoints
├── module-name.service.ts   # Business logic
└── dto/
    ├── create-*.dto.ts      # Create validation
    ├── update-*.dto.ts      # Update validation
    └── query-*.dto.ts       # Query params
```

## Frontend (web/src/)
```
├── main.ts              # App bootstrap
├── App.vue              # Root component
├── permission.ts        # Route guards
├── api/                 # API calls by module
│   ├── login.ts
│   ├── system/          # system/* endpoints
│   └── monitor/         # monitor/* endpoints
├── components/
│   ├── ui/              # shadcn-vue components
│   ├── common/          # Shared (TablePagination)
│   └── business/        # Domain components
├── views/               # Page components
│   ├── system/          # System management pages
│   ├── monitor/         # Monitoring pages
│   └── tool/            # Dev tools
├── stores/modules/      # Pinia stores
├── router/              # Vue Router config
├── directive/           # Custom directives (v-permission)
├── utils/               # Helpers (request, format, auth)
└── types/               # TypeScript types
```

## API Conventions
- Base path: `/api` (proxied in dev)
- Auth: Bearer JWT token
- Response format: `{ code, msg, data }` or `{ code, msg, rows, total }`
- Pagination: `pageNum`, `pageSize` query params
