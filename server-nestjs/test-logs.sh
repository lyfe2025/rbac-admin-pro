#!/bin/bash

# 日志系统测试脚本
# 用于验证日志文件是否正常生成

echo "========================================="
echo "日志系统测试"
echo "========================================="
echo ""

# 检查日志目录
if [ -d "logs" ]; then
    echo "✅ 日志目录存在: logs/"
    echo ""
    echo "📁 日志文件列表:"
    ls -lh logs/ 2>/dev/null || echo "   (目录为空)"
    echo ""
else
    echo "⚠️  日志目录不存在,启动服务后会自动创建"
    echo ""
fi

# 检查环境变量
echo "📋 环境变量配置:"
if [ -f ".env" ]; then
    echo "   LOG_LEVEL: $(grep '^LOG_LEVEL=' .env | cut -d'=' -f2 || echo '未配置')"
    echo "   LOG_DIR: $(grep '^LOG_DIR=' .env | cut -d'=' -f2 || echo '未配置')"
    echo "   NODE_ENV: $(grep '^NODE_ENV=' .env | cut -d'=' -f2 || echo '未配置')"
else
    echo "   ⚠️  .env 文件不存在,请复制 .env.example"
fi
echo ""

# 实时查看日志的命令提示
echo "========================================="
echo "📖 日志查看命令:"
echo "========================================="
echo ""
echo "# 查看所有日志"
echo "tail -f logs/application-*.log"
echo ""
echo "# 查看错误日志"
echo "tail -f logs/error-*.log"
echo ""
echo "# 查看 HTTP 请求日志"
echo "tail -f logs/http-*.log"
echo ""
echo "# 查看今天的日志"
echo "tail -f logs/application-$(date +%Y-%m-%d).log"
echo ""
echo "========================================="
echo "🔍 日志测试建议:"
echo "========================================="
echo ""
echo "1. 启动服务: npm run start:dev"
echo "2. 访问登录接口测试日志记录"
echo "3. 查看日志文件确认内容"
echo ""
