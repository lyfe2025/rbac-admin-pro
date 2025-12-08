import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}

  async findByUsername(username: string) {
    this.logger.debug(`查询用户: ${username}`, 'UserService');
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
    this.logger.debug(`获取用户信息: ${userId}`, 'UserService');
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

    const roleKeys = user.roles.map((ur) => ur.role.roleKey);
    const roleList = user.roles.map((ur) => ({
      roleId: ur.role.roleId.toString(),
      roleName: ur.role.roleName,
      roleKey: ur.role.roleKey,
    }));
    const isAdmin = roleKeys.includes('admin');

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
      roles: roleKeys, // 保持兼容性,返回roleKey数组
      roleList, // 新增:返回完整的角色信息
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
        dept: true, // 包含部门信息
        roles: {
          include: {
            role: true, // 包含完整的角色信息
          },
        },
        posts: {
          include: {
            post: true, // 包含完整的岗位信息
          },
        },
      },
    });

    if (!user) return null;

    const roleIds = user.roles.map((ur) => ur.roleId.toString());
    const postIds = user.posts.map((up) => up.postId.toString());
    const roleList = user.roles.map((ur) => ur.role);
    const postList = user.posts.map((up) => up.post);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, roles, posts, ...userInfo } = user;

    return {
      data: userInfo,
      roleIds,
      postIds,
      roles: roleList,
      posts: postList,
    };
  }

  /**
   * 新增用户
   */
  async create(createUserDto: CreateUserDto) {
    this.logger.log(`创建用户: ${createUserDto.userName}`, 'UserService');

    // 检查用户名唯一性
    const exist = await this.prisma.sysUser.findFirst({
      where: { userName: createUserDto.userName, delFlag: '0' },
    });
    if (exist) {
      this.logger.warn(
        `创建用户失败,用户名已存在: ${createUserDto.userName}`,
        'UserService',
      );
      throw new BadRequestException('用户账号已存在');
    }

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
      this.logger.log(
        `用户创建成功: ${createUserDto.userName} (ID: ${user.userId})`,
        'UserService',
      );
      return result;
    });
  }

  /**
   * 修改用户
   */
  async update(userId: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`更新用户: ${userId}`, 'UserService');

    const user = await this.prisma.sysUser.findUnique({
      where: { userId: BigInt(userId) },
    });
    if (!user) {
      this.logger.warn(`更新用户失败,用户不存在: ${userId}`, 'UserService');
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
          ...(deptId !== undefined
            ? { deptId: deptId ? BigInt(deptId) : null }
            : {}),
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
      this.logger.log(
        `用户更新成功: ${updatedUser.userName} (ID: ${userId})`,
        'UserService',
      );
      return result;
    });
  }

  /**
   * 删除用户
   */
  async remove(userId: string) {
    this.logger.log(`删除用户: ${userId}`, 'UserService');

    if (userId === '1') {
      // 假设1是超级管理员或者通过其他方式判断
      // throw new BadRequestException('不允许删除超级管理员');
    }

    // 逻辑删除
    const result = await this.prisma.sysUser.update({
      where: { userId: BigInt(userId) },
      data: { delFlag: '2' },
    });

    this.logger.log(
      `用户删除成功: ${result.userName} (ID: ${userId})`,
      'UserService',
    );
    return result;
  }

  /**
   * 重置密码
   */
  async resetPassword(userId: string, password: string) {
    this.logger.warn(`重置用户密码: ${userId}`, 'UserService');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await this.prisma.sysUser.update({
      where: { userId: BigInt(userId) },
      data: { password: hashedPassword },
    });

    this.logger.warn(
      `密码重置成功: ${result.userName} (ID: ${userId})`,
      'UserService',
    );
    return result;
  }

  /**
   * 修改状态
   */
  async changeStatus(userId: string, status: string) {
    this.logger.log(`修改用户状态: ${userId} -> ${status}`, 'UserService');

    const result = await this.prisma.sysUser.update({
      where: { userId: BigInt(userId) },
      data: { status, updateTime: new Date() },
    });

    this.logger.log(
      `用户状态修改成功: ${result.userName} (ID: ${userId}, 状态: ${status})`,
      'UserService',
    );
    return result;
  }

  /**
   * 更新个人信息
   */
  async updateProfile(
    userId: string,
    data: {
      nickName?: string;
      email?: string;
      phonenumber?: string;
      sex?: string;
      avatar?: string;
    },
  ) {
    this.logger.log(`更新个人信息: ${userId}`, 'UserService');

    const result = await this.prisma.sysUser.update({
      where: { userId: BigInt(userId) },
      data: {
        ...(data.nickName !== undefined && { nickName: data.nickName }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phonenumber !== undefined && { phonenumber: data.phonenumber }),
        ...(data.sex !== undefined && { sex: data.sex }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
        updateTime: new Date(),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userInfo } = result;

    this.logger.log(
      `个人信息更新成功: ${result.userName} (ID: ${userId})`,
      'UserService',
    );
    return userInfo;
  }
}
