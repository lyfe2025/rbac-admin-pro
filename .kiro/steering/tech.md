# Tech Stack

## Monorepo Structure
- `web/` - Vue 3 frontend
- `server-nestjs/` - NestJS backend
- `db/` - PostgreSQL schema and seed data

## Backend (server-nestjs)
- **Framework**: NestJS 11 with TypeScript
- **ORM**: Prisma 7 with PostgreSQL
- **Auth**: JWT (passport-jwt), bcrypt for passwords
- **Cache**: Redis (ioredis)
- **Logging**: Winston with daily rotate
- **API Docs**: Swagger (@nestjs/swagger)
- **Validation**: class-validator, class-transformer

## Frontend (web)
- **Framework**: Vue 3.5 with Composition API (`<script setup>`)
- **Build**: Vite 7
- **State**: Pinia
- **Router**: Vue Router 4
- **UI**: shadcn-vue (radix-vue based), Tailwind CSS
- **Forms**: vee-validate with zod
- **HTTP**: Axios
- **Icons**: lucide-vue-next

## Infrastructure
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Container**: Docker Compose

## Common Commands

### Backend (server-nestjs/)
```bash
npm run start:dev     # Dev server with watch
npm run build         # Production build
npm run lint          # ESLint fix
npm run check         # TypeScript check (tsc --noEmit)
npm run validate      # lint + check
npx prisma generate   # Generate Prisma client
npx prisma migrate dev # Run migrations
npx prisma db seed    # Seed database
```

### Frontend (web/)
```bash
npm run dev           # Vite dev server
npm run build         # Production build (vue-tsc + vite)
npm run type-check    # TypeScript check
npm run lint          # ESLint fix
npm run format        # Prettier format
```

### Docker
```bash
docker-compose up -d           # Start all services
docker-compose up postgres redis  # Start only DB services
```

## Code Style
- **Backend**: Prettier (singleQuote, trailingComma: all)
- **Frontend**: Prettier (no semi, singleQuote, printWidth: 100)
- ESLint with TypeScript rules
- `@typescript-eslint/no-explicit-any`: off (allowed)
