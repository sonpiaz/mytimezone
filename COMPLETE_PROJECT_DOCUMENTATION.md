# 📚 TÀI LIỆU ĐẦY ĐỦ: MY TIME ZONE

## 🎯 TỔNG QUAN DỰ ÁN

**My Time Zone** là một ứng dụng web để xem và so sánh múi giờ của các thành phố trên thế giới, tương tự World Time Buddy. Ứng dụng cho phép người dùng:

- ✅ Xem nhiều timezone cùng lúc trên một timeline thống nhất
- ✅ Thêm/xóa thành phố với fuzzy search
- ✅ Drag & drop để sắp xếp lại thứ tự
- ✅ Chọn ngày để xem timeline (DateNavigator với weekend indicator)
- ✅ Share link với URL encoding
- ✅ Responsive design (mobile-first)
- ✅ Meeting Scheduler - Tìm "Giờ Vàng" họp cho nhiều timezone
- ✅ Gradient time-of-day colors (Notion-style soft colors)

**Tech Stack:**
- React 19.2.0 + TypeScript
- Vite 7.3.1 (build tool)
- TailwindCSS 3.4.1
- Luxon 3.7.2 (timezone handling)
- @dnd-kit (drag & drop)
- @vercel/analytics

**Deployment:**
- Platform: Vercel
- Analytics: Google Analytics (gtag.js) + Vercel Analytics

---

## 🏗️ KIẾN TRÚC CORE

### Unified Timeline Architecture

**Điểm quan trọng nhất:** Tất cả các timezone rows hiển thị CÙNG MỘT absolute time range, chỉ khác nhau về cách hiển thị local time.

- Mỗi cột (column) đại diện cho CÙNG MỘT moment in time
- Các timezone khác nhau hiển thị local hour của họ tại cùng moment đó
- Ví dụ: 18h tại SF = 9h tại HCM = 2h tại London (cùng một cột)

### Reference Timezone System

- Thành phố đầu tiên trong danh sách là "reference timezone"
- Timeline được tính toán dựa trên reference timezone
- Current hour indicator chỉ hiển thị khi đang xem "Today"

---

## 📁 CẤU TRÚC THƯ MỤC

```
src/
├── components/
│   ├── App.tsx                    # Main app component
│   ├── CitySearch.tsx             # Search input với fuzzy search
│   ├── CitySidebar.tsx            # Sidebar hiển thị thông tin thành phố
│   ├── CurrentTimeLine.tsx        # Đường chỉ giờ hiện tại (vertical line)
│   ├── DateNavigator.tsx          # Chọn ngày (7 ngày) với weekend indicator
│   ├── ErrorBoundary.tsx          # React Error Boundary
│   ├── FeedbackButton.tsx         # Floating feedback button (Tally.so)
│   ├── HourCell.tsx               # Component cho từng hour cell
│   ├── MeetingScheduler.tsx       # Meeting Scheduler modal
│   ├── MobileTimezoneView.tsx     # Mobile layout với synchronized scrolling
│   ├── ResultSection.tsx           # Result section cho Meeting Scheduler
│   ├── ShareButton.tsx            # Share URL button
│   ├── SortableTimeZoneRow.tsx    # Wrapper cho drag & drop
│   ├── TimeSlotCard.tsx           # Time slot card cho Meeting Scheduler
│   ├── TimeZoneRow.tsx            # Main timezone row component
│   ├── TimelineGrid.tsx           # Timeline grid component
│   └── Toast.tsx                  # Toast notification system
│
├── constants/
│   ├── cities.ts                  # Danh sách 100+ thành phố với timezone data
│   ├── layout.ts                  # Layout constants (widths, heights, breakpoints)
│   ├── timeColors.ts              # Time-of-day color constants (Notion-style)
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
│   ├── index.ts                   # TypeScript type definitions
│   └── meetingScheduler.ts        # Types cho Meeting Scheduler
│
└── utils/
    ├── colorUtils.ts              # Color interpolation & gradient functions
    ├── formatHelpers.ts           # Format functions (location, offset, time, colors)
    ├── fuzzySearch.ts             # Fuzzy search logic cho CitySearch
    ├── meetingScheduler.ts        # Meeting Scheduler algorithm
    ├── timezoneDetect.ts          # Auto-detect user timezone
    ├── timezoneHelpers.ts         # Timezone calculation utilities
    └── urlHelpers.ts              # URL encoding/decoding helpers
```

