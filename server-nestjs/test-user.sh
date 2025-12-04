#!/bin/bash

echo "========================================"
echo "Testing User API"
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

# 2. List Users
echo "\n[1] List Users"
curl -X GET http://localhost:3000/system/user \
  -H "Authorization: Bearer $TOKEN"

# 3. Create User
echo "\n\n[2] Create User (Test User)"
# 获取部门ID和角色ID (假设第一个)
DEPT_RES=$(curl -s -X GET http://localhost:3000/system/dept -H "Authorization: Bearer $TOKEN")
DEPT_ID=$(echo $DEPT_RES | grep -o '"deptId":"[^"]*"' | head -n 1 | cut -d'"' -f4)

ROLE_RES=$(curl -s -X GET http://localhost:3000/system/role -H "Authorization: Bearer $TOKEN")
ROLE_ID=$(echo $ROLE_RES | grep -o '"roleId":"[^"]*"' | head -n 1 | cut -d'"' -f4)

echo "Dept ID: $DEPT_ID, Role ID: $ROLE_ID"

CREATE_RES=$(curl -s -X POST http://localhost:3000/system/user \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"userName\": \"testuser\", \"nickName\": \"测试用户\", \"password\": \"123456\", \"deptId\": \"$DEPT_ID\", \"roleIds\": [\"$ROLE_ID\"], \"status\": \"0\"}")

echo "Create Response: $CREATE_RES"

NEW_USER_ID=$(echo $CREATE_RES | grep -o '"userId":"[^"]*"' | cut -d'"' -f4)
echo "New User ID: $NEW_USER_ID"

# 4. Get Detail
if [ ! -z "$NEW_USER_ID" ]; then
    echo "\n\n[3] Get User Detail"
    curl -X GET http://localhost:3000/system/user/$NEW_USER_ID \
      -H "Authorization: Bearer $TOKEN"
fi

# 5. Update User
if [ ! -z "$NEW_USER_ID" ]; then
    echo "\n\n[4] Update User"
    curl -X PUT http://localhost:3000/system/user/$NEW_USER_ID \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"nickName\": \"测试用户(修改)\", \"email\": \"test@example.com\"}"
fi

# 6. Reset Password
if [ ! -z "$NEW_USER_ID" ]; then
    echo "\n\n[5] Reset Password"
    curl -X PUT http://localhost:3000/system/user/resetPwd \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"userId\": \"$NEW_USER_ID\", \"password\": \"654321\"}"
fi

# 7. Delete User
if [ ! -z "$NEW_USER_ID" ]; then
    echo "\n\n[6] Delete User"
    curl -X DELETE http://localhost:3000/system/user/$NEW_USER_ID \
      -H "Authorization: Bearer $TOKEN"
fi

echo "\n"
