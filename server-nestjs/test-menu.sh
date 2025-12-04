#!/bin/bash

echo "========================================"
echo "Testing Menu API"
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

# 2. List Menus
echo "\n[1] List Menus"
curl -X GET http://localhost:3000/system/menu \
  -H "Authorization: Bearer $TOKEN"

# 3. Create Menu
echo "\n\n[2] Create Menu (Test Menu)"
CREATE_RES=$(curl -s -X POST http://localhost:3000/system/menu \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"menuName": "测试菜单", "menuType": "C", "orderNum": 99, "path": "test", "component": "test/index", "status": "0"}')

echo "Create Response: $CREATE_RES"

NEW_MENU_ID=$(echo $CREATE_RES | grep -o '"menuId":"[^"]*"' | cut -d'"' -f4)
echo "New Menu ID: $NEW_MENU_ID"

# 4. Get Tree
echo "\n\n[3] Get Menu Tree"
curl -X GET http://localhost:3000/system/menu/treeselect \
  -H "Authorization: Bearer $TOKEN"

# 5. Delete Menu
if [ ! -z "$NEW_MENU_ID" ]; then
    echo "\n\n[4] Delete Menu"
    curl -X DELETE http://localhost:3000/system/menu/$NEW_MENU_ID \
      -H "Authorization: Bearer $TOKEN"
fi

echo "\n"