---

## 🎨 TÍNH NĂNG CHÍNH

### 1. Unified Timeline View
- Tất cả timezone rows align theo cùng absolute time
- Mỗi cột = cùng moment in time
- Current hour indicator (vertical line) chỉ hiển thị khi viewing "Today"

### 2. Date Navigator
- Hiển thị 7 ngày: 1 ngày trước + hôm nay + 5 ngày sau
- **Weekend indicator:**
  - Thứ 7, Chủ nhật: màu đỏ (`text-red-400`)
  - Khi selected: nền đen + text đỏ nhạt (`text-red-300`) + ring đỏ (`ring-2 ring-red-400/50`)
- **Tooltip:** Hover vào ngày → hiển thị tên thứ (ví dụ: "Sun / Today")
- Khi chọn ngày:
  - Nếu "Today": Timeline từ giờ hiện tại, cập nhật real-time
  - Nếu ngày khác: Timeline từ 0h-23h của ngày đó, không có current hour indicator

### 3. Gradient Time-of-Day Colors (Notion-style)
**Màu sắc mềm mại, hài hòa:**

| Khung giờ | Màu | Hex Code |
|-----------|-----|----------|
| 0-6h, 22-23h | Night | `#EBECED` (Notion Gray) |
| 7h | Transition | Night → Morning (50%) |
| 8-13h | Morning | `#DDEDEA` (Notion Green) |
| 14h | Transition | Morning → Afternoon (50%) |
| 15-19h | Afternoon | `#DDEBF1` (Notion Blue) |
| 20-21h | Transition | Afternoon → Night (33-66%) |

**Implementation:**
- `src/constants/timeColors.ts` - Color constants
- `src/utils/colorUtils.ts` - `getHourColorSmooth()` function
- Applied via inline `backgroundColor` style in `HourCell.tsx`

### 4. City Search với Fuzzy Search
- Search input thay vì dropdown
- Fuzzy search logic:
  - Case-insensitive
  - Diacritic-insensitive (tìm "Ho Chi Minh" khi gõ "ho chi minh")
  - Partial matches
  - Common abbreviations (sf, nyc, hcm)
  - Search across: name, country, state, timezone abbreviation, GMT offset
- Dropdown results với format: "City name, Country, GMT offset"
- Click outside to close
- Keyboard navigation (arrow keys, Enter, Escape)

### 5. Drag & Drop
- Sử dụng `@dnd-kit`
- Reorder cities bằng cách kéo thả
- Order được lưu vào URL và localStorage
- Thành phố đầu tiên = reference timezone

### 6. Responsive Design
- **Desktop (>1024px):** Auto-fit 24 columns, no scroll
- **Mobile (<1024px):** Horizontal scroll, sticky sidebar
- Sidebar width: 300px (desktop), 320px (mobile)
- Column width: Dynamic (desktop), 24px fixed (mobile)

### 7. URL Sharing
- Cities encoded in URL params: `?cities=san-francisco,new-york,london`
- Sync với localStorage
- Share button với native share API fallback

### 8. Meeting Scheduler
**Tính năng mới:** Tự động tìm "Giờ Vàng" họp cho nhiều timezone

**Features:**
- Select/deselect participants từ timeline
- Set working hours (mặc định 9-18)
- Chọn duration (30min, 1hr, 1.5hr, 2hr)
- Chọn date
- Include weekends checkbox
- **Results phân loại:**
  - ✅ Perfect: Tất cả trong giờ làm việc
  - ⚠️ Good: 1 người hơi ngoài giờ
  - 🔶 Acceptable: 2 người ngoài giờ
- **Actions:**
  - Schedule: Mở Google Calendar với event đã điền
  - Copy Times: Copy tất cả timezones vào clipboard
  - Email: Mở mail client với subject/body đã điền

