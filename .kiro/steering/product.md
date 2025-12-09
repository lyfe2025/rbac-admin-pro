# RBAC Admin Pro

企业级全栈后台管理系统，基于 RBAC (Role-Based Access Control) 权限模型。

## 核心功能

### 系统管理
- 用户管理：CRUD、角色/部门/岗位分配、状态控制、密码重置、头像上传
- 角色管理：权限配置、菜单绑定、数据权限范围
- 部门管理：树形组织架构、层级关系
- 菜单管理：动态菜单、按钮级权限 (perms)、图标配置
- 岗位管理：岗位编码、排序
- 字典管理：字典类型 + 字典数据，支持样式配置
- 参数配置：系统参数键值对
- 通知公告：富文本内容、通知/公告类型

### 系统监控
- 操作日志：记录增删改操作、请求参数、响应结果
- 登录日志：登录 IP、地点、浏览器、状态
- 在线用户：查看在线用户、支持强制下线
- 服务器监控：CPU、内存、磁盘、JVM 信息
- 缓存监控：Redis 缓存状态
- 定时任务：Cron 表达式、任务执行日志

### 安全特性
- JWT Token 认证
- 两步验证 (2FA/TOTP)
- 图形验证码
- 密码加密 (bcrypt)
- Token 黑名单
- XSS 防护 (sanitize-html)

## 语言规范
- UI 界面：简体中文
- 代码注释：中文
- API 响应消息：中文
- 文档：中文
- Git 提交：中文 (`类型: 描述`)

### Git 提交类型
| 类型 | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复 Bug |
| docs | 文档更新 |
| style | 代码格式 |
| refactor | 重构 |
| perf | 性能优化 |
| test | 测试相关 |
| chore | 构建/工具 |

## 默认账号
- 用户名：`admin`
- 密码：`admin123`

## 权限标识格式
菜单权限标识 (perms) 格式：`模块:实体:操作`

示例：
- `system:user:list` - 用户列表
- `system:user:add` - 新增用户
- `system:user:edit` - 修改用户
- `system:user:remove` - 删除用户
- `system:user:export` - 导出用户
- `system:user:resetPwd` - 重置密码
