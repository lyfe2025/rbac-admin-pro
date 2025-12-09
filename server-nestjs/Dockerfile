# ============================================================================
# RBAC Admin Pro - 后端 Dockerfile (适配 Zeabur monorepo 部署)
# ============================================================================

# ==================== 构建阶段 ====================
FROM node:20-alpine AS builder

# 安装必要的构建工具和 pnpm
RUN apk add --no-cache python3 make g++ && \
    corepack enable && corepack prepare pnpm@latest --activate

# 设置工作目录
WORKDIR /app

# 复制 package 文件（不使用 --frozen-lockfile，因为没有 lock 文件）
COPY package.json ./
COPY prisma ./prisma/

# 安装依赖
RUN pnpm install

# 复制源代码
COPY . .

# 生成 Prisma Client（构建时使用临时 URL，运行时会被环境变量覆盖）
RUN DATABASE_URL="postgresql://temp:temp@localhost:5432/temp" pnpm prisma generate

# 构建应用
RUN pnpm build

# ==================== 生产阶段 ====================
FROM node:20-alpine

# 安装 tzdata 用于时区设置，启用 pnpm
RUN apk add --no-cache tzdata && \
    corepack enable && corepack prepare pnpm@latest --activate

# 设置时区为上海
ENV TZ=Asia/Shanghai

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# 设置工作目录
WORKDIR /app

# 复制 package 文件并安装生产依赖
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
RUN pnpm install --prod

# 从构建阶段复制 Prisma Client 和编译产物
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# 创建日志目录
RUN mkdir -p logs && chown -R nestjs:nodejs logs

# 切换到非 root 用户
USER nestjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动应用
CMD ["node", "dist/main.js"]
