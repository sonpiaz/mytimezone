# 📋 NGỮ CẢNH DỰ ÁN: MY TIMEZONE APP

## 🎯 TỔNG QUAN DỰ ÁN

**My Timezone App** là một ứng dụng web để xem và so sánh múi giờ của các thành phố trên thế giới, tương tự World Time Buddy. Ứng dụng được xây dựng với React + TypeScript + Vite, sử dụng Luxon cho xử lý timezone và TailwindCSS cho styling theo phong cách Apple.

**URL Production**: Deployed trên Vercel (có thể có custom domain)

---

## 🏗️ KIẾN TRÚC DỰ ÁN

### Tech Stack:
- **Frontend**: React 19.2.0 + TypeScript
- **Build Tool**: Vite 7.3.1
- **Styling**: TailwindCSS 3.4.1 (Apple-style colors)
- **Timezone**: Luxon 3.7.2
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **Deployment**: Vercel

### Cấu trúc thư mục:
```
my-timezone-app/
├── src/
│   ├── components/
│   │   ├── TimeZoneRow.tsx          # Component hiển thị 1 timezone row
│   │   ├── SortableTimeZoneRow.tsx  # Wrapper cho drag & drop
│   │   ├── CityPicker.tsx            # Dropdown để thêm city
│   │   ├── ShareButton.tsx           # Nút chia sẻ link
│   │   ├── FeedbackButton.tsx        # Nút feedback
│   │   └── CurrentTimeLine.tsx       # Đường line hiện tại (tạm disabled)
│   ├── hooks/
│   │   ├── useUrlState.ts            # Quản lý state từ URL + localStorage
│   │   ├── useTimezones.ts           # Tính toán timezone data
│   │   ├── useTranslation.ts         # i18n (VI/EN)
│   │   ├── useHoveredHour.ts         # Quản lý hover state
│   │   └── useTimelineLayout.ts      # Tính toán responsive layout
│   ├── utils/
│   │   ├── timezoneHelpers.ts        # Các hàm tính toán timezone
│   │   └── urlHelpers.ts             # Encode/decode URL params
│   ├── constants/
│   │   ├── cities.ts                 # Danh sách cities (50+ cities)
│   │   └── translations.ts           # Translations VI/EN
│   ├── types/
│   │   └── index.ts                  # TypeScript types
│   ├── App.tsx                       # Main component
│   └── main.tsx                      # Entry point
├── tailwind.config.cjs
├── postcss.config.cjs
└── package.json
```

---

## 🎨 THIẾT KẾ & UI

### Apple-Style Design:
- **Colors**: 
  - Primary: `#0071E3` (Apple blue)
  - Background: `#FFFFFF` (white)
  - Text: `#1D1D1F` (dark gray)
  - Border: `#D2D2D7` (subtle gray)
  - Green: `#34C759`
- **Typography**: System fonts (-apple-system, SF Pro Display)
- **Border Radius**: 12px (cards), 8px (buttons)
- **Shadows**: Subtle (0 2px 8px rgba(0,0,0,0.08))

