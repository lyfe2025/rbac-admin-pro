import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    return this.prisma.sysUser.findFirst({
      where: {
        userName: username,
        delFlag: '0', // 未删除
      },
      include: {
        dept: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async getUserInfo(userId: string) {
    const user = await this.prisma.sysUser.findUnique({
      where: { userId: BigInt(userId) },
      include: {
        dept: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) return null;

    const roles = user.roles.map((ur) => ur.role.roleKey);
    const isAdmin = roles.includes('admin');

    let permissions: string[] = [];

    if (isAdmin) {
      permissions = ['*:*:*'];
    } else {
      // 查询角色关联的菜单权限
      const roleIds = user.roles.map((ur) => ur.roleId);
      const menus = await this.prisma.sysMenu.findMany({
        where: {
          roles: {
            some: {
              roleId: { in: roleIds },
            },
          },
          status: '0',
          perms: { not: '' }, // 过滤掉没有权限标识的
        },
        select: { perms: true },
      });

      permissions = menus
        .map((m) => m.perms)
        .filter((p) => !!p) // 过滤 null/empty
        .map((p) => p as string); // 类型断言
    }

    // 移除密码等敏感信息
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userInfo } = user;

    return {
      user: userInfo,
      roles,
      permissions,
    };
  }

  /**
   * 查询用户列表
   */
  async findAll(query: QueryUserDto) {
    const {
      userName,
      phonenumber,
      status,
      deptId,
      pageNum = 1,
      pageSize = 10,
    } = query;
    const skip = (pageNum - 1) * pageSize;

    const where: Prisma.SysUserWhereInput = {
      delFlag: '0',
    };

    if (userName) {
      where.userName = { contains: userName };
    }
    if (phonenumber) {
      where.phonenumber = { contains: phonenumber };
    }
    if (status) {
      where.status = status;
    }
    if (deptId) {
      // 部门查询通常包含子部门
      // 1. 查出该部门及其子部门ID
      // 这里的逻辑比较复杂，因为 ancestors 是字符串。
      // 简单起见，我们先只查当前部门，或者如果前端传的是 id，我们假设要查这个 id 下的所有
      // 更好的做法是先查出所有子部门 ID 列表
      /*
       const dept = await this.prisma.sysDept.findUnique({ where: { deptId } });
       if (dept) {
          const children = await this.prisma.sysDept.findMany({
             where: { ancestors: { contains: deptId } },
             select: { deptId: true }
          });
          const deptIds = [deptId, ...children.map(d => d.deptId)];
          where.deptId = { in: deptIds };
       }
       */
      // 暂时只精确匹配
      where.deptId = BigInt(deptId);
    }

    const [total, rows] = await Promise.all([
      this.prisma.sysUser.count({ where }),
      this.prisma.sysUser.findMany({
        where,
        skip: Number(skip),
        take: Number(pageSize),
        include: {
          dept: true,
        },
        orderBy: { userId: 'asc' },
      }),
    ]);

    // 移除密码
    const safeRows = rows.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    });

    return { total, rows: safeRows };
  }

  /**
   * 查询用户详情 (用于编辑)
   */
  async findOne(userId: string) {
    const user = await this.prisma.sysUser.findUnique({
      where: { userId: BigInt(userId) },
      include: {
        roles: true, // 关联 SysUserRole
        // posts: true,
      },
    });

    if (!user) return null;

    const roleIds = user.roles.map((ur) => ur.roleId);
    // const postIds = user.posts.map(up => up.postId);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, roles, ...userInfo } = user;

    return {
      data: userInfo,
      roleIds,
      // postIds
    };
  }

  /**
   * 新增用户
   */
  async create(createUserDto: CreateUserDto) {
    // 检查用户名唯一性
    const exist = await this.prisma.sysUser.findFirst({
      where: { userName: createUserDto.userName, delFlag: '0' },
    });
    if (exist) {
      throw new BadRequestException('用户账号已存在');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { roleIds, postIds, password, deptId, ...userData } = createUserDto;

    // 密码加密
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password || '123456', salt);

    return this.prisma.$transaction(async (tx) => {
      // 1. 创建用户
      const user = await tx.sysUser.create({
        data: {
          ...userData,
          deptId: deptId ? BigInt(deptId) : null,
          password: hashedPassword,
          createTime: new Date(),
        },
      });

      // 2. 绑定角色
      if (roleIds && roleIds.length > 0) {
        await tx.sysUserRole.createMany({
          data: roleIds.map((roleId) => ({
            userId: user.userId,
            roleId: BigInt(roleId),
          })),
        });
      }

      // 3. 绑定岗位
      if (postIds && postIds.length > 0) {
        await tx.sysUserPost.createMany({
          data: postIds.map((postId) => ({
            userId: user.userId,
            postId: BigInt(postId),
          })),
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: p, ...result } = user;
      return result;
    });
  }

  /**
   * 修改用户
   */
  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.sysUser.findUnique({ where: { userId: BigInt(userId) } });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { roleIds, postIds, password, deptId, ...userData } = updateUserDto;
    // 注意：这里通常不修改密码，密码修改有单独接口

    return this.prisma.$transaction(async (tx) => {
      // 1. 更新基本信息
      const updatedUser = await tx.sysUser.update({
        where: { userId: BigInt(userId) },
        data: {
          ...userData,
          ...(deptId !== undefined ? { deptId: deptId ? BigInt(deptId) : null } : {}),
          updateTime: new Date(),
        },
      });

      // 2. 更新角色
      if (roleIds !== undefined) {
        await tx.sysUserRole.deleteMany({ where: { userId: BigInt(userId) } });
        if (roleIds.length > 0) {
          await tx.sysUserRole.createMany({
            data: roleIds.map((roleId) => ({
              userId: BigInt(userId),
              roleId: BigInt(roleId),
            })),
          });
        }
      }

      // 3. 更新岗位
      if (postIds !== undefined) {
        await tx.sysUserPost.deleteMany({ where: { userId: BigInt(userId) } });
        if (postIds.length > 0) {
          await tx.sysUserPost.createMany({
            data: postIds.map((postId) => ({
              userId: BigInt(userId),
              postId: BigInt(postId),
            })),
          });
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: p, ...result } = updatedUser;
      return result;
    });
  }

  /**
   * 删除用户
   */
  async remove(userId: string) {
    if (userId === '1') {
      // 假设1是超级管理员或者通过其他方式判断
      // throw new BadRequestException('不允许删除超级管理员');
    }

    // 逻辑删除
    return this.prisma.sysUser.update({
      where: { userId: BigInt(userId) },
      data: { delFlag: '2' },
    });
  }

  /**
   * 重置密码
   */
  async resetPassword(userId: string, password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.sysUser.update({
      where: { userId: BigInt(userId) },
      data: { password: hashedPassword },
    });
  }

  /**
   * 修改状态
   */
  async changeStatus(userId: string, status: string) {
    return this.prisma.sysUser.update({
      where: { userId: BigInt(userId) },
      data: { status, updateTime: new Date() },
    });
  }
}
