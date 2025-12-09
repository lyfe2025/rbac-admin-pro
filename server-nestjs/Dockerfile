# ============================================================================
# RBAC Admin Pro - 后端 Dockerfile (适配 Zeabur monorepo 部署)
# ============================================================================

FROM node:20-alpine

# 安装必要的构建工具和 pnpm
RUN apk add --no-cache python3 make g++ tzdata && \
    corepack enable && corepack prepare pnpm@latest --activate

# 设置时区
ENV TZ=Asia/Shanghai

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package.json ./
COPY prisma ./prisma/

# 安装所有依赖（包括 devDependencies 用于构建）
RUN pnpm install

# 复制源代码
COPY . .

# 生成 Prisma Client
RUN DATABASE_URL="postgresql://temp:temp@localhost:5432/temp" pnpm prisma generate

# 构建应用
RUN pnpm build

# 验证构建产物
RUN test -f dist/main.js || (echo "Build failed: dist/main.js not found" && exit 1)

# 清理 devDependencies 减小镜像体积
RUN pnpm prune --prod

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main.js"]
