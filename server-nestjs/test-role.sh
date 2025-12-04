#!/bin/bash

echo "========================================"
echo "Testing Role API"
echo "========================================"

# 1. Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed!"
  exit 1
fi

# 2. List Roles
echo "\n[1] List Roles"
curl -X GET http://localhost:3000/system/role \
  -H "Authorization: Bearer $TOKEN"

# 3. Create Role
echo "\n\n[2] Create Role (Test Role)"
# 先获取一个菜单ID
MENU_RES=$(curl -s -X GET http://localhost:3000/getRouters -H "Authorization: Bearer $TOKEN")
# 这是一个复杂的 json，简单起见，我们直接使用 seed 插入的菜单 ID (需要去数据库查，或者假设)
# 实际上，为了测试方便，我们可以不传 menuIds，或者传空

CREATE_RES=$(curl -s -X POST http://localhost:3000/system/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleName": "测试角色", "roleKey": "test", "roleSort": 2, "status": "0", "menuIds": []}')

echo "Create Response: $CREATE_RES"

NEW_ROLE_ID=$(echo $CREATE_RES | grep -o '"roleId":"[^"]*"' | cut -d'"' -f4)
echo "New Role ID: $NEW_ROLE_ID"

# 4. Get Detail
if [ ! -z "$NEW_ROLE_ID" ]; then
    echo "\n\n[3] Get Role Detail"
    curl -X GET http://localhost:3000/system/role/$NEW_ROLE_ID \
      -H "Authorization: Bearer $TOKEN"
fi

# 5. Update Role
if [ ! -z "$NEW_ROLE_ID" ]; then
    echo "\n\n[4] Update Role"
    curl -X PUT http://localhost:3000/system/role/$NEW_ROLE_ID \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"roleName": "测试角色(修改)", "roleKey": "test_updated", "roleSort": 3, "menuIds": []}'
fi

# 6. Delete Role
if [ ! -z "$NEW_ROLE_ID" ]; then
    echo "\n\n[5] Delete Role"
    curl -X DELETE http://localhost:3000/system/role/$NEW_ROLE_ID \
      -H "Authorization: Bearer $TOKEN"
fi

echo "\n"
