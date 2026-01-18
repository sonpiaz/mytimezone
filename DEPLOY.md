# 🚀 Hướng dẫn Deploy My TimeZone lên Vercel

## Bước 1: Push code lên GitHub

### 1.1. Tạo GitHub Repository
1. Đăng nhập vào [GitHub](https://github.com)
2. Click **"New repository"** (hoặc vào https://github.com/new)
3. Đặt tên: `my-timezone` (hoặc tên bạn muốn)
4. Chọn **Public** hoặc **Private**
5. **KHÔNG** tích "Initialize with README" (vì đã có code rồi)
6. Click **"Create repository"**

### 1.2. Push code lên GitHub
Chạy các lệnh sau (thay `YOUR_USERNAME` bằng GitHub username của bạn):

```bash
cd /Users/sonpiaz/my-timezone-app

# Thêm remote
git remote add origin https://github.com/YOUR_USERNAME/my-timezone.git

# Push code
git branch -M main
git push -u origin main
```

**Hoặc nếu dùng SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/my-timezone.git
git branch -M main
git push -u origin main
```

---

## Bước 2: Deploy lên Vercel

### 2.1. Tạo tài khoản Vercel (nếu chưa có)
1. Truy cập [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Chọn **"Continue with GitHub"** (để tự động connect)

### 2.2. Import Project
1. Sau khi đăng nhập, click **"Add New..."** → **"Project"**
2. Tìm và chọn repository `my-timezone` của bạn
3. Click **"Import"**

### 2.3. Cấu hình Build Settings
Vercel sẽ tự động detect Vite, nhưng kiểm tra:
- **Framework Preset:** Vite
- **Root Directory:** `./` (mặc định)
- **Build Command:** `npm run build` (mặc định)
- **Output Directory:** `dist` (mặc định)
- **Install Command:** `npm install` (mặc định)

### 2.4. Deploy
1. Click **"Deploy"**
2. Đợi 1-2 phút để build
3. Sau khi xong, bạn sẽ có URL: `https://my-timezone-xxxxx.vercel.app`

---

## Bước 3: Setup Domain từ Namecheap

### 3.1. Mua Domain (nếu chưa có)
1. Truy cập [namecheap.com](https://namecheap.com)
2. Tìm và mua domain `mytimezone.io` (hoặc domain bạn muốn)
3. Hoàn tất thanh toán

### 3.2. Thêm Domain vào Vercel
1. Vào Vercel Dashboard → Chọn project `my-timezone`
2. Vào tab **"Settings"** → **"Domains"**
3. Nhập domain: `mytimezone.io` (hoặc domain của bạn)
4. Click **"Add"**
5. Vercel sẽ hiển thị **DNS records** cần thêm

### 3.3. Cấu hình DNS trên Namecheap
1. Đăng nhập [Namecheap](https://namecheap.com)
2. Vào **Domain List** → Click **"Manage"** bên cạnh domain của bạn
3. Vào tab **"Advanced DNS"**
4. Thêm các DNS records từ Vercel:

**Thường sẽ có 2 records:**
- **Type A:** 
  - Host: `@`
  - Value: `76.76.21.21` (hoặc IP Vercel cung cấp)
  - TTL: Automatic
  
- **Type CNAME:**
  - Host: `www`
  - Value: `cname.vercel-dns.com.` (hoặc giá trị Vercel cung cấp)
  - TTL: Automatic

**Hoặc nếu Vercel yêu cầu:**
- **Type CNAME:**
  - Host: `@`
  - Value: `cname.vercel-dns.com.`
  - TTL: Automatic

### 3.4. Đợi DNS Propagation
- Thường mất **5-30 phút** đến **24 giờ**
- Kiểm tra bằng cách: `ping mytimezone.io` hoặc truy cập domain

### 3.5. Kiểm tra SSL
- Vercel tự động cấp SSL certificate (HTTPS)
- Sau khi DNS propagate, SSL sẽ được kích hoạt tự động

---

## ✅ Kiểm tra sau khi deploy

1. **Test URL Vercel:** `https://my-timezone-xxxxx.vercel.app`
2. **Test Custom Domain:** `https://mytimezone.io`
3. **Test Share Link:** Thêm cities và share URL
4. **Test Mobile:** Mở trên iPhone/Android

---

## 🔧 Troubleshooting

### Lỗi Build trên Vercel
- Kiểm tra logs trong Vercel Dashboard
- Đảm bảo `package.json` có đúng scripts
- Kiểm tra Node version (Vercel dùng Node 18+)

### Domain không hoạt động
- Kiểm tra DNS records đã đúng chưa
- Đợi thêm thời gian (có thể mất đến 24h)
- Kiểm tra trong Vercel → Settings → Domains

### SSL không hoạt động
- Đợi DNS propagate xong
- Vercel sẽ tự động cấp SSL sau khi DNS ready

---

## 📝 Notes

- Mỗi lần push code lên GitHub, Vercel sẽ tự động deploy lại
- Có thể setup custom domain cho cả `www` và non-www
- Vercel free tier đủ dùng cho MVP này
