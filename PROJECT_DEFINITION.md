# 📋 ĐỊNH NGHĨA DỰ ÁN: MY TIME ZONE

## 🎯 Tổng quan

**My Time Zone** là một ứng dụng web để xem và so sánh múi giờ của các thành phố trên thế giới. Ứng dụng cho phép người dùng:
- Xem nhiều timezone cùng lúc trên một timeline thống nhất
- Thêm/xóa thành phố
- Drag & drop để sắp xếp lại thứ tự
- Chọn ngày để xem timeline (DateNavigator)
- Share link với URL encoding
- Responsive design (mobile-first)

**Tech Stack:**
- React 19 + TypeScript
- Vite (build tool)
- TailwindCSS 3.4.1
- Luxon (timezone handling)
- @dnd-kit (drag & drop)
- @vercel/analytics

---

## 🏗️ Kiến trúc

### Core Concept: Unified Timeline Architecture

**Điểm quan trọng nhất:** Tất cả các timezone rows hiển thị CÙNG MỘT absolute time range, chỉ khác nhau về cách hiển thị local time.

- Mỗi cột (column) đại diện cho CÙNG MỘT moment in time
- Các timezone khác nhau hiển thị local hour của họ tại cùng moment đó
- Ví dụ: 18h tại SF = 9h tại HCM = 2h tại London (cùng một cột)

### Reference Timezone System

- Thành phố đầu tiên trong danh sách là "reference timezone"
- Timeline được tính toán dựa trên reference timezone
- Current hour indicator chỉ hiển thị khi đang xem "Today"

---

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── App.tsx                    # Main app component
│   ├── CityPicker.tsx             # Dropdown để thêm thành phố
│   ├── CitySidebar.tsx            # Sidebar hiển thị thông tin thành phố
│   ├── CurrentTimeLine.tsx        # Đường chỉ giờ hiện tại (vertical line)
│   ├── DateNavigator.tsx          # Chọn ngày (7 ngày: yesterday + today + 5 days ahead)
│   ├── ErrorBoundary.tsx          # React Error Boundary
│   ├── FeedbackButton.tsx         # Floating feedback button (Tally.so)
│   ├── HourCell.tsx               # Component cho từng hour cell
│   ├── MobileTimezoneView.tsx     # Mobile layout với synchronized scrolling
│   ├── ShareButton.tsx            # Share URL button
│   ├── SortableTimeZoneRow.tsx    # Wrapper cho drag & drop
│   ├── TimeZoneRow.tsx            # Main timezone row component
│   ├── TimelineGrid.tsx           # Timeline grid component
│   └── Toast.tsx                  # Toast notification system
│
├── constants/
│   ├── cities.ts                  # Danh sách 50+ thành phố với timezone data
│   ├── layout.ts                  # Layout constants (widths, heights, breakpoints)
│   ├── timeColors.ts              # Time-of-day color constants (gradient colors)
│   ├── theme.ts                   # Design system (Notion-style colors)
│   └── translations.ts            # i18n translations (VI/EN)
│
├── hooks/
│   ├── useHoveredHour.ts          # Quản lý hover state trên timeline
│   ├── useTimezones.ts            # Core hook: tính toán timezone data
│   ├── useTimelineLayout.ts       # Responsive layout calculation
│   ├── useTranslation.ts          # i18n hook
│   └── useUrlState.ts             # URL state management + localStorage
│
├── types/
│   └── index.ts                   # TypeScript type definitions
│
└── utils/
    ├── colorUtils.ts              # Color interpolation & gradient functions
    ├── formatHelpers.ts           # Format functions (location, offset, time, colors)
    ├── timezoneHelpers.ts         # Timezone calculation utilities
    └── urlHelpers.ts              # URL encoding/decoding helpers
