# Hướng dẫn trỏ domain mytimezone.online từ Namecheap về Vercel

## Bước 1: Thêm Domain vào Vercel

1. Vào Vercel Dashboard: https://vercel.com
2. Chọn project `mytimezone`
3. Vào **Settings** → **Domains**
4. Nhập domain: `mytimezone.online`
5. Click **Add**

Vercel sẽ hiển thị DNS records cần cấu hình.

## Bước 2: Lấy DNS Records từ Vercel

Sau khi thêm domain, Vercel sẽ hiển thị 2 loại DNS records:

### Option 1: A Record (Khuyến nghị)
```
Type: A
Name: @
Value: 76.76.21.21
```

### Option 2: CNAME Record (Dễ hơn)
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**Lưu ý:** Một số domain provider không hỗ trợ CNAME cho root domain (@). Nếu Namecheap không hỗ trợ, dùng A record.

## Bước 3: Cấu hình DNS trên Namecheap

### Cách 1: Dùng Advanced DNS (Khuyến nghị)

1. Đăng nhập Namecheap: https://www.namecheap.com
2. Vào **Domain List**
3. Click **Manage** bên cạnh `mytimezone.online`
4. Vào tab **Advanced DNS**
5. Xóa các records cũ (nếu có)
6. Thêm records mới:

**Nếu dùng A Record:**
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic (hoặc 30 min)
```

**Nếu dùng CNAME:**
```
Type: CNAME Record
Host: @
Value: cname.vercel-dns.com
TTL: Automatic (hoặc 30 min)
```

7. Thêm WWW subdomain (tùy chọn):
```
Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

8. Click **Save All Changes**

### Cách 2: Dùng Basic DNS (Nếu không có Advanced DNS)

1. Vào **Domain List** → **Manage**
2. Vào tab **Nameservers**
3. Chọn **Custom DNS**
4. Thêm nameservers từ Vercel (nếu có)

## Bước 4: Verify trên Vercel

1. Quay lại Vercel Dashboard
2. Vào **Settings** → **Domains**
3. Kiểm tra status của `mytimezone.online`
4. Status sẽ hiển thị:
   - ⏳ **Pending** - Đang chờ DNS propagate
   - ✅ **Valid** - Đã cấu hình đúng
   - ❌ **Invalid** - Cần kiểm tra lại DNS

## Bước 5: Chờ DNS Propagate

- Thời gian: 5 phút - 48 giờ (thường là 15-30 phút)
- Kiểm tra DNS propagation: https://dnschecker.org
- Nhập domain: `mytimezone.online`
- Kiểm tra A record hoặc CNAME record

## Bước 6: Kiểm tra SSL Certificate

Vercel sẽ tự động cấu hình SSL certificate (HTTPS) sau khi DNS đã propagate:
- Thời gian: 5-10 phút sau khi DNS valid
- Kiểm tra: Truy cập https://mytimezone.online

## Troubleshooting

### DNS không hoạt động sau 1 giờ

1. **Kiểm tra DNS records:**
   ```bash
   # Kiểm tra A record
   dig mytimezone.online A
   
   # Kiểm tra CNAME
   dig mytimezone.online CNAME
   ```

2. **Kiểm tra trên Vercel:**
   - Vào Settings → Domains
   - Xem error message (nếu có)
   - Click "Refresh" để verify lại

3. **Xóa và thêm lại domain trên Vercel:**
   - Xóa domain
   - Đợi 5 phút
   - Thêm lại domain

### Namecheap không cho phép CNAME cho @

- Dùng A record thay vì CNAME
- Hoặc dùng nameservers của Vercel (nếu có)

### SSL Certificate không được cấp

- Đợi thêm 10-15 phút
- Kiểm tra DNS đã propagate chưa
- Xóa và thêm lại domain trên Vercel

## Lưu ý quan trọng

1. **Không dùng cả A record và CNAME cùng lúc** - Chọn một trong hai
2. **TTL:** Để Automatic hoặc 30 phút để thay đổi nhanh hơn
3. **WWW subdomain:** Nên thêm để hỗ trợ cả `www.mytimezone.online`
4. **SSL:** Vercel tự động cấp, không cần cấu hình thêm

## Kiểm tra nhanh

Sau khi cấu hình, kiểm tra:
- ✅ DNS propagation: https://dnschecker.org
- ✅ Domain hoạt động: https://mytimezone.online
- ✅ HTTPS: https://mytimezone.online (phải có SSL)
- ✅ WWW: https://www.mytimezone.online (nếu đã thêm)
