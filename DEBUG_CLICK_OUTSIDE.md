# Debug Checklist: Click Outside to Close

## Bước 1: Kiểm tra Console Logs

1. Mở Browser Console (F12)
2. Reload page
3. Search "new" để mở dropdown
4. Click bên ngoài dropdown
5. Xem console logs

### Logs mong đợi:
```
>>> Adding click outside listener (isOpen = true)
=== CLICK OUTSIDE DEBUG ===
1. Event fired: mousedown
2. Click target: <element>
3. Container ref exists?: true
4. Container ref: <div>
5. isOpen state: true
6. Contains check: false
7. Should close?: true
>>> CLOSING DROPDOWN <<<
```

## Bước 2: Kiểm tra các trường hợp

### Case 1: Không thấy log "Adding click outside listener"
**Nguyên nhân:** `isOpen` không phải `true`
**Fix:** Kiểm tra:
- Dropdown có thực sự mở không?
- `isOpen` state có đúng không?
- Có component nào đang override `isOpen` không?

### Case 2: Thấy "Adding listener" nhưng không thấy "CLICK OUTSIDE DEBUG"
**Nguyên nhân:** Event listener không được trigger
**Fix:**
- Kiểm tra có element nào đang chặn click không?
- Thử click vào nhiều vị trí khác nhau
- Kiểm tra z-index của dropdown

### Case 3: Thấy "CLICK OUTSIDE DEBUG" nhưng "Contains check: true"
**Nguyên nhân:** Click target nằm trong container
**Fix:**
- Kiểm tra `containerRef` có wrap đúng không?
- Kiểm tra dropdown có nằm trong container không?
- Kiểm tra có element nào đang overlap không?

### Case 4: "Container ref exists?: false"
**Nguyên nhân:** `containerRef.current` là `null`
**Fix:**
- Kiểm tra `ref={containerRef}` có được gán đúng không?
- Kiểm tra component có bị unmount không?
- Kiểm tra có lỗi render không?

## Bước 3: Kiểm tra HTML Structure

Mở DevTools → Elements, kiểm tra:
```html
<div class="relative" ref={containerRef}>
  <label>...</label>
  <div class="relative"> <!-- Search Input -->
    <input ... />
  </div>
  {isOpen && (
    <div class="absolute ..."> <!-- Dropdown -->
      ...
    </div>
  )}
</div>
```

**Đảm bảo:**
- Dropdown nằm TRONG container div (có ref)
- Không có element nào đang chặn click
- z-index của dropdown đúng (z-50)

## Bước 4: Test Manual

1. Mở Console
2. Chạy lệnh:
```javascript
// Kiểm tra containerRef
document.querySelector('[data-city-search]') // Nếu có data attribute
// Hoặc
document.querySelector('.relative') // Tìm div có class relative

// Kiểm tra dropdown
document.querySelector('[class*="absolute"][class*="top-full"]')
```

## Bước 5: Fix nếu cần

Nếu vẫn không hoạt động, thử:

1. **Thêm data attribute để dễ debug:**
```tsx
<div className="relative" ref={containerRef} data-city-search="true">
```

2. **Thử dùng click thay vì mousedown:**
```tsx
document.addEventListener('click', handleClickOutside, true);
```

3. **Thử không dùng capture phase:**
```tsx
document.addEventListener('mousedown', handleClickOutside);
```

4. **Kiểm tra có React Portal không:**
- Nếu dropdown render bằng Portal, cần check khác

## Bước 6: Kiểm tra Conflicts

- Có component nào khác đang dùng `mousedown` listener không?
- Có event handler nào đang gọi `stopPropagation()` không?
- Có overlay/modal nào đang chặn không?
