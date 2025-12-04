# 🧩 Prisma 目录结构与工作原理解析

本文档旨在详细解释 `server-nestjs/prisma` 目录下的文件结构及其在项目中的作用，帮助开发者快速理解 Prisma 的工作流。

## 📂 目录结构总览

```text
server-nestjs/prisma/
├── schema.prisma       # 核心：数据库模型定义文件
├── seed.ts             # 工具：初始数据填充脚本
└── migrations/         # 记录：数据库变更历史文件夹
    ├── 20251204153919_init/
    │   └── migration.sql
    ├── 20251204154429_add_comments/
    │   └── migration.sql
    └── migration_lock.toml
```

---

## 1. `schema.prisma` (核心定义)

这是 Prisma 的心脏。它使用 Prisma 专用的 Schema Language (PSL) 来描述你的数据库结构。

### 主要作用：
1.  **定义数据源 (Datasource)**：告诉 Prisma 连接什么数据库（PostgreSQL）以及连接串在哪里。
2.  **生成器配置 (Generator)**：告诉 Prisma 生成什么样的代码（通常是生成 `PrismaClient`，供我们在 NestJS 代码中调用）。
3.  **数据模型 (Models)**：定义表结构、字段类型、关联关系。

### 代码示例与解读：

```prisma
// 1. 生成器：生成供 NestJS 使用的 TypeScript 客户端代码
generator client {
  provider = "prisma-client-js"
}

// 2. 数据源：连接 PostgreSQL
datasource db {
  provider = "postgresql"
  // url = env("DATABASE_URL") // 注意：在新版 Prisma 7 中，URL 移到了 prisma.config.ts 配置
}

// 3. 模型定义：对应数据库中的 sys_user 表
model SysUser {
  // @id: 主键, @default(uuid()): 自动生成 UUID
  userId      String    @id @default(uuid()) @map("user_id") @db.Uuid
  
  // 字段定义: 这里的 userName 对应数据库列 user_name
  userName    String    @map("user_name") @db.VarChar(30)
  
  // 关联关系: 一个用户属于一个部门
  dept        SysDept?  @relation(fields: [deptId], references: [deptId])
  
  // 映射表名: 模型名 SysUser -> 数据库表名 sys_user
  @@map("sys_user")
}
```

---

## 2. `migrations/` (变更历史)

这个目录由 `npx prisma migrate dev` 命令自动管理，类似于 Git 的版本控制，但它是针对数据库结构的。

### 为什么需要它？
*   **可回溯**：你可以清楚地看到数据库结构是如何一步步演变的。
*   **团队协作**：当其他同事拉取代码后，执行 `migrate` 命令，他们的本地数据库会自动同步成最新的结构，无需手动传 SQL 文件。
*   **生产部署**：上线时，Prisma 会检查哪些 migration 还没执行，并自动应用它们。

### 目录下的文件：
*   `20251204153919_init/migration.sql`: 第一次初始化的 SQL，创建了所有表。
*   `20251204154429_add_comments/migration.sql`: 第二次变更，我们专门添加了 SQL 注释。
*   `migration_lock.toml`: 锁文件，确保 migration 执行顺序的正确性（**不要手动修改它**）。

---

## 3. `seed.ts` (数据填充)

这是我们编写的 TypeScript 脚本，用于向数据库中写入**初始数据**（种子数据）。

### 典型用途：
*   创建超级管理员账号。
*   初始化基础配置（如默认部门、默认角色）。
*   填充测试数据。

### 如何运行？
我们在 `package.json` 或 `prisma.config.ts` 中配置了命令，当你运行：
```bash
npx prisma db seed
```
Prisma 就会自动执行这个脚本，把预设的数据插入数据库。

---

## 🔄 Prisma 工作流总结

1.  **修改模型**：你在 `schema.prisma` 中修改了字段（比如给 `SysUser` 加个 `age`）。
2.  **生成迁移**：运行 `npx prisma migrate dev --name add_age`。
    *   Prisma 会生成一个新的 SQL 文件在 `migrations/` 下。
    *   Prisma 会自动在你的本地数据库执行这个 SQL，修改表结构。
    *   Prisma 会重新生成 `node_modules/@prisma/client` 代码，让你的 TypeScript 能感知到 `age` 字段。
3.  **开发代码**：在 NestJS 中使用 `prisma.sysUser.create({ data: { age: 18 } })`。

---

## �️ 常用命令速查表

在 `server-nestjs` 目录下执行：

| 命令 | 作用 | 场景 |
| :--- | :--- | :--- |
| `npx prisma migrate dev` | **最常用**。根据 `schema.prisma` 的变更更新数据库，并记录 migration。 | 开发阶段，修改了表结构后。 |
| `npx prisma migrate dev --name <name>` | 同上，但可以给这次变更起个名字（如 `add_user_age`）。 | 提交有意义的变更记录。 |
| `npx prisma migrate reset` | **清空数据库**，重新执行所有 migration 和 seed。 | **慎用**。想重置环境从头开始时。 |
| `npx prisma generate` | 重新生成 TypeScript 类型和 Client 代码。 | 拉取别人代码后，或 Client 报错提示找不到字段时。 |
| `npx prisma db seed` | 执行 `seed.ts` 脚本，填充初始数据。 | 初始化数据库后，或者想重置测试数据时。 |
| `npx prisma studio` | 打开一个 Web 界面，可以直接查看和编辑数据库数据。 | 想直观查看数据，不想写 SQL 时。 |
| `npx prisma migrate deploy` | **生产环境专用**。只应用未执行的 migration，不生成新文件。 | 在服务器部署上线时使用。 |

---

## �💡 常见问题 (FAQ)

**Q: 我可以直接去数据库改表结构吗？**
A: **强烈不建议**。如果你手动改了数据库，Prisma 的 `schema.prisma` 和 `migrations` 就会和数据库状态不一致，导致下次迁移报错。**请始终通过修改 `schema.prisma` 来驱动变更。**

**Q: `npx prisma generate` 是做什么的？**
A: 它读取 `schema.prisma` 并生成 TypeScript 类型定义和 Client 代码。通常 `migrate dev` 会自动触发它。但在拉取别人代码后，或者 CI/CD 环境中，通常需要手动运行一次，以确保代码不报错。
