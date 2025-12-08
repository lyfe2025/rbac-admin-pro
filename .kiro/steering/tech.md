# Tech Stack

## Architecture
Monorepo with two main packages:
- `web/` - Frontend (Vue 3 SPA)
- `server-nestjs/` - Backend (NestJS REST API)

## Frontend (`web/`)
- Framework: Vue 3 with Composition API (`<script setup lang="ts">`)
- Build: Vite 7
- Language: TypeScript
- UI Library: shadcn-vue (Radix-based components)
- Styling: Tailwind CSS
- State: Pinia
- Routing: Vue Router 4
- HTTP: Axios
- Forms: VeeValidate + Zod
- Icons: Lucide Vue

## Backend (`server-nestjs/`)
- Framework: NestJS 11
- Language: TypeScript
- ORM: Prisma 7
- Database: PostgreSQL
- Auth: JWT (Passport)
- Validation: class-validator + class-transformer
- API Docs: Swagger (@nestjs/swagger)
- Logging: Winston with daily rotation
- Cache: Redis (ioredis)

## Common Commands

### Frontend (`web/` directory)
```bash
npm run dev          # Start dev server
npm run build        # Production build (includes type-check)
npm run type-check   # TypeScript validation
npm run lint         # ESLint
npm run format       # Prettier
```

### Backend (`server-nestjs/` directory)
```bash
npm run start:dev    # Start with hot reload
npm run build        # Compile to dist/
npm run check        # TypeScript check (tsc --noEmit)
npm run lint         # ESLint
npm run validate     # lint + check combined
```

### Database (Prisma)
```bash
npx prisma migrate dev    # Create and apply migration
npx prisma generate       # Regenerate client types
npx prisma studio         # Database GUI
npx prisma db seed        # Run seed script
```

### Docker
```bash
docker-compose up -d      # Start all services
docker-compose down       # Stop services
```

## API Response Format
All API responses follow this structure:
```json
{
  "code": 10000,
  "msg": "操作成功",
  "data": { ... }
}
```
- `code: 10000` = success
- Other codes indicate specific business errors (see error-code.enum.ts)