```

---

## 🎨 Tính năng chính

### 1. Unified Timeline View
- Tất cả timezone rows align theo cùng absolute time
- Mỗi cột = cùng moment in time
- Current hour indicator (vertical line) chỉ hiển thị khi viewing "Today"

### 2. Date Navigator
- Hiển thị 7 ngày: 1 ngày trước + hôm nay + 5 ngày sau
- Khi chọn ngày:
  - Nếu "Today": Timeline từ giờ hiện tại, cập nhật real-time
  - Nếu ngày khác: Timeline từ 0h-23h của ngày đó, không có current hour indicator

### 3. Gradient Time-of-Day Colors
**Mới implement:** Màu nền chuyển dần theo local hour của từng timezone

| Khung giờ | Màu | Gradient |
|-----------|-----|----------|
| 0-5h | Night | Xám (#F1F5F9) |
| 6-7h | Transition | Xám → Xanh lá (30-50%) |
| 8-16h | Business | Xanh lá → Xanh dương (#DCFCE7 → #DBEAFE) |
| 17h | Transition | Xanh dương → Cam (50%) |
| 18-19h | Evening | Cam (#FEF3C7) |
| 20h | Transition | Cam → Tím đỏ (50%) |
| 21-22h | Late Evening | Tím đỏ (#FCE7F3) |
| 23h | Transition | Tím đỏ → Xám (50%) |

**Implementation:**
- `src/constants/timeColors.ts` - Color constants
- `src/utils/colorUtils.ts` - Color interpolation functions
- `getHourColorSmooth()` - Returns gradient color based on localHour
- Applied via inline `backgroundColor` style in `HourCell.tsx`

### 4. Drag & Drop
- Sử dụng `@dnd-kit`
- Reorder cities bằng cách kéo thả
- Order được lưu vào URL và localStorage
- Thành phố đầu tiên = reference timezone

### 5. Responsive Design
- **Desktop (>1024px):** Auto-fit 24 columns, no scroll
- **Mobile (<1024px):** Horizontal scroll, sticky sidebar
- Sidebar width: 400px (desktop), 340px (mobile)
- Column width: Dynamic (desktop), 24px fixed (mobile)

### 6. URL Sharing
- Cities encoded in URL params: `?cities=san-francisco,new-york,london`
- Sync với localStorage
- Share button với native share API fallback

### 7. Error Handling
- ErrorBoundary component
- Toast notifications cho user feedback
- Try/catch trong localStorage operations
- Validation cho URL params

---

## 🔧 Các cải thiện gần đây

### Refactoring (đã hoàn thành)
1. **Shared Utilities:** Tạo `formatHelpers.ts` để loại bỏ code duplication
2. **Component Splitting:** Tách `TimeZoneRow` thành `HourCell`, `CitySidebar`, `TimelineGrid`
3. **Constants:** Move magic numbers vào `layout.ts`
4. **Unused Code:** Xóa `HoveredTimeColumn.tsx`, `useMediaQuery.ts`
5. **Error Boundaries:** Thêm ErrorBoundary và Toast system
6. **Optimization:** Caching cho timezone abbreviations, validation cho URL/localStorage

### Gradient Colors (mới implement)
- Thay thế fixed colors bằng gradient colors
- Smooth transitions giữa các khung giờ
- Mỗi timezone có màu riêng theo localHour

---

## 📊 Data Flow

### 1. Initial Load
```
URL params → useUrlState → localStorage fallback → default cities
↓
useTimezones → getTimeZoneData → generateTimeSlots
↓
TimeZoneData[] → Components render
```

### 2. Date Selection
```
DateNavigator → setSelectedDate
↓
useTimezones recalculates với selectedDate
↓
Timeline hiển thị từ 0h hoặc current hour (nếu Today)
```

### 3. Add/Remove City
```
CityPicker → handleAddCity/handleRemoveCity
↓
setCities → useUrlState → updateUrlParams + localStorage
↓
useTimezones recalculates với cities mới
```

### 4. Drag & Drop
```
DragEnd event → handleDragEnd
↓
arrayMove → setCities → useUrlState
↓
First city becomes reference timezone
```

---

## 🎨 Design System

### Colors (Notion-style)
- Background: `#FAFAFA` (notion-bg)
- Text: `#37352F` (notion-text)
- Border: `#E9E9E7` (notion-border)
- Accent: `#2F81F7` (notion-accent)

### Typography
- Font: Inter (Google Fonts)
- Sizes: 11px (xs) → 24px (2xl)
- Letter spacing: -0.01em

### Spacing
- Padding: 4px, 8px, 12px, 16px, 24px, 32px
- Border radius: 4px (sm) → 12px (xl)

---

## 🔑 Key Files & Functions

### Core Logic
- `src/hooks/useTimezones.ts` - Tính toán timezone data, xử lý selectedDate
- `src/utils/timezoneHelpers.ts` - `generateTimeSlots()`, `getTimeZoneData()`
- `src/utils/colorUtils.ts` - `getHourColorSmooth()` - Gradient color calculation

### Components
- `src/components/HourCell.tsx` - Render từng hour cell với gradient color
- `src/components/TimeZoneRow.tsx` - Main row component (uses HourCell, CitySidebar, TimelineGrid)
- `src/components/DateNavigator.tsx` - Date selection UI

### State Management
- `src/hooks/useUrlState.ts` - URL + localStorage sync
- `src/hooks/useHoveredHour.ts` - Hover state management

---

## 🚀 Deployment

- **Platform:** Vercel
- **Domain:** (configured via Vercel)
- **Analytics:** Google Analytics (gtag.js) + Vercel Analytics
- **Build:** `npm run build` → `dist/` folder

---

## 📝 Notes quan trọng

1. **Unified Timeline:** Tất cả rows phải align theo cùng absolute time - đây là core architecture
2. **Reference Timezone:** City đầu tiên là reference, timeline tính theo timezone này
3. **Gradient Colors:** Màu được tính theo `localHour` của từng timezone, không phải reference hour
4. **Date Selection:** Khi chọn ngày khác "Today", timeline hiển thị từ 0h, không có current hour indicator
5. **Mobile Layout:** Sidebar sticky, timeline scrollable riêng biệt

---

## 🧪 Testing Checklist

- [x] Timeline alignment: Tất cả rows align đúng
- [x] Gradient colors: Màu chuyển dần theo localHour
- [x] Date Navigator: Chọn ngày hiển thị đúng timeline
- [x] Current hour indicator: Chỉ hiển thị khi viewing Today
- [x] Drag & drop: Reorder cities hoạt động
- [x] URL sharing: Share link load đúng cities
- [x] Mobile responsive: Sidebar sticky, timeline scrollable
- [x] Error handling: ErrorBoundary và Toast notifications

---

## 📚 Dependencies chính

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@vercel/analytics": "^1.6.1",
  "luxon": "^3.7.2",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "tailwindcss": "^3.4.1"
}
```

---

**Last Updated:** 2025-01-XX
**Status:** ✅ Production Ready
**Version:** 1.0.0
