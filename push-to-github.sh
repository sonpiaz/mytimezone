#!/bin/bash

# Script để push code lên GitHub và deploy Vercel

echo "🚀 My TimeZone App - Push to GitHub"
echo ""

# Kiểm tra xem đã có remote chưa
if git remote | grep -q "origin"; then
    echo "✅ Remote 'origin' đã tồn tại"
    git remote -v
else
    echo "⚠️  Chưa có remote 'origin'"
    echo ""
    echo "📝 Hãy tạo GitHub repository trước:"
    echo "   1. Truy cập: https://github.com/new"
    echo "   2. Repository name: my-timezone-app"
    echo "   3. Chọn Public hoặc Private"
    echo "   4. KHÔNG tích 'Initialize with README'"
    echo "   5. Click 'Create repository'"
    echo ""
    read -p "Nhập GitHub username của bạn: " GITHUB_USERNAME
    read -p "Nhập repository name (mặc định: my-timezone-app): " REPO_NAME
    REPO_NAME=${REPO_NAME:-my-timezone-app}
    
    echo ""
    echo "🔗 Đang thêm remote..."
    git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
    echo "✅ Đã thêm remote: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
fi

echo ""
echo "📤 Đang push code lên GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Đã push code lên GitHub thành công!"
    echo ""
    echo "🌐 Bước tiếp theo - Deploy lên Vercel:"
    echo "   1. Truy cập: https://vercel.com"
    echo "   2. Đăng nhập bằng GitHub"
    echo "   3. Click 'Add New Project'"
    echo "   4. Import repository: my-timezone-app"
    echo "   5. Framework: Vite (auto-detect)"
    echo "   6. Click 'Deploy'"
    echo ""
    echo "📋 Hoặc dùng Vercel CLI:"
    echo "   npm i -g vercel"
    echo "   vercel login"
    echo "   vercel"
else
    echo ""
    echo "❌ Lỗi khi push code. Kiểm tra lại:"
    echo "   - GitHub repository đã được tạo chưa?"
    echo "   - Remote URL có đúng không?"
    echo "   - Bạn đã đăng nhập GitHub chưa?"
fi
