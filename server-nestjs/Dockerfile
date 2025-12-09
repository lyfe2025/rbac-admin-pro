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

# 安装所有依赖
RUN pnpm install

# 复制源代码
COPY . .

# 显示目录结构
RUN echo "=== 源代码目录 ===" && ls -la && ls -la src/

# 生成 Prisma Client
RUN DATABASE_URL="postgresql://temp:temp@localhost:5432/temp" pnpm prisma generate

# 构建应用（使用 nest build 直接调用）
RUN echo "=== 开始构建 ===" && ./node_modules/.bin/nest build && echo "=== 构建完成 ==="

# 显示构建结果
RUN echo "=== 构建产物 ===" && ls -la dist/ || echo "dist 目录不存在"

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main.js"]