**Algorithm:**
- Scoring system (0-100):
  - Base: 100 điểm
  - Trừ 20 điểm mỗi giờ ngoài working hours
  - Trừ 30 điểm nếu quá sớm (< 7h) hoặc quá muộn (> 21h)
  - Cộng 10 điểm nếu trong business hours (9-17)

### 9. Error Handling
- ErrorBoundary component
- Toast notifications cho user feedback
- Try/catch trong localStorage operations
- Validation cho URL params

---

## 📊 DATA STRUCTURES

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
  displayLabel: string;       // "18" (chỉ số giờ)
  isNextDay: boolean;
  isPreviousDay: boolean;
  isBusinessHour: boolean;    // 9am-5pm local time
  isCurrentHour: boolean;     // Current hour trong reference timezone
  dayName?: string;           // "SAT", "SUN" cho date labels
  dateLabel?: string;         // "JAN 17", "JAN 18" cho date labels
  isNewDay?: boolean;         // True khi bắt đầu ngày mới (localHour === 0)
}
```

### Meeting Scheduler Types:
```typescript
interface Participant {
  city: City;
  isSelected: boolean;
  isHost: boolean;
}

interface WorkingHours {
  start: number;  // 9 = 9:00
  end: number;    // 18 = 18:00
}

interface TimeSlot {
  startHour: number;
  endHour: number;
  participants: ParticipantTime[];
  quality: 'perfect' | 'good' | 'acceptable' | 'poor';
  score: number;  // 0-100
}

interface SchedulerResult {
  perfect: TimeSlot[];
  good: TimeSlot[];
  acceptable: TimeSlot[];
  noResult: boolean;
}
```

---

## 🔧 KEY COMPONENTS

### 1. App.tsx
- Main orchestrator component
- Quản lý cities state, drag & drop, hover events
- Layout: Header + DateNavigator + CitySearch + Timezone Rows
- Centered với `max-w-6xl mx-auto`
- Meeting Scheduler button trong header (chỉ hiện khi có ≥2 cities)

### 2. TimeZoneRow.tsx
- Hiển thị 1 timezone row
- **2 modes**: `sidebarOnly` và `timelineOnly` (để scroll riêng biệt)
- Sử dụng `CitySidebar` và `TimelineGrid` components

### 3. CitySidebar.tsx
- Sidebar layout (2 dòng):
  - Line 1: Drag handle + GMT offset + Home icon (nếu reference) + City name + Current time
  - Line 2: Remove button + Country/State + Date

### 4. TimelineGrid.tsx
- Timeline layout:
  - Date header row (24px) với day/date labels (chỉ hiện tại `localHour === 0`)
  - Hour numbers row với gradient colors

### 5. HourCell.tsx
- Render từng hour cell
- Gradient color via inline `backgroundColor` style
- Date label thay thế hour number tại `localHour === 0`

### 6. DateNavigator.tsx
- Date selection UI với 7 ngày
- Weekend indicator (màu đỏ)
- Tooltip khi hover
- Icon lịch không có hover effect

### 7. CitySearch.tsx
- Search input với fuzzy search
- Dropdown results
- Click outside to close
- Keyboard navigation

### 8. MeetingScheduler.tsx
- Modal chính với form và kết quả
- Select/deselect participants
- Working hours, duration, date selectors
- Results phân loại Perfect/Good/Acceptable

### 9. useTimezones.ts
- Tính toán timezone data cho tất cả cities
- Sử dụng city đầu tiên làm reference timezone
- Generate 24 time slots từ reference time
- Update mỗi phút để giữ time current (chỉ khi viewing "Today")
- Nhận `selectedDate` parameter để hiển thị timeline cho ngày khác

### 10. useUrlState.ts
- Quản lý cities state từ URL params
- Sync với localStorage
- Priority: URL > localStorage > auto-detect > defaults
- Auto-detect user timezone và suggest cities

---

## 🎨 DESIGN SYSTEM

### Colors (Notion-style)
- Background: `#FAFAFA` (notion-bg)
- Text: `#37352F` (notion-text)
- Text Light: `#9B9A97` (notion-textLight)
- Border: `#E9E9E7` (notion-border)
- Hover: `#F7F6F3` (notion-hover)
- Accent: `#2F81F7` (notion-accent)
- Accent Green: `#0F7B0F` (notion-accentGreen)

