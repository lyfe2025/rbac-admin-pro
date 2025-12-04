import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding ...');

  // 1. Init Dept (层级结构)
  const ensureDept = async (data: {
    deptName: string;
    orderNum?: number;
    status?: '0' | '1';
    parentId?: bigint | null;
    leader?: string;
    phone?: string;
    email?: string;
  }) => {
    const existed = await prisma.sysDept.findFirst({
      where: { deptName: data.deptName, delFlag: '0' },
    });
    let ancestors = '0';
    if (data.parentId) {
      const parent = await prisma.sysDept.findUnique({
        where: { deptId: data.parentId },
      });
      if (parent) {
        ancestors = `${parent.ancestors || '0'},${data.parentId}`;
      }
    }
    if (existed) {
      return prisma.sysDept.update({
        where: { deptId: existed.deptId },
        data: {
          ...data,
          ancestors,
        },
      });
    }
    return prisma.sysDept.create({
      data: {
        deptName: data.deptName,
        orderNum: data.orderNum ?? 0,
        status: data.status ?? '0',
        parentId: data.parentId ?? null,
        leader: data.leader ?? '',
        phone: data.phone ?? '',
        email: data.email ?? '',
        ancestors,
      },
    });
  };

  const rootDept = await ensureDept({
    deptName: '总公司',
    orderNum: 0,
    status: '0',
    parentId: null,
    leader: '张总',
  });
  const techDept = await ensureDept({
    deptName: '技术部',
    orderNum: 1,
    parentId: rootDept.deptId,
    leader: '李工',
  });
  await ensureDept({
    deptName: '研发一部',
    orderNum: 2,
    parentId: techDept.deptId,
    leader: '王工',
  });
  await ensureDept({
    deptName: '测试一部',
    orderNum: 3,
    parentId: techDept.deptId,
    leader: '赵工',
  });
  await ensureDept({
    deptName: '人事部',
    orderNum: 4,
    parentId: rootDept.deptId,
    leader: '刘姐',
  });
  await ensureDept({
    deptName: '财务部',
    orderNum: 5,
    parentId: rootDept.deptId,
    leader: '钱会',
  });
  const eastBranch = await ensureDept({
    deptName: '华东分公司',
    orderNum: 6,
    parentId: rootDept.deptId,
    leader: '孙总',
  });
  await ensureDept({
    deptName: '上海办事处',
    orderNum: 7,
    parentId: eastBranch.deptId,
    leader: '周主任',
  });
  await ensureDept({
    deptName: '杭州办事处',
    orderNum: 8,
    parentId: eastBranch.deptId,
    leader: '吴主任',
  });
  console.log('Initialized department hierarchy');

  // 2. Init Role
  const role = await prisma.sysRole.create({
    data: {
      roleName: '超级管理员',
      roleKey: 'admin',
      roleSort: 1,
      status: '0',
    },
  });
  console.log(`Created role with id: ${role.roleId}`);

  // 3. 初始化用户（使用 bcrypt 加密密码，保持与服务层一致）
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('123456', salt);
  const user = await prisma.sysUser.create({
    data: {
      userName: 'admin',
      nickName: '超级管理员',
      password: hashedPassword,
      status: '0',
      deptId: rootDept.deptId,
    },
  });
  console.log(`Created user with id: ${user.userId}`);

  // 4. Link User and Role (Optional but recommended)
  await prisma.sysUserRole.create({
    data: {
      userId: user.userId,
      roleId: role.roleId,
    },
  });
  console.log('Linked user and role');

  // 5. 初始化基础菜单（存在则跳过，避免重复）
  const ensureMenu = async (data: {
    menuName: string;
    path: string;
    component: string;
    orderNum: number;
    menuType: 'M' | 'C' | 'F';
    visible?: '0' | '1';
    status?: '0' | '1';
    icon?: string;
    isFrame?: number;
    parentId?: bigint | null;
    perms?: string | null;
  }) => {
    const existed = await prisma.sysMenu.findFirst({
      where: { path: data.path },
    });
    if (existed) {
      return prisma.sysMenu.update({ where: { menuId: existed.menuId }, data });
    }
    return prisma.sysMenu.create({ data });
  };

  const ensureButton = async (data: {
    menuName: string;
    parentId: bigint;
    perms: string;
    orderNum?: number;
  }) => {
    const existed = await prisma.sysMenu.findFirst({
      where: { perms: data.perms },
    });
    if (existed) return existed;
    return prisma.sysMenu.create({
      data: {
        menuName: data.menuName,
        parentId: data.parentId,
        orderNum: data.orderNum ?? 0,
        menuType: 'F',
        visible: '1',
        status: '0',
        perms: data.perms,
        isFrame: 1,
        path: '',
        icon: '#',
      },
    });
  };

  const getMenuByPath = async (parentId: bigint, path: string) => {
    return prisma.sysMenu.findFirst({
      where: { parentId, path },
    });
  };

  const systemDir = await ensureMenu({
    menuName: '系统管理',
    path: 'system',
    component: 'Layout',
    orderNum: 1,
    menuType: 'M',
    visible: '0',
    status: '0',
    icon: 'settings',
    isFrame: 1,
    parentId: null,
  });
  await ensureMenu({
    menuName: '用户管理',
    parentId: systemDir.menuId,
    path: 'user',
    component: 'system/user/index',
    orderNum: 1,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:user:list',
    icon: 'user',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '角色管理',
    parentId: systemDir.menuId,
    path: 'role',
    component: 'system/role/index',
    orderNum: 2,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:role:list',
    icon: 'users',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '菜单管理',
    parentId: systemDir.menuId,
    path: 'menu',
    component: 'system/menu/index',
    orderNum: 3,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:menu:list',
    icon: 'menu',
    isFrame: 1,
  });

  // system: 其余模块补充
  await ensureMenu({
    menuName: '部门管理',
    parentId: systemDir.menuId,
    path: 'dept',
    component: 'system/dept/index',
    orderNum: 4,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:dept:list',
    icon: 'building-2',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '岗位管理',
    parentId: systemDir.menuId,
    path: 'post',
    component: 'system/post/index',
    orderNum: 5,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:post:list',
    icon: 'badge-check',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '字典管理',
    parentId: systemDir.menuId,
    path: 'dict',
    component: 'system/dict/index',
    orderNum: 6,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:dict:list',
    icon: 'book-a',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '参数设置',
    parentId: systemDir.menuId,
    path: 'config',
    component: 'system/config/index',
    orderNum: 7,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:config:list',
    icon: 'settings-2',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '系统设置',
    parentId: systemDir.menuId,
    path: 'setting',
    component: 'system/setting/index',
    orderNum: 8,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:setting:view',
    icon: 'sliders-vertical',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '通知公告',
    parentId: systemDir.menuId,
    path: 'notice',
    component: 'system/notice/index',
    orderNum: 9,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:notice:list',
    icon: 'megaphone',
    isFrame: 1,
  });

  const monitorDir = await ensureMenu({
    menuName: '系统监控',
    path: 'monitor',
    component: 'Layout',
    orderNum: 2,
    menuType: 'M',
    visible: '0',
    status: '0',
    icon: 'monitor',
    isFrame: 1,
    parentId: null,
  });
  await ensureMenu({
    menuName: '在线用户',
    parentId: monitorDir.menuId,
    path: 'online',
    component: 'monitor/online/index',
    orderNum: 1,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'monitor:online:list',
    icon: 'user-check',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '操作日志',
    parentId: monitorDir.menuId,
    path: 'operlog',
    component: 'monitor/operlog/index',
    orderNum: 2,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'monitor:operlog:list',
    icon: 'list',
    isFrame: 1,
  });

  // monitor: 其余模块补充
  await ensureMenu({
    menuName: '登录日志',
    parentId: monitorDir.menuId,
    path: 'logininfor',
    component: 'monitor/logininfor/index',
    orderNum: 3,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'monitor:logininfor:list',
    icon: 'log-in',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '定时任务',
    parentId: monitorDir.menuId,
    path: 'job',
    component: 'monitor/job/index',
    orderNum: 4,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'monitor:job:list',
    icon: 'alarm-clock',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '服务监控',
    parentId: monitorDir.menuId,
    path: 'server',
    component: 'monitor/server/index',
    orderNum: 5,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'monitor:server:view',
    icon: 'server',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '缓存监控',
    parentId: monitorDir.menuId,
    path: 'cache',
    component: 'monitor/cache/index',
    orderNum: 6,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'monitor:cache:view',
    icon: 'database-backup',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '数据监控',
    parentId: monitorDir.menuId,
    path: 'druid',
    component: 'monitor/druid/index',
    orderNum: 7,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'monitor:druid:view',
    icon: 'database',
    isFrame: 1,
  });

  const toolDir = await ensureMenu({
    menuName: '系统工具',
    path: 'tool',
    component: 'Layout',
    orderNum: 3,
    menuType: 'M',
    visible: '0',
    status: '0',
    icon: 'tool',
    isFrame: 1,
    parentId: null,
  });
  await ensureMenu({
    menuName: '代码生成',
    parentId: toolDir.menuId,
    path: 'gen',
    component: 'tool/gen/index',
    orderNum: 1,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'tool:gen:list',
    icon: 'code-xml',
    isFrame: 1,
  });
  await ensureMenu({
    menuName: '接口文档',
    parentId: toolDir.menuId,
    path: 'swagger',
    component: 'tool/swagger/index',
    orderNum: 2,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'tool:swagger:view',
    icon: 'file-text',
    isFrame: 1,
  });

  // tool: 其余模块补充
  await ensureMenu({
    menuName: '表单构建',
    parentId: toolDir.menuId,
    path: 'build',
    component: 'tool/build/index',
    orderNum: 3,
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'tool:build:view',
    icon: 'factory',
    isFrame: 1,
  });

  // 按钮权限补充（F）
  const userMenu = await getMenuByPath(systemDir.menuId, 'user');
  if (userMenu) {
    await ensureButton({
      menuName: '用户新增',
      parentId: userMenu.menuId,
      perms: 'system:user:add',
      orderNum: 1,
    });
    await ensureButton({
      menuName: '用户修改',
      parentId: userMenu.menuId,
      perms: 'system:user:edit',
      orderNum: 2,
    });
    await ensureButton({
      menuName: '用户删除',
      parentId: userMenu.menuId,
      perms: 'system:user:remove',
      orderNum: 3,
    });
    await ensureButton({
      menuName: '重置密码',
      parentId: userMenu.menuId,
      perms: 'system:user:resetPwd',
      orderNum: 4,
    });
    await ensureButton({
      menuName: '修改状态',
      parentId: userMenu.menuId,
      perms: 'system:user:changeStatus',
      orderNum: 5,
    });
  }
  const roleMenu = await getMenuByPath(systemDir.menuId, 'role');
  if (roleMenu) {
    await ensureButton({
      menuName: '角色新增',
      parentId: roleMenu.menuId,
      perms: 'system:role:add',
      orderNum: 1,
    });
    await ensureButton({
      menuName: '角色修改',
      parentId: roleMenu.menuId,
      perms: 'system:role:edit',
      orderNum: 2,
    });
    await ensureButton({
      menuName: '角色删除',
      parentId: roleMenu.menuId,
      perms: 'system:role:remove',
      orderNum: 3,
    });
  }
  const menuMenu = await getMenuByPath(systemDir.menuId, 'menu');
  if (menuMenu) {
    await ensureButton({
      menuName: '菜单新增',
      parentId: menuMenu.menuId,
      perms: 'system:menu:add',
      orderNum: 1,
    });
    await ensureButton({
      menuName: '菜单修改',
      parentId: menuMenu.menuId,
      perms: 'system:menu:edit',
      orderNum: 2,
    });
    await ensureButton({
      menuName: '菜单删除',
      parentId: menuMenu.menuId,
      perms: 'system:menu:remove',
      orderNum: 3,
    });
  }
  const deptMenu = await getMenuByPath(systemDir.menuId, 'dept');
  if (deptMenu) {
    await ensureButton({
      menuName: '部门新增',
      parentId: deptMenu.menuId,
      perms: 'system:dept:add',
      orderNum: 1,
    });
    await ensureButton({
      menuName: '部门修改',
      parentId: deptMenu.menuId,
      perms: 'system:dept:edit',
      orderNum: 2,
    });
    await ensureButton({
      menuName: '部门删除',
      parentId: deptMenu.menuId,
      perms: 'system:dept:remove',
      orderNum: 3,
    });
  }
  const postMenu = await getMenuByPath(systemDir.menuId, 'post');
  if (postMenu) {
    await ensureButton({
      menuName: '岗位新增',
      parentId: postMenu.menuId,
      perms: 'system:post:add',
      orderNum: 1,
    });
    await ensureButton({
      menuName: '岗位修改',
      parentId: postMenu.menuId,
      perms: 'system:post:edit',
      orderNum: 2,
    });
    await ensureButton({
      menuName: '岗位删除',
      parentId: postMenu.menuId,
      perms: 'system:post:remove',
      orderNum: 3,
    });
  }
  const dictMenu = await getMenuByPath(systemDir.menuId, 'dict');
  if (dictMenu) {
    await ensureButton({
      menuName: '字典新增',
      parentId: dictMenu.menuId,
      perms: 'system:dict:add',
      orderNum: 1,
    });
    await ensureButton({
      menuName: '字典修改',
      parentId: dictMenu.menuId,
      perms: 'system:dict:edit',
      orderNum: 2,
    });
    await ensureButton({
      menuName: '字典删除',
      parentId: dictMenu.menuId,
      perms: 'system:dict:remove',
      orderNum: 3,
    });
  }
  const configMenu = await getMenuByPath(systemDir.menuId, 'config');
  if (configMenu) {
    await ensureButton({
      menuName: '参数新增',
      parentId: configMenu.menuId,
      perms: 'system:config:add',
      orderNum: 1,
    });
    await ensureButton({
      menuName: '参数修改',
      parentId: configMenu.menuId,
      perms: 'system:config:edit',
      orderNum: 2,
    });
    await ensureButton({
      menuName: '参数删除',
      parentId: configMenu.menuId,
      perms: 'system:config:remove',
      orderNum: 3,
    });
  }
  const noticeMenu = await getMenuByPath(systemDir.menuId, 'notice');
  if (noticeMenu) {
    await ensureButton({
      menuName: '公告新增',
      parentId: noticeMenu.menuId,
      perms: 'system:notice:add',
      orderNum: 1,
    });
    await ensureButton({
      menuName: '公告修改',
      parentId: noticeMenu.menuId,
      perms: 'system:notice:edit',
      orderNum: 2,
    });
    await ensureButton({
      menuName: '公告删除',
      parentId: noticeMenu.menuId,
      perms: 'system:notice:remove',
      orderNum: 3,
    });
  }

  const jobMenu = await getMenuByPath(monitorDir.menuId, 'job');
  if (jobMenu) {
    await ensureButton({
      menuName: '任务新增',
      parentId: jobMenu.menuId,
      perms: 'monitor:job:add',
      orderNum: 1,
    });
    await ensureButton({
      menuName: '任务修改',
      parentId: jobMenu.menuId,
      perms: 'monitor:job:edit',
      orderNum: 2,
    });
    await ensureButton({
      menuName: '任务删除',
      parentId: jobMenu.menuId,
      perms: 'monitor:job:remove',
      orderNum: 3,
    });
    await ensureButton({
      menuName: '立即执行',
      parentId: jobMenu.menuId,
      perms: 'monitor:job:run',
      orderNum: 4,
    });
    await ensureButton({
      menuName: '状态变更',
      parentId: jobMenu.menuId,
      perms: 'monitor:job:changeStatus',
      orderNum: 5,
    });
  }
  const cacheMenu = await getMenuByPath(monitorDir.menuId, 'cache');
  if (cacheMenu) {
    await ensureButton({
      menuName: '清理指定',
      parentId: cacheMenu.menuId,
      perms: 'monitor:cache:clearName',
      orderNum: 1,
    });
    await ensureButton({
      menuName: '清理全部',
      parentId: cacheMenu.menuId,
      perms: 'monitor:cache:clearAll',
      orderNum: 2,
    });
  }
  const onlineMenu = await getMenuByPath(monitorDir.menuId, 'online');
  if (onlineMenu) {
    await ensureButton({
      menuName: '强退用户',
      parentId: onlineMenu.menuId,
      perms: 'monitor:online:forceLogout',
      orderNum: 1,
    });
  }

  // 6. 为超级管理员建立角色-菜单关联（授予全部菜单权限）
  const allMenus = await prisma.sysMenu.findMany({ select: { menuId: true } });
  if (allMenus.length > 0) {
    await prisma.sysRoleMenu.createMany({
      data: allMenus.map((m) => ({ roleId: role.roleId, menuId: m.menuId })),
      skipDuplicates: true,
    });
    console.log(`Linked role(admin) with ${allMenus.length} menus`);
  } else {
    console.log('No menus found to link with role(admin)');
  }

  // 7. 初始化常用字典与配置（若不存在则创建）
  const dictTypesToSeed = [
    { dictName: '显示隐藏', dictType: 'sys_show_hide' },
    { dictName: '正常停用', dictType: 'sys_normal_disable' },
    { dictName: '是否', dictType: 'sys_yes_no' },
    { dictName: '用户性别', dictType: 'sys_user_sex' },
    { dictName: '任务状态', dictType: 'sys_job_status' },
    { dictName: '任务分组', dictType: 'sys_job_group' },
    { dictName: '通知类型', dictType: 'sys_notice_type' },
    { dictName: '通知状态', dictType: 'sys_notice_status' },
    { dictName: '操作类型', dictType: 'sys_oper_type' },
    { dictName: '通用状态', dictType: 'sys_common_status' },
  ];
  for (const dt of dictTypesToSeed) {
    const exists = await prisma.sysDictType.findFirst({
      where: { dictType: dt.dictType },
    });
    if (!exists) {
      await prisma.sysDictType.create({
        data: { dictName: dt.dictName, dictType: dt.dictType, status: '0' },
      });
      console.log(`Created dictType: ${dt.dictType}`);
    }
  }

  // 字典数据
  const dictDataToSeed = [
    // 显示隐藏
    {
      dictType: 'sys_show_hide',
      dictLabel: '显示',
      dictValue: '0',
      dictSort: 1,
    },
    {
      dictType: 'sys_show_hide',
      dictLabel: '隐藏',
      dictValue: '1',
      dictSort: 2,
    },
    // 正常停用
    {
      dictType: 'sys_normal_disable',
      dictLabel: '正常',
      dictValue: '0',
      dictSort: 1,
    },
    {
      dictType: 'sys_normal_disable',
      dictLabel: '停用',
      dictValue: '1',
      dictSort: 2,
    },
    // 是否
    { dictType: 'sys_yes_no', dictLabel: '是', dictValue: 'Y', dictSort: 1 },
    { dictType: 'sys_yes_no', dictLabel: '否', dictValue: 'N', dictSort: 2 },
    // 性别
    { dictType: 'sys_user_sex', dictLabel: '男', dictValue: '0', dictSort: 1 },
    { dictType: 'sys_user_sex', dictLabel: '女', dictValue: '1', dictSort: 2 },
    {
      dictType: 'sys_user_sex',
      dictLabel: '未知',
      dictValue: '2',
      dictSort: 3,
    },
    // 任务状态
    {
      dictType: 'sys_job_status',
      dictLabel: '正常',
      dictValue: '0',
      dictSort: 1,
    },
    {
      dictType: 'sys_job_status',
      dictLabel: '暂停',
      dictValue: '1',
      dictSort: 2,
    },
    // 任务分组
    {
      dictType: 'sys_job_group',
      dictLabel: 'DEFAULT',
      dictValue: 'DEFAULT',
      dictSort: 1,
    },
    {
      dictType: 'sys_job_group',
      dictLabel: 'SYSTEM',
      dictValue: 'SYSTEM',
      dictSort: 2,
    },
    // 通知类型
    {
      dictType: 'sys_notice_type',
      dictLabel: '通知',
      dictValue: '1',
      dictSort: 1,
    },
    {
      dictType: 'sys_notice_type',
      dictLabel: '公告',
      dictValue: '2',
      dictSort: 2,
    },
    // 通知状态
    {
      dictType: 'sys_notice_status',
      dictLabel: '正常',
      dictValue: '0',
      dictSort: 1,
    },
    {
      dictType: 'sys_notice_status',
      dictLabel: '关闭',
      dictValue: '1',
      dictSort: 2,
    },
    // 操作类型
    {
      dictType: 'sys_oper_type',
      dictLabel: '其它',
      dictValue: '0',
      dictSort: 0,
    },
    {
      dictType: 'sys_oper_type',
      dictLabel: '新增',
      dictValue: '1',
      dictSort: 1,
    },
    {
      dictType: 'sys_oper_type',
      dictLabel: '修改',
      dictValue: '2',
      dictSort: 2,
    },
    {
      dictType: 'sys_oper_type',
      dictLabel: '删除',
      dictValue: '3',
      dictSort: 3,
    },
    {
      dictType: 'sys_oper_type',
      dictLabel: '授权',
      dictValue: '4',
      dictSort: 4,
    },
    {
      dictType: 'sys_oper_type',
      dictLabel: '导出',
      dictValue: '5',
      dictSort: 5,
    },
    {
      dictType: 'sys_oper_type',
      dictLabel: '导入',
      dictValue: '6',
      dictSort: 6,
    },
    {
      dictType: 'sys_oper_type',
      dictLabel: '强退',
      dictValue: '7',
      dictSort: 7,
    },
    {
      dictType: 'sys_oper_type',
      dictLabel: '生成代码',
      dictValue: '8',
      dictSort: 8,
    },
    {
      dictType: 'sys_oper_type',
      dictLabel: '清空数据',
      dictValue: '9',
      dictSort: 9,
    },
    // 通用状态
    {
      dictType: 'sys_common_status',
      dictLabel: '成功',
      dictValue: '0',
      dictSort: 1,
    },
    {
      dictType: 'sys_common_status',
      dictLabel: '失败',
      dictValue: '1',
      dictSort: 2,
    },
  ];
  for (const dd of dictDataToSeed) {
    const exists = await prisma.sysDictData.findFirst({
      where: { dictType: dd.dictType, dictValue: dd.dictValue },
    });
    if (!exists) {
      await prisma.sysDictData.create({
        data: {
          dictType: dd.dictType,
          dictLabel: dd.dictLabel,
          dictValue: dd.dictValue,
          dictSort: dd.dictSort,
          status: '0',
        },
      });
      console.log(`Created dictData: ${dd.dictType}/${dd.dictValue}`);
    }
  }

  // 系统配置
  const configsToSeed = [
    {
      configName: '初始密码',
      configKey: 'sys.account.initPassword',
      configValue: '123456',
      configType: 'Y',
    },
    {
      configName: '站点名称',
      configKey: 'sys.site.name',
      configValue: 'RBAC Admin Pro',
      configType: 'Y',
    },
  ];
  for (const cfg of configsToSeed) {
    const exists = await prisma.sysConfig.findFirst({
      where: { configKey: cfg.configKey },
    });
    if (!exists) {
      await prisma.sysConfig.create({
        data: {
          configName: cfg.configName,
          configKey: cfg.configKey,
          configValue: cfg.configValue,
          configType: cfg.configType,
        },
      });
      console.log(`Created config: ${cfg.configKey}`);
    }
  }

  // 8. 新增普通角色与示例用户
  const userRole =
    (await prisma.sysRole.findFirst({ where: { roleKey: 'user' } })) ||
    (await prisma.sysRole.create({
      data: {
        roleName: '普通用户',
        roleKey: 'user',
        roleSort: 2,
        status: '0',
      },
    }));

  const demoSalt = await bcrypt.genSalt(10);
  const demoHashed = await bcrypt.hash('123456', demoSalt);
  const demoUser = await prisma.sysUser.findFirst({
    where: { userName: 'user', delFlag: '0' },
  });
  const demoUserId = await (async () => {
    if (demoUser) return demoUser.userId;
    const u = await prisma.sysUser.create({
      data: {
        userName: 'user',
        nickName: '普通用户',
        password: demoHashed,
        status: '0',
        deptId: rootDept.deptId,
      },
    });
    return u.userId;
  })();
  await prisma.sysUserRole.createMany({
    data: [{ userId: demoUserId, roleId: userRole.roleId }],
    skipDuplicates: true,
  });

  // 9. 岗位样例
  const posts = [
    { postCode: 'dev', postName: '开发', postSort: 1, status: '0' },
    { postCode: 'pm', postName: '产品经理', postSort: 2, status: '0' },
  ];
  for (const p of posts) {
    const exist = await prisma.sysPost.findFirst({
      where: { postCode: p.postCode },
    });
    if (!exist) {
      await prisma.sysPost.create({ data: p });
    }
  }

  // 9.1 绑定用户岗位（示例）：admin -> dev，user -> pm
  const devPost = await prisma.sysPost.findFirst({
    where: { postCode: 'dev' },
  });
  const pmPost = await prisma.sysPost.findFirst({
    where: { postCode: 'pm' },
  });
  if (devPost) {
    await prisma.sysUserPost.createMany({
      data: [{ userId: user.userId, postId: devPost.postId }],
      skipDuplicates: true,
    });
  }
  if (pmPost) {
    await prisma.sysUserPost.createMany({
      data: [{ userId: demoUserId, postId: pmPost.postId }],
      skipDuplicates: true,
    });
  }

  // 10. 公告样例
  const noticeExist = await prisma.sysNotice.findFirst({
    where: { noticeTitle: '系统维护' },
  });
  if (!noticeExist) {
    await prisma.sysNotice.create({
      data: {
        noticeTitle: '系统维护',
        noticeType: '2',
        noticeContent: '本周日凌晨进行系统维护。',
        status: '0',
      },
    });
  }

  // 11. 任务样例
  const jobExist = await prisma.sysJob.findFirst({
    where: { jobName: '示例任务' },
  });
  if (!jobExist) {
    await prisma.sysJob.create({
      data: {
        jobName: '示例任务',
        jobGroup: 'DEFAULT',
        invokeTarget: 'demoTask.execute()',
        cronExpression: '0/30 * * * * *',
        misfirePolicy: '3',
        concurrent: '1',
        status: '0',
      },
    });
  }

  // 11.1 任务日志样例
  const sampleJobLogCount = await prisma.sysJobLog.count();
  if (sampleJobLogCount === 0) {
    await prisma.sysJobLog.createMany({
      data: [
        {
          jobName: '示例任务',
          jobGroup: 'DEFAULT',
          invokeTarget: 'demoTask.execute()',
          jobMessage: '执行成功',
          status: '0',
        },
        {
          jobName: '示例任务',
          jobGroup: 'DEFAULT',
          invokeTarget: 'demoTask.execute()',
          jobMessage: '执行失败：模拟异常',
          status: '1',
          exceptionInfo: 'MockError: something wrong',
        },
      ],
      skipDuplicates: true,
    });
  }

  // 12. 登录日志样例
  const loginLogExist = await prisma.sysLoginLog.count();
  if (loginLogExist === 0) {
    await prisma.sysLoginLog.createMany({
      data: [
        {
          userName: 'admin',
          ipaddr: '127.0.0.1',
          browser: 'Chrome',
          os: 'macOS',
          status: '0',
          msg: '登录成功',
        },
        {
          userName: 'user',
          ipaddr: '127.0.0.1',
          browser: 'Chrome',
          os: 'macOS',
          status: '1',
          msg: '密码错误',
        },
      ],
      skipDuplicates: true,
    });
  }

  // 13. 操作日志样例
  const operLogCount = await prisma.sysOperLog.count();
  if (operLogCount === 0) {
    await prisma.sysOperLog.createMany({
      data: [
        {
          title: '部门管理',
          businessType: 1,
          method: 'DeptController.create',
          requestMethod: 'POST',
          operName: 'admin',
          deptName: '总公司',
          operUrl: '/system/dept',
          operIp: '127.0.0.1',
          operLocation: '内网',
          operParam: '{"deptName":"技术部"}',
          jsonResult: '{"code":200}',
          status: 0,
        },
        {
          title: '岗位管理',
          businessType: 3,
          method: 'PostController.remove',
          requestMethod: 'DELETE',
          operName: 'admin',
          deptName: '总公司',
          operUrl: '/system/post',
          operIp: '127.0.0.1',
          operLocation: '内网',
          operParam: '{"ids":"1,2"}',
          jsonResult: '{"code":200}',
          status: 0,
        },
      ],
      skipDuplicates: true,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
