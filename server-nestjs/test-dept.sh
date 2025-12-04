#!/bin/bash

echo "========================================"
echo "Testing Dept API"
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

# 2. List Depts
echo "\n[1] List Depts"
curl -X GET http://localhost:3000/system/dept \
  -H "Authorization: Bearer $TOKEN"

# 3. Create Dept
echo "\n\n[2] Create Dept (Development Dept)"
# 先获取一个父级ID (假设第一个部门是根部门)
# 这里我们简单写死 parentId 为 root 的部门 ID (通过 list 接口获取有点麻烦，我们直接假设 seed 数据里的 deptId)
# 实际上 seed 创建的 deptId 是 uuid，不可预测。
# 为了测试，我们可以先 list 拿到第一个 id

LIST_RES=$(curl -s -X GET http://localhost:3000/system/dept -H "Authorization: Bearer $TOKEN")
PARENT_ID=$(echo $LIST_RES | grep -o '"deptId":"[^"]*"' | head -n 1 | cut -d'"' -f4)

echo "Parent ID: $PARENT_ID"

CREATE_RES=$(curl -s -X POST http://localhost:3000/system/dept \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"parentId\": \"$PARENT_ID\", \"deptName\": \"研发部\", \"orderNum\": 1}")

echo "Create Response: $CREATE_RES"

NEW_DEPT_ID=$(echo $CREATE_RES | grep -o '"deptId":"[^"]*"' | cut -d'"' -f4)
echo "New Dept ID: $NEW_DEPT_ID"

# 4. Get Detail
if [ ! -z "$NEW_DEPT_ID" ]; then
    echo "\n\n[3] Get Dept Detail"
    curl -X GET http://localhost:3000/system/dept/$NEW_DEPT_ID \
      -H "Authorization: Bearer $TOKEN"
fi

# 5. Update Dept
if [ ! -z "$NEW_DEPT_ID" ]; then
    echo "\n\n[4] Update Dept"
    curl -X PUT http://localhost:3000/system/dept/$NEW_DEPT_ID \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"deptName\": \"研发中心\", \"orderNum\": 2}"
fi

# 6. Delete Dept (should fail initially if child check logic is strict but we just added a leaf node)
# Actually we added a leaf node so it should succeed unless there are users under it.
if [ ! -z "$NEW_DEPT_ID" ]; then
    echo "\n\n[5] Delete Dept"
    curl -X DELETE http://localhost:3000/system/dept/$NEW_DEPT_ID \
      -H "Authorization: Bearer $TOKEN"
fi

echo "\n"