### Typography
- Font: Inter (Google Fonts)
- Sizes: 11px (xs) → 24px (2xl)
- Letter spacing: -0.01em

### Spacing
- Padding: 4px, 8px, 12px, 16px, 24px, 32px
- Border radius: 4px (sm) → 12px (xl)

### Layout Constants (src/constants/layout.ts)
```typescript
BREAKPOINT_DESKTOP = 1024
MIN_COLUMN_WIDTH = 24
MOBILE_COLUMN_WIDTH = 24
SIDEBAR_WIDTH_DESKTOP = 300
SIDEBAR_WIDTH_MOBILE = 320
DATE_HEADER_HEIGHT = 24
HOUR_ROW_HEIGHT_DESKTOP = 56
HOUR_ROW_HEIGHT_MOBILE = 48
HOURS_PER_DAY = 24
MAIN_CONTENT_MAX_WIDTH = 1152 (max-w-6xl)
```

---

## 🔄 DATA FLOW

### 1. Initial Load
```
URL params → useUrlState → localStorage fallback → auto-detect → default cities
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
↓
CurrentTimeLine chỉ hiển thị nếu isSelectedDateToday === true
```

### 3. Add/Remove City
```
CitySearch → handleAddCity/handleRemoveCity
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
↓
useTimezones recalculates với reference mới
```

### 5. Meeting Scheduler
```
User clicks "Find Best Time" → Open MeetingScheduler modal
↓
Select participants, working hours, duration, date
↓
findBestMeetingTimes() → Evaluate all time slots
↓
Categorize results (Perfect/Good/Acceptable)
↓
Display results với TimeSlotCard components
```

---

## 🔑 KEY FUNCTIONS

### timezoneHelpers.ts
- `generateTimeSlots()`: Generate 24 slots với unified timeline logic
- `getTimeZoneData()`: Tính toán data cho 1 city
- `getGMTOffset()`: Format GMT offset string
- `getTimezoneAbbreviation()`: Lấy timezone abbreviation (PST, GMT, etc.)
- `getTimezoneOffset()`: Tính offset giữa 2 timezones

### colorUtils.ts
- `getHourColorSmooth(localHour: number)`: Returns gradient color based on localHour
- `hexToRgb()`, `rgbToHex()`, `interpolateColor()`: Color manipulation

### formatHelpers.ts
- `formatLocation()`: Format "City, State, Country"
- `formatOffset()`: Format GMT offset
- `getTimeOnly()`: Format time only
- `getTimeOfDayColor()`: Get gradient color for hour
- `getTimeOfDayStyle()`: Get text color classes

### fuzzySearch.ts
- `fuzzySearchCities(query, existingCitySlugs)`: Fuzzy search logic
- `normalize()`: Lowercase, remove diacritics
- `abbreviations`: Common abbreviations map

### meetingScheduler.ts
- `findBestMeetingTimes()`: Main algorithm
- `evaluateTimeSlot()`: Evaluate một time slot
- `generateGoogleCalendarUrl()`: Generate Google Calendar link
- `shareViaEmail()`: Generate mailto link

---

## 📝 CÁC CẢI THIỆN GẦN ĐÂY

### 1. Meeting Scheduler (Mới nhất)
- Tìm "Giờ Vàng" họp cho nhiều timezone
- Scoring algorithm với quality categorization
- Google Calendar & Email integration

### 2. Date Navigator với Weekend Indicator
- Màu đỏ cho cuối tuần
- Tooltip hiển thị thứ
- Weekend indicator khi selected (ring đỏ + text đỏ nhạt)

### 3. City Search với Fuzzy Search
- Thay dropdown bằng search input
- Fuzzy search logic mạnh mẽ
- Click outside to close
- Keyboard navigation

### 4. Gradient Colors (Notion-style)
- Thay thế fixed colors bằng gradient colors
- Smooth transitions giữa các khung giờ
- Notion-style soft colors

