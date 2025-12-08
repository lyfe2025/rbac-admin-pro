# RBAC Admin Pro

Enterprise full-stack admin system with role-based access control (RBAC).

## Core Features
- User management with department hierarchy
- Role-based permission system with menu/button-level access control
- System configuration (dictionaries, parameters, notices)
- Monitoring (operation logs, login history, online users, server status)
- Scheduled job management

## Domain Model
- Users belong to departments and can have multiple roles/posts
- Roles define menu permissions and data scope (全部/本部门/自定义)
- Menus are hierarchical (目录/菜单/按钮) with permission identifiers
- Soft delete pattern: `delFlag` field (0=exists, 2=deleted)
- Status pattern: `status` field (0=normal, 1=disabled)

## Language
- Primary language: Chinese (中文)
- Code comments and documentation in Chinese
- API responses include Chinese messages
