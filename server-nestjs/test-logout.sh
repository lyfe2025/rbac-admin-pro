#!/bin/bash

echo "========================================"
echo "Testing Logout API"
echo "========================================"

# 1. Login
echo "\nLogging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed!"
  exit 1
fi

echo "Token acquired."

# 2. Logout
echo "\nLogging out..."
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer $TOKEN"

echo "\n"
