# 📋 TÓM TẮT NGỮ CẢNH DỰ ÁN - MY TIMEZONE APP

## 🎯 DỰ ÁN LÀ GÌ?

**My Timezone App** - Ứng dụng web xem và so sánh múi giờ, tương tự World Time Buddy.

**Tech Stack**: React 19 + TypeScript + Vite + TailwindCSS + Luxon

**URL**: Deployed trên Vercel

---

## 🏗️ KIẾN TRÚC CORE

### Unified Timeline Architecture (QUAN TRỌNG):
- **Tất cả timezone rows align theo cùng một absolute time axis**
- Mỗi column (0-23) đại diện cho **cùng một moment in time**
- Chỉ hiển thị khác nhau theo local time của mỗi timezone
- **Reference city**: City đầu tiên trong list (có home icon 🏠)

**Ví dụ**: Khi 18:00 ở San Francisco (GMT-8):
- Column 18 ở SF = 18:00
- Column 18 ở HCM (GMT+7) = 09:00 ngày hôm sau (cùng moment)
- Column 18 ở London (GMT+0) = 02:00 ngày hôm sau (cùng moment)

### Cấu trúc chính:
```
App.tsx
  ├── useUrlState() → Quản lý cities từ URL + localStorage
  ├── useTimezones() → Tính toán timezone data (reference = cities[0])
  ├── useTimelineLayout() → Responsive layout (sidebar 380px, columns auto-fit)
  └── TimeZoneRow (2 modes):
      ├── sidebarOnly → City info (2 dòng, 80px height)
      └── timelineOnly → Date header + Hour grid (80px total)
```

---

## 🎨 UI/UX HIỆN TẠI

### Layout:
- **Centered**: `max-w-7xl mx-auto` (1280px)
- **Sidebar**: 380px (desktop), 320px (mobile) - Fixed width
- **Timeline**: 24 columns, auto-fit width trên desktop
- **Row height**: 80px (sidebar + timeline)

### Sidebar Structure (2 dòng):
```
Line 1: [⋮⋮] [🏠] [San Francisco] [PST] · [USA, California]        [9:17p]
Line 2: [×]                                                         [Sat, Jan 17]
```

### Timeline Structure:
```
Date Header: [SAT] [JAN 17]                    [SUN] [JAN 18]
Hour Row:    [0][1][2][3]...[21][22][23] | [0][1][2]...
```

### Colors (Time-of-Day):
- **0-8h**: Gray (bg-gray-100) - Đêm/Sáng sớm
- **8-17h**: Green (bg-green-50) - Business hours
- **17-21h**: Amber (bg-amber-50) - Buổi tối
- **21-24h**: Slate (bg-slate-100) - Đêm khuya
- **Current hour**: Blue (bg-blue-500) - Override tất cả
- **Hover**: Light blue (bg-blue-100)

---

## 🔑 TÍNH NĂNG

1. **Default Cities**: London (reference), San Francisco, Ho Chi Minh City
2. **LocalStorage**: Tự động lưu/load cities
3. **Drag & Drop**: Sắp xếp lại cities (city đầu tiên = reference)
4. **Hover Effect**: Background highlight (không dùng line overlay)
5. **Date Labels**: Hiển thị trên timeline khi date thay đổi
6. **City Dropdown**: Format "GMT-6 · Chicago, Illinois, USA", sort theo UTC offset
7. **URL Sharing**: Encode cities trong URL params
8. **Responsive**: Desktop auto-fit, mobile scrollable với sticky sidebar

---

## 📐 DATA STRUCTURE

### HourData (QUAN TRỌNG):
```typescript
{
  columnIndex: 0-23,        // Cùng cho tất cả timezones (same absolute time)
  localHour: 0-23,          // Hour trong local timezone
  localDate: Date,          // Full date/time
  isCurrentHour: boolean,   // Current hour trong reference timezone
  dayName: "SAT",          // Cho date labels
  dateLabel: "JAN 17",     // Cho date labels
  isNewDay: boolean        // Khi bắt đầu ngày mới
}
```

### TimeZoneData:
```typescript
{
  city: City,
  hours: HourData[],        // 24 slots, aligned với reference
  isReference: boolean,    // True nếu là city đầu tiên
  offsetFromReference: number  // +15, +8, -6, etc.
}
```

---

## 🔧 KEY FUNCTIONS

### `generateTimeSlots()` (timezoneHelpers.ts):
- Input: `timezone`, `referenceTime`, `referenceDay`, `currentHourInReference`
- Output: 24 HourData slots
- Logic: Mỗi slot = referenceTime + i hours, convert sang local timezone

### `useTimezones()`:
- Sử dụng `cities[0]` làm reference
- Generate 24 slots từ reference time
- Tính `offsetFromReference` cho mỗi city
- Update mỗi phút

### `useUrlState()`:
- Priority: URL params > localStorage > defaults
- Lưu slugs (not full objects) vào localStorage

---

## 📝 FILES QUAN TRỌNG

1. **`src/App.tsx`**: Main component, layout, drag & drop, hover handlers
2. **`src/components/TimeZoneRow.tsx`**: Row component (sidebar + timeline)
3. **`src/hooks/useTimezones.ts`**: Timezone calculation logic
4. **`src/utils/timezoneHelpers.ts`**: Helper functions (generateTimeSlots, getGMTOffset, etc.)
5. **`src/constants/cities.ts`**: 50+ cities list
6. **`src/hooks/useTimelineLayout.ts`**: Responsive layout calculation

---

## 🎯 TRẠNG THÁI HIỆN TẠI

✅ **Hoàn thành**:
- Unified timeline architecture
- Compact layout (80px rows)
- Date labels trên timeline
- Time-of-day colors
- City dropdown với timezone
- LocalStorage persistence
- Responsive design

🔄 **Tạm disabled**:
- CurrentTimeLine component (để debug)

---

## 💡 KEY INSIGHTS

1. **Unified Timeline** là core: Tất cả rows share cùng absolute time axis
2. **Reference city** (đầu tiên) quyết định timeline alignment
3. **LocalStorage** lưu slugs, không phải full objects
4. **Hover effect** dùng background highlight, không dùng line overlay
5. **Colors** subtle (50 level), Apple-style

---

*File đầy đủ: `PROJECT_CONTEXT.md` (442 dòng)*
