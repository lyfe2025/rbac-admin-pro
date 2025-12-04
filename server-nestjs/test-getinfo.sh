#!/bin/bash

echo "========================================"
echo "Testing GetInfo API"
echo "========================================"

# 1. Login to get token
echo "\nLogging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed! Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "Token acquired: ${TOKEN:0:20}..."

# 2. Get User Info
echo "\nGetting User Info..."
curl -X GET http://localhost:3000/system/user/getInfo \
  -H "Authorization: Bearer $TOKEN"

echo "\n"
