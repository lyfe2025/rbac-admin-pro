#!/bin/bash

echo "========================================"
echo "Testing Login API"
echo "========================================"

echo "\n1. 正常登录 (admin/123456)"
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}'
echo "\n"

echo "\n2. 密码错误 (admin/wrongpass)"
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "wrongpass"}'
echo "\n"

echo "\n3. 用户名不存在 (nobody/123456)"
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "nobody", "password": "123456"}'
echo "\n"

echo "\n4. 参数缺失 (空密码)"
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": ""}'
echo "\n"
