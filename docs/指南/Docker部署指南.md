# Docker 部署指南

## 📋 目录

- [前置要求](#前置要求)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [常用命令](#常用命令)
- [故障排查](#故障排查)
- [生产环境建议](#生产环境建议)

---

## 前置要求

### 系统要求
- Docker 20.10+
- Docker Compose 2.0+
- 至少 2GB 可用内存
- 至少 10GB 可用磁盘空间

### 安装 Docker

**macOS:**
```bash
brew install --cask docker
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**验证安装:**
```bash
docker --version
docker-compose --version
```

---

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd rbac-admin-pro
```

### 2. 配置环境变量（可选）
```bash
# 创建 .env 文件用于 docker-compose
cp .env.example .env

# 修改敏感配置（生产环境必须修改）
# JWT_SECRET=your-super-secret-key
```

### 3. 启动所有服务
```bash
docker-compose up -d
```

### 4. 查看服务状态
```bash
docker-compose ps
```

### 5. 访问应用
- 前端: http://localhost
- 后端 API: http://localhost:3000
- 数据库: localhost:5432
- Redis: localhost:6379

### 6. 默认登录账号
- 用户名: `admin`
- 密码: `admin123`

---

## 配置说明

### docker-compose.yml 配置项

#### PostgreSQL 配置
```yaml
environment:
  POSTGRES_DB: rbac_admin_pro        # 数据库名
  POSTGRES_USER: rbac_admin          # 用户名
  POSTGRES_PASSWORD: RbacAdmin@2024  # 密码（生产环境请修改）
```

#### Redis 配置
```yaml
command: redis-server --appendonly yes  # 启用 AOF 持久化
```

#### 后端服务配置
```yaml
environment:
  NODE_ENV: production                  # 运行环境
  PORT: 3000                           # 服务端口
  DATABASE_URL: postgresql://...       # 数据库连接
  REDIS_URL: redis://redis:6379        # Redis 连接
  JWT_SECRET: ${JWT_SECRET}            # JWT 密钥（从 .env 读取）
  JWT_EXPIRES_IN: 7d                   # Token 过期时间
  LOG_LEVEL: info                      # 日志级别
```

### 端口映射

| 服务 | 容器端口 | 主机端口 | 说明 |
|------|---------|---------|------|
| web | 80 | 80 | 前端服务 |
| server | 3000 | 3000 | 后端 API |
| postgres | 5432 | 5432 | PostgreSQL |
| redis | 6379 | 6379 | Redis |

**修改端口映射示例:**
```yaml
ports:
  - "8080:80"  # 将前端映射到主机 8080 端口
```

### 数据持久化

数据卷配置:
```yaml
volumes:
  postgres_data:  # PostgreSQL 数据
  redis_data:     # Redis 数据
  server_logs:    # 后端日志
```

查看数据卷:
```bash
docker volume ls
docker volume inspect rbac-admin-pro_postgres_data
```

---

## 常用命令

### 服务管理

```bash
# 启动所有服务
docker-compose up -d

# 启动指定服务
docker-compose up -d postgres redis

# 停止所有服务
docker-compose down

# 停止并删除数据卷（⚠️ 会删除数据）
docker-compose down -v

# 重启服务
docker-compose restart

# 重启指定服务
docker-compose restart server
```

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs

# 查看指定服务日志
docker-compose logs server

# 实时跟踪日志
docker-compose logs -f server

# 查看最近 100 行日志
docker-compose logs --tail=100 server
```

### 容器管理

```bash
# 查看运行中的容器
docker-compose ps

# 进入容器 Shell
docker-compose exec server sh
docker-compose exec postgres psql -U rbac_admin -d rbac_admin_pro

# 查看容器资源使用
docker stats
```

### 数据库操作

```bash
# 进入 PostgreSQL
docker-compose exec postgres psql -U rbac_admin -d rbac_admin_pro

# 执行 SQL 文件
docker-compose exec -T postgres psql -U rbac_admin -d rbac_admin_pro < backup.sql

# 备份数据库
docker-compose exec postgres pg_dump -U rbac_admin rbac_admin_pro > backup.sql

# 恢复数据库
docker-compose exec -T postgres psql -U rbac_admin -d rbac_admin_pro < backup.sql
```

### 镜像管理

```bash
# 构建镜像
docker-compose build

# 重新构建镜像（不使用缓存）
docker-compose build --no-cache

# 拉取最新镜像
docker-compose pull

# 查看镜像
docker images | grep rbac
```

---

## 故障排查

### 1. 服务启动失败

**检查日志:**
```bash
docker-compose logs server
```

**常见问题:**
- 端口被占用: 修改 `docker-compose.yml` 中的端口映射
- 数据库连接失败: 检查 `DATABASE_URL` 配置
- 内存不足: 增加 Docker 内存限制

### 2. 数据库初始化失败

```bash
# 删除数据卷重新初始化
docker-compose down -v
docker-compose up -d
```

### 3. 前端无法访问后端

**检查网络连接:**
```bash
docker-compose exec web ping server
```

**检查 nginx 配置:**
```bash
docker-compose exec web cat /etc/nginx/conf.d/default.conf
```

### 4. 健康检查失败

```bash
# 查看健康状态
docker-compose ps

# 手动测试健康检查
docker-compose exec server node -e "require('http').get('http://localhost:3000/health', (r) => console.log(r.statusCode))"
```

### 5. 性能问题

```bash
# 查看资源使用
docker stats

# 限制容器资源
# 在 docker-compose.yml 中添加:
services:
  server:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

---

## 生产环境建议

### 1. 安全配置

**修改默认密码:**
```yaml
environment:
  POSTGRES_PASSWORD: <strong-random-password>
  JWT_SECRET: <strong-random-secret>
```

**生成强密钥:**
```bash
# JWT Secret
openssl rand -hex 32

# PostgreSQL Password
openssl rand -base64 24
```

### 2. 使用 .env 文件

创建 `.env` 文件:
```env
JWT_SECRET=your-production-secret-key
POSTGRES_PASSWORD=your-production-db-password
```

修改 `docker-compose.yml`:
```yaml
environment:
  JWT_SECRET: ${JWT_SECRET}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

### 3. 启用 HTTPS

**使用 Nginx 反向代理:**
```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com
```

**或使用 Traefik:**
```yaml
services:
  traefik:
    image: traefik:v2.10
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=your@email.com"
```

### 4. 日志管理

**配置日志轮转:**
```yaml
services:
  server:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 5. 备份策略

**自动备份脚本:**
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 备份数据库
docker-compose exec -T postgres pg_dump -U rbac_admin rbac_admin_pro > "$BACKUP_DIR/db_$DATE.sql"

# 备份 Redis
docker-compose exec redis redis-cli SAVE
docker cp rbac-redis:/data/dump.rdb "$BACKUP_DIR/redis_$DATE.rdb"

# 删除 7 天前的备份
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.rdb" -mtime +7 -delete
```

**设置定时任务:**
```bash
# 每天凌晨 2 点备份
0 2 * * * /path/to/backup.sh
```

### 6. 监控告警

**使用 Prometheus + Grafana:**
```yaml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    depends_on:
      - prometheus
```

### 7. 资源限制

```yaml
services:
  server:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 8. 网络隔离

```yaml
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # 不允许外部访问

services:
  web:
    networks:
      - frontend
  server:
    networks:
      - frontend
      - backend
  postgres:
    networks:
      - backend  # 仅内部访问
```

---

## 更新部署

### 1. 更新代码
```bash
git pull origin main
```

### 2. 重新构建镜像
```bash
docker-compose build
```

### 3. 滚动更新
```bash
# 停止旧容器
docker-compose stop server

# 启动新容器
docker-compose up -d server

# 验证服务
docker-compose ps
docker-compose logs -f server
```

### 4. 数据库迁移
```bash
# 进入容器执行迁移
docker-compose exec server npx prisma migrate deploy
```

---

## 卸载

### 完全清理
```bash
# 停止并删除容器、网络
docker-compose down

# 删除数据卷（⚠️ 会删除所有数据）
docker-compose down -v

# 删除镜像
docker rmi $(docker images | grep rbac | awk '{print $3}')
```

---

## 参考资源

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)

---

## 常见问题 FAQ

**Q: 如何修改数据库密码？**
```bash
# 1. 停止服务
docker-compose down

# 2. 删除数据卷
docker volume rm rbac-admin-pro_postgres_data

# 3. 修改 docker-compose.yml 中的密码
# 4. 重新启动
docker-compose up -d
```

**Q: 如何查看容器 IP？**
```bash
docker inspect rbac-server | grep IPAddress
```

**Q: 如何限制容器使用的资源？**
在 `docker-compose.yml` 中添加 `deploy.resources` 配置。

**Q: 数据存储在哪里？**
```bash
docker volume inspect rbac-admin-pro_postgres_data
# 查看 "Mountpoint" 字段
```

---

**最后更新**: 2024-12-05
