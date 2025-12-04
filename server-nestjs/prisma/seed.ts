import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding ...');

  // 1. Init Dept
  const dept = await prisma.sysDept.create({
    data: {
      deptName: '总公司',
      orderNum: 0,
      status: '0',
    },
  });
  console.log(`Created dept with id: ${dept.deptId}`);

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

  // 3. Init User
  // Note: Password hashing will be implemented in Phase 2
  const user = await prisma.sysUser.create({
    data: {
      userName: 'admin',
      nickName: '超级管理员',
      password: '123456',
      status: '0',
      deptId: dept.deptId,
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
