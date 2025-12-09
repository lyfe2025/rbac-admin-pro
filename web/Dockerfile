# ============================================================================
# RBAC Admin Pro - 前端 Dockerfile (多阶段构建)
# ============================================================================

# ==================== 构建阶段 ====================
FROM node:20-alpine AS builder

# 启用 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# ==================== 生产阶段 ====================
FROM nginx:alpine

# 安装 tzdata 用于时区设置
RUN apk add --no-cache tzdata

# 设置时区为上海
ENV TZ=Asia/Shanghai

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
# 优先使用 Zeabur 配置，如果不存在则使用默认配置
COPY nginx*.conf /tmp/
RUN if [ -f /tmp/nginx.zeabur.conf ]; then \
      cp /tmp/nginx.zeabur.conf /etc/nginx/conf.d/default.conf; \
    else \
      cp /tmp/nginx.conf /etc/nginx/conf.d/default.conf; \
    fi

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