### Layout Structure:
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Title + Language Toggle + Share Button              │
├─────────────────────────────────────────────────────────────┤
│ Add City Dropdown                                           │
├─────────────────────────────────────────────────────────────┤
│ Sidebar (380px) │ Timeline Grid (24 columns)               │
│ ⋮⋮ 🏠 SF PST   │ SAT JAN 17                                │
│ ×  USA, CA     │ [0][1][2][3][4][5]...[21][22][23]        │
│    9:17p       │                                            │
│    Sat, Jan 17 │                                            │
├─────────────────────────────────────────────────────────────┤
│ ⋮⋮ +8 London  │ SUN JAN 18                                │
│ ×  UK         │ [8][9][10][11]...[0][1][2]                │
│   5:17a       │                                            │
│   Sun, Jan 18 │                                            │
└─────────────────────────────────────────────────────────────┘
```

### Row Height:
- **Sidebar**: `h-20` (80px) - 2 dòng
- **Timeline**: Date header (24px) + Hour row (56px) = 80px total

---

## 🔑 TÍNH NĂNG CHÍNH

### 1. **Unified Timeline Architecture**
- **Concept**: Tất cả timezone rows align theo cùng một absolute time axis
- **Mỗi column** đại diện cho cùng một moment in time, chỉ hiển thị khác nhau theo local time
- **Reference timezone**: City đầu tiên trong list (có home icon 🏠)

### 2. **Default Cities & LocalStorage**
- **Default**: London (reference), San Francisco, Ho Chi Minh City
- **LocalStorage**: Tự động lưu/load cities khi thay đổi
- **Storage key**: `'my-timezone-cities-order'`

### 3. **Drag & Drop Reordering**
- Sử dụng `@dnd-kit` library
- Kéo thả để sắp xếp lại cities
- City đầu tiên = reference city (có home icon)

### 4. **Hover Effect**
- **Background highlight**: Khi hover vào time slot, highlight background (bg-blue-100)
- **Không dùng vertical line overlay** (đã remove HoveredTimeColumn component)

### 5. **Time-of-Day Color Coding**
- **Đêm/Sáng sớm (0-8)**: `bg-gray-100 text-gray-400`
- **Giờ làm việc (8-17)**: `bg-green-50 text-green-700`
- **Buổi tối (17-21)**: `bg-amber-50 text-amber-700`
- **Đêm khuya (21-24)**: `bg-slate-100 text-slate-500`
- **Current hour**: `bg-blue-500 text-white` (override tất cả)

### 6. **Date Labels on Timeline**
- Hiển thị "SAT JAN 17" phía trên timeline grid
- Chỉ hiển thị khi `isNewDay === true` (cột đầu tiên hoặc khi date thay đổi)
- Date header row: 24px height

### 7. **City Dropdown với Timezone**
- **Format**: "GMT-6 · Chicago, Illinois, USA"
- **Sắp xếp**: Theo UTC offset (từ -12 đến +14)
- **Hiển thị**: Timezone + City name + State (nếu có) + Country

### 8. **URL Sharing**
- Cities được encode trong URL params: `?cities=london,san-francisco,ho-chi-minh`
- Share link để người khác xem cùng cities

### 9. **Responsive Design**
- **Desktop (>1024px)**: Sidebar 380px, timeline auto-fit 24 columns
- **Mobile (<1024px)**: Sidebar 320px sticky, timeline scrollable với fixed column width 24px
- **Auto-scroll**: Mobile tự động scroll đến current time column

---

## 📐 CẤU TRÚC DỮ LIỆU

### City Interface:
```typescript
interface City {
  id: string;
  name: string;
  nameVi: string;
  country: string;
  state?: string;        // Optional, cho US cities
  timezone: string;      // IANA format (e.g., "America/Los_Angeles")
  slug: string;          // URL-friendly (e.g., "san-francisco")
}
```

### TimeZoneData Interface:
```typescript
interface TimeZoneData {
  city: City;
  currentTime: string;
  formattedTime: string;      // "9:17p Sat, Jan 17"
  formattedDate: string;      // "Sat, Jan 17"
  dayOfWeek: string;          // "Sat"
  gmtOffset: string;          // "GMT-8"
  timezoneAbbr: string;       // "PST"
  hours: HourData[];
  isReference: boolean;       // True nếu là city đầu tiên
  offsetFromReference?: number; // +15, +8, -6, etc.
}
```

### HourData Interface:
```typescript
interface HourData {
  columnIndex: number;        // 0-23, cùng cho tất cả timezones
  referenceHour: number;      // Hour trong reference timezone
  localHour: number;          // Hour trong local timezone
  localDate: Date;
  displayLabel: string;       // "18:00"
  isNextDay: boolean;
  isPreviousDay: boolean;
  isBusinessHour: boolean;    // 9am-5pm local time
  isCurrentHour: boolean;     // Current hour trong reference timezone
  dayName?: string;           // "SAT", "SUN" cho date labels
  dateLabel?: string;         // "JAN 17", "JAN 18" cho date labels
  isNewDay?: boolean;         // True khi bắt đầu ngày mới
}
```

---

## 🔧 CÁC COMPONENT CHÍNH

### 1. **App.tsx**
- Main orchestrator component
- Quản lý cities state, drag & drop, hover events
- Layout: Header + CityPicker + Timezone Rows
- Centered với `max-w-7xl mx-auto`

### 2. **TimeZoneRow.tsx**
- Hiển thị 1 timezone row
- **2 modes**: `sidebarOnly` và `timelineOnly` (để scroll riêng biệt)
- **Sidebar layout** (2 dòng):
  - Line 1: Drag handle + Home icon/Offset + City name + TZ badge + Time
  - Line 2: Remove button + Country/State + Date
- **Timeline layout**:
  - Date header row (24px) với day/date labels
  - Hour numbers row (56px) với time-of-day colors

### 3. **useTimezones.ts**
- Tính toán timezone data cho tất cả cities
- Sử dụng city đầu tiên làm reference timezone
- Generate 24 time slots từ reference time
- Update mỗi phút để giữ time current

### 4. **useUrlState.ts**
- Quản lý cities state từ URL params
- Sync với localStorage
- Priority: URL > localStorage > defaults

### 5. **useTimelineLayout.ts**
- Tính toán responsive layout
- Desktop: Sidebar 380px, columns auto-fit
- Mobile: Sidebar 320px, columns fixed 24px

### 6. **timezoneHelpers.ts**
- `generateTimeSlots()`: Generate 24 slots với unified timeline logic
- `getTimeZoneData()`: Tính toán data cho 1 city
- `getGMTOffset()`: Format GMT offset string
- `getTimezoneAbbreviation()`: Lấy timezone abbreviation (PST, GMT, etc.)
- `getTimezoneOffset()`: Tính offset giữa 2 timezones

---

## 🎨 MÀU SẮC & STYLING

### Time-of-Day Colors:
```typescript
// Night/Early morning (0-8)
bg-gray-100 text-gray-400

// Business hours (8-17)
bg-green-50 text-green-700

// Evening (17-21)
bg-amber-50 text-amber-700

