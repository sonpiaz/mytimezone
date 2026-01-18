#!/bin/bash

# Script để push code lên GitHub
# Sử dụng: ./push-to-github.sh YOUR_USERNAME REPO_NAME

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "❌ Thiếu thông tin!"
  echo "Cách sử dụng: ./push-to-github.sh YOUR_USERNAME REPO_NAME"
  echo ""
  echo "Ví dụ: ./push-to-github.sh sonpiaz my-timezone"
  echo ""
  echo "Hoặc nếu bạn chưa tạo repo trên GitHub:"
  echo "1. Truy cập: https://github.com/new"
  echo "2. Tạo repo mới (không tích README)"
  echo "3. Chạy lại script này với username và repo name"
  exit 1
fi

USERNAME=$1
REPO_NAME=$2

echo "🚀 Đang push code lên GitHub..."
echo "Repository: https://github.com/$USERNAME/$REPO_NAME"
echo ""

# Kiểm tra xem đã có remote chưa
if git remote get-url origin > /dev/null 2>&1; then
  echo "⚠️  Đã có remote 'origin'. Đang cập nhật..."
  git remote set-url origin https://github.com/$USERNAME/$REPO_NAME.git
else
  echo "➕ Đang thêm remote..."
  git remote add origin https://github.com/$USERNAME/$REPO_NAME.git
fi

echo "📤 Đang push code..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Thành công! Code đã được push lên GitHub."
  echo "🔗 Xem tại: https://github.com/$USERNAME/$REPO_NAME"
  echo ""
  echo "📝 Bước tiếp theo:"
  echo "1. Truy cập https://vercel.com"
  echo "2. Import project từ GitHub"
  echo "3. Deploy!"
else
  echo ""
  echo "❌ Lỗi! Có thể repo chưa được tạo trên GitHub."
  echo "Vui lòng tạo repo tại: https://github.com/new"
  exit 1
fi
