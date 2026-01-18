# Troubleshooting DNS - mytimezone.online

## Kiểm tra nhanh

### 1. Kiểm tra DNS Propagation

Truy cập: https://dnschecker.org
- Nhập domain: `mytimezone.online`
- Chọn record type: **A Record**
- Kiểm tra xem IP `76.76.21.21` đã propagate chưa

### 2. Kiểm tra trên Vercel

1. Vào Vercel Dashboard → Project → Settings → Domains
2. Kiểm tra status của `mytimezone.online`:
   - ✅ **Valid** - DNS đã đúng, đợi SSL
   - ⏳ **Pending** - Đang verify DNS
   - ❌ **Invalid** - DNS chưa đúng, cần sửa

### 3. Kiểm tra DNS Records trên Namecheap

Đảm bảo có đúng records:

**A Record:**
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic
```

**CNAME Record (WWW):**
```
Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

## Các vấn đề thường gặp

### Vấn đề 1: DNS chưa propagate

**Triệu chứng:** Domain không hoạt động sau 15-30 phút

**Giải pháp:**
1. Kiểm tra trên https://dnschecker.org
2. Nếu chưa propagate, đợi thêm 30-60 phút
3. DNS có thể mất đến 48 giờ để propagate hoàn toàn

### Vấn đề 2: Chưa thêm domain vào Vercel

**Triệu chứng:** DNS đúng nhưng Vercel không nhận diện

**Giải pháp:**
1. Vào Vercel Dashboard → Settings → Domains
2. Click **Add Domain**
3. Nhập: `mytimezone.online`
4. Click **Add**
5. Vercel sẽ verify DNS records

### Vấn đề 3: DNS Records không đúng

**Triệu chứng:** Vercel hiển thị "Invalid Configuration"

**Giải pháp:**
1. Xóa tất cả DNS records cũ trên Namecheap
2. Thêm lại theo đúng format:
   - A Record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`
3. Đợi 5 phút
4. Vào Vercel → Settings → Domains → Click **Refresh**

### Vấn đề 4: TTL quá cao

**Triệu chứng:** Thay đổi DNS mất quá lâu để có hiệu lực

**Giải pháp:**
1. Vào Namecheap → Advanced DNS
2. Đổi TTL từ "Automatic" sang **30 min** hoặc **1 hour**
3. Lưu lại
4. Đợi TTL expire (có thể mất vài giờ)

### Vấn đề 5: Có records cũ conflict

**Triệu chứng:** Domain trỏ về server cũ

**Giải pháp:**
1. Xóa TẤT CẢ records cũ trên Namecheap
2. Chỉ giữ lại:
   - A Record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`
3. Đợi 15-30 phút
4. Kiểm tra lại

## Kiểm tra từng bước

### Bước 1: Verify DNS Records

```bash
# Kiểm tra A record
dig mytimezone.online A +short
# Kết quả mong đợi: 76.76.21.21

# Kiểm tra CNAME
dig www.mytimezone.online CNAME +short
# Kết quả mong đợi: cname.vercel-dns.com.
```

### Bước 2: Verify trên Vercel

1. Vào Vercel Dashboard
2. Settings → Domains
3. Tìm `mytimezone.online`
4. Xem status:
   - Nếu "Invalid" → Click để xem lỗi cụ thể
   - Nếu "Pending" → Đợi thêm
   - Nếu "Valid" → Đợi SSL certificate (5-10 phút)

### Bước 3: Test Domain

```bash
# Test HTTP
curl -I http://mytimezone.online

# Test HTTPS
curl -I https://mytimezone.online
```

## Timeline mong đợi

1. **0-5 phút:** DNS records được cập nhật trên Namecheap
2. **5-30 phút:** DNS bắt đầu propagate
3. **30-60 phút:** DNS propagate đầy đủ
4. **60-90 phút:** Vercel verify và cấp SSL certificate
5. **90+ phút:** Domain hoạt động hoàn toàn

## Nếu vẫn không hoạt động sau 2 giờ

1. **Kiểm tra lại DNS records:**
   - Vào Namecheap → Advanced DNS
   - Đảm bảo chỉ có 2 records như trên
   - Không có records nào khác

2. **Xóa và thêm lại domain trên Vercel:**
   - Vercel → Settings → Domains
   - Xóa `mytimezone.online`
   - Đợi 5 phút
   - Thêm lại domain

3. **Liên hệ Vercel Support:**
   - Nếu DNS đúng nhưng Vercel không verify
   - Gửi screenshot DNS records và Vercel error

## Quick Fix Commands

```bash
# Kiểm tra DNS propagation
dig mytimezone.online A +short

# Kiểm tra từ nhiều DNS servers
dig @8.8.8.8 mytimezone.online A
dig @1.1.1.1 mytimezone.online A

# Kiểm tra SSL certificate
openssl s_client -connect mytimezone.online:443 -servername mytimezone.online
```