// Late night (21-24)
bg-slate-100 text-slate-500

// Current hour (override)
bg-blue-500 text-white shadow-md rounded-lg

// Hover (override)
bg-blue-100 text-gray-700
```

### Sidebar Layout:
- **Width**: 380px (desktop), 320px (mobile)
- **Height**: 80px (h-20)
- **Columns**:
  - Column 1: Drag handle + Remove button (w-12, stacked)
  - Column 2: Home icon/Offset (w-12)
  - Column 3: City + Country (w-44, fixed width)
  - Column 4: Time + Date (min-w-[90px], right-aligned)

---

## 🔄 FLOW HOẠT ĐỘNG

### 1. **Page Load**:
```
URL params → useUrlState → Load cities
  ↓
localStorage (nếu URL empty)
  ↓
Default cities (nếu localStorage empty)
  ↓
useTimezones → Calculate timezone data
  ↓
Render TimeZoneRow components
```

### 2. **Add City**:
```
CityPicker dropdown → Select city
  ↓
onAddCity → Update cities state
  ↓
useUrlState → Save to localStorage + Update URL
  ↓
useTimezones → Recalculate với city mới
  ↓
Re-render với city mới
```

### 3. **Drag & Drop**:
```
User drags city → @dnd-kit detects
  ↓
handleDragEnd → Reorder cities array
  ↓
City đầu tiên = new reference city
  ↓
useTimezones → Recalculate với reference mới
  ↓
Re-render với order mới
```

### 4. **Hover Timeline**:
```
Mouse move over timeline → Detect column index
  ↓
handleMouseMove → Set hoveredColumnIndex
  ↓
TimeZoneRow receives hoveredColumnIndex prop
  ↓
Apply bg-blue-100 to hovered cells
```

---

## 📝 CÁC THAY ĐỔI GẦN ĐÂY

### 1. **Compact Layout** (Latest):
- Row height: 80px (h-20)
- Sidebar width: 380px (desktop), 320px (mobile)
- Date labels trên timeline
- Time-of-day color coding

### 2. **Remove Button Position**:
- Di chuyển từ bên phải (next to time) → bên trái (below drag handle)

### 3. **Hover Effect**:
- Thay vertical line overlay → background highlight
- Remove HoveredTimeColumn component

### 4. **Default Cities**:
- London (reference), San Francisco, Ho Chi Minh City
- Home icon: SVG solid black thay vì emoji 🏠

### 5. **City Dropdown**:
- Format: "GMT-6 · Chicago, Illinois, USA"
- Sắp xếp theo UTC offset

### 6. **Centered Layout**:
- Max width: `max-w-7xl` (1280px)
- Tất cả sections centered với `mx-auto`

---

## 🐛 CÁC VẤN ĐỀ ĐÃ FIX

1. ✅ Row height quá cao → Giảm xuống 80px
2. ✅ Sidebar content bị cắt → Tăng width + min-width
3. ✅ Timeline overlap sidebar → Thêm margin-left
4. ✅ Hover line che số giờ → Thay bằng background highlight
5. ✅ Layout không centered → Thêm max-w-7xl mx-auto
6. ✅ Date labels missing → Thêm date header row
7. ✅ Không có time-of-day colors → Thêm 4 màu phân biệt

---

## 🚀 DEPLOYMENT

- **Platform**: Vercel
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Framework**: Vite
- **SPA routing**: Rewrites trong `vercel.json`

---

## 📦 DEPENDENCIES CHÍNH

```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "luxon": "^3.7.2",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.1",
    "typescript": "~5.9.3",
    "vite": "^7.2.4"
  }
}
```

---

## 🎯 TRẠNG THÁI HIỆN TẠI

### ✅ Hoàn thành:
- Unified timeline architecture
- Drag & drop reordering
- Hover effect với background highlight
- Time-of-day color coding
- Date labels trên timeline
- Default cities + localStorage persistence
- City dropdown với timezone info
- Responsive design
- URL sharing
- Centered layout

### 🔄 Đã disable tạm thời:
- `CurrentTimeLine` component (để debug hover line issue)

### 📋 Có thể cải thiện:
- Thêm keyboard shortcuts
- Thêm favorite city combinations
- Meeting scheduler helper
- Calendar export

---

## 💡 KEY INSIGHTS

1. **Unified Timeline**: Tất cả rows share cùng absolute time axis - đây là core architecture
2. **Reference City**: City đầu tiên luôn là reference, các cities khác tính offset từ đó
3. **LocalStorage**: Lưu slugs (not full objects) để tiết kiệm space
4. **Responsive**: Desktop auto-fit, mobile scrollable với sticky sidebar
5. **Apple Style**: Subtle colors, clean design, generous whitespace

---

## 📞 THÔNG TIN LIÊN HỆ

- **Project**: My Timezone App
- **Location**: `/Users/sonpiaz/my-timezone-app`
- **Git**: Connected to GitHub (sonpiaz/mytimezone)
- **Deployment**: Vercel

---

*Document này được tạo để cung cấp ngữ cảnh đầy đủ cho AI assistant khi tiếp tục phát triển dự án.*
