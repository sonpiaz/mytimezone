# Deployment Guide - My TimeZone App

## Bước 1: Tạo GitHub Repository

1. Truy cập https://github.com/new
2. Repository name: `my-timezone-app` (hoặc tên bạn muốn)
3. Chọn **Public** hoặc **Private**
4. **KHÔNG** tích "Initialize with README" (vì đã có code)
5. Click **Create repository**

## Bước 2: Push Code lên GitHub

Sau khi tạo repo, GitHub sẽ hiển thị commands. Chạy các lệnh sau:

```bash
cd /Users/sonpiaz/my-timezone-app

# Thêm remote (thay YOUR_USERNAME bằng GitHub username của bạn)
git remote add origin https://github.com/YOUR_USERNAME/my-timezone-app.git

# Push code lên GitHub
git branch -M main
git push -u origin main
```

## Bước 3: Deploy lên Vercel

### Option 1: Deploy qua GitHub (Khuyến nghị)

1. Truy cập https://vercel.com
2. Đăng nhập bằng GitHub account
3. Click **Add New Project**
4. Import repository `my-timezone-app`
5. Vercel sẽ tự động detect:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (hoặc để trống)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click **Deploy**

### Option 2: Deploy qua Vercel CLI

```bash
# Cài đặt Vercel CLI (nếu chưa có)
npm i -g vercel

# Login vào Vercel
vercel login

# Deploy
cd /Users/sonpiaz/my-timezone-app
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (chọn account của bạn)
# - Link to existing project? No
# - Project name: mytimezone
# - Directory: ./
# - Override settings? No
```

## Bước 4: Cấu hình Domain

Sau khi deploy thành công:

1. Vào Vercel Dashboard → Project → Settings → Domains
2. Thêm domain: `mytimezone.vercel.app` (hoặc domain tùy chỉnh)
3. Vercel sẽ tự động cấu hình SSL

## Bước 5: Environment Variables (nếu cần)

Nếu app cần environment variables:
1. Vào Settings → Environment Variables
2. Thêm các biến cần thiết
3. Redeploy để áp dụng

## Kiểm tra Deployment

Sau khi deploy xong, truy cập:
- **Vercel URL:** `https://mytimezone.vercel.app`
- Kiểm tra:
  - ✅ App load được
  - ✅ Timezone hiển thị đúng
  - ✅ Hover effects hoạt động
  - ✅ Responsive trên mobile

## Troubleshooting

### Build Error
- Kiểm tra `package.json` có đúng scripts
- Chạy `npm run build` local để test

### 404 Error
- Kiểm tra `vercel.json` (nếu có)
- Đảm bảo output directory là `dist`

### Domain không hoạt động
- Đợi 5-10 phút để DNS propagate
- Kiểm tra DNS settings trong Vercel
