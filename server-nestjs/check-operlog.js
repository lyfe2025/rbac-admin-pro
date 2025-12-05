const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOperLog() {
  try {
    console.log('🔍 检查操作日志...\n');
    
    const logs = await prisma.sysOperLog.findMany({
      take: 10,
      orderBy: { operTime: 'desc' }
    });
    
    if (logs.length === 0) {
      console.log('❌ 没有找到操作日志记录');
      console.log('\n💡 请尝试:');
      console.log('   1. 修改一个用户');
      console.log('   2. 检查后端控制台是否有错误');
      console.log('   3. 确认拦截器是否正确触发\n');
    } else {
      console.log(`✅ 找到 ${logs.length} 条操作日志:\n`);
      logs.forEach((log, index) => {
        console.log(`${index + 1}. ${log.title || 'N/A'}`);
        console.log(`   操作人: ${log.operName}`);
        console.log(`   方法: ${log.method}`);
        console.log(`   URL: ${log.operUrl}`);
        console.log(`   时间: ${log.operTime}`);
        console.log(`   状态: ${log.status === 0 ? '✅ 成功' : '❌ 失败'}`);
        console.log('');
      });
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ 错误:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkOperLog();
