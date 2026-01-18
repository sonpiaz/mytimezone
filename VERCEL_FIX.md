# Fix Vercel 404 Error

## Nguyên nhân lỗi 404 DEPLOYMENT_NOT_FOUND

Lỗi này thường xảy ra khi:
1. ✅ Build failed trên Vercel
2. ✅ Output directory không đúng
3. ✅ Routing configuration sai
4. ✅ Chưa push code mới nhất lên GitHub

## Giải pháp

### Bước 1: Kiểm tra Build Logs trên Vercel

1. Vào Vercel Dashboard
2. Chọn project `my-timezone-app`
3. Vào tab **Deployments**
4. Click vào deployment bị lỗi
5. Xem **Build Logs** để tìm lỗi cụ thể

### Bước 2: Đảm bảo code đã được push lên GitHub

```bash
cd /Users/sonpiaz/my-timezone-app
git status
git push origin main
```

### Bước 3: Kiểm tra Vercel Settings

1. Vào **Settings** → **General**
2. Kiểm tra:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Bước 4: Redeploy

1. Vào **Deployments**
2. Click **...** (3 dots) trên deployment mới nhất
3. Chọn **Redeploy**

Hoặc:

1. Push một commit mới:
```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

### Bước 5: Kiểm tra Build Locally

```bash
npm run build
ls -la dist/
```

Đảm bảo có file `dist/index.html`

## Cấu hình đã được cập nhật

✅ `vercel.json` - Đã cập nhật với routing đúng
✅ `.vercelignore` - Đã thêm để ignore files không cần thiết

## Nếu vẫn lỗi

1. **Xóa project và tạo lại:**
   - Vercel Dashboard → Settings → Delete Project
   - Tạo lại project và import từ GitHub

2. **Kiểm tra Node version:**
   - Vercel Settings → General → Node.js Version
   - Đảm bảo >= 18.x

3. **Kiểm tra Environment Variables:**
   - Settings → Environment Variables
   - Đảm bảo không có biến nào bị thiếu

4. **Contact Vercel Support:**
   - Nếu vẫn lỗi, gửi build logs cho Vercel support