### 5. Refactoring
- Shared utilities (`formatHelpers.ts`)
- Component splitting (`HourCell`, `CitySidebar`, `TimelineGrid`)
- Constants centralization (`layout.ts`)
- Error boundaries và Toast system

---

## 🚀 DEPLOYMENT

### Vercel Configuration
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Framework**: Vite
- **SPA routing**: Rewrites trong `vercel.json`

### Analytics
- Google Analytics (gtag.js) trong `index.html`
- Vercel Analytics (`@vercel/analytics`) trong `main.tsx`

---

## 📦 DEPENDENCIES

```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@vercel/analytics": "^1.6.1",
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

## 🧪 TESTING CHECKLIST

### Core Features
- [x] Timeline alignment: Tất cả rows align đúng
- [x] Gradient colors: Màu chuyển dần theo localHour
- [x] Date Navigator: Chọn ngày hiển thị đúng timeline
- [x] Weekend indicator: Màu đỏ + tooltip
- [x] Current hour indicator: Chỉ hiển thị khi viewing Today
- [x] Drag & drop: Reorder cities hoạt động
- [x] URL sharing: Share link load đúng cities
- [x] Mobile responsive: Sidebar sticky, timeline scrollable

### City Search
- [x] Fuzzy search tìm được cities
- [x] Click outside to close
- [x] Keyboard navigation
- [x] Abbreviations (sf, nyc, hcm)

### Meeting Scheduler
- [x] Select/deselect participants
- [x] Working hours selector
- [x] Duration selector
- [x] Date picker
- [x] Results phân loại đúng
- [x] Google Calendar link
- [x] Copy Times
- [x] Email sharing

---

## 💡 KEY INSIGHTS

1. **Unified Timeline:** Tất cả rows phải align theo cùng absolute time - đây là core architecture
2. **Reference Timezone:** City đầu tiên là reference, timeline tính theo timezone này
3. **Gradient Colors:** Màu được tính theo `localHour` của từng timezone, không phải reference hour
4. **Date Selection:** Khi chọn ngày khác "Today", timeline hiển thị từ 0h, không có current hour indicator
5. **Mobile Layout:** Sidebar sticky, timeline scrollable riêng biệt
6. **Meeting Scheduler:** Scoring algorithm dựa trên working hours và business hours

---

## 📚 FILES QUAN TRỌNG

### Core Logic
- `src/hooks/useTimezones.ts` - Tính toán timezone data
- `src/utils/timezoneHelpers.ts` - `generateTimeSlots()`, `getTimeZoneData()`
- `src/utils/colorUtils.ts` - `getHourColorSmooth()` - Gradient color calculation
- `src/utils/meetingScheduler.ts` - Meeting Scheduler algorithm

### Components
- `src/components/HourCell.tsx` - Render từng hour cell với gradient color
- `src/components/TimeZoneRow.tsx` - Main row component
- `src/components/DateNavigator.tsx` - Date selection UI
- `src/components/CitySearch.tsx` - Search input với fuzzy search
- `src/components/MeetingScheduler.tsx` - Meeting Scheduler modal

### State Management
- `src/hooks/useUrlState.ts` - URL + localStorage sync
- `src/hooks/useHoveredHour.ts` - Hover state management

---

## 🎯 TRẠNG THÁI HIỆN TẠI

### ✅ Hoàn thành:
- Unified timeline architecture
- Drag & drop reordering
- Hover effect với background highlight
- Gradient time-of-day colors (Notion-style)
- Date labels trên timeline
- Date Navigator với weekend indicator
- Default cities + localStorage persistence
- City Search với fuzzy search
- Responsive design
- URL sharing
- Centered layout
- Meeting Scheduler với scoring algorithm
- Error handling (ErrorBoundary + Toast)

### 📋 Có thể cải thiện:
- Keyboard shortcuts
- Favorite city combinations
- Calendar export
- More timezone abbreviations
- Dark mode

---

**Last Updated:** 2025-01-XX  
**Status:** ✅ Production Ready  
**Version:** 1.1.0

---

*Tài liệu này cung cấp ngữ cảnh đầy đủ cho AI assistant khi tiếp tục phát triển dự án.*
