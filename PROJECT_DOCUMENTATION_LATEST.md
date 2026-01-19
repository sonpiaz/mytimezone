# 📚 TÀI LIỆU DỰ ÁN: MY TIME ZONE
**Last Updated:** 2025-01-18  
**Version:** 1.3.0  
**Status:** ✅ Production Ready

---

## 🎯 TỔNG QUAN

**My Time Zone** là ứng dụng web miễn phí để xem và so sánh múi giờ của các thành phố trên thế giới. Ứng dụng cho phép người dùng:

- ✅ Xem nhiều timezone cùng lúc trên một timeline thống nhất
- ✅ Thêm/xóa thành phố với fuzzy search thông minh
- ✅ Drag & drop để sắp xếp lại thứ tự
- ✅ **Short URL Codes** - Share link với URL ngắn gọn (56% shorter)
- ✅ **Calendar Integration** - Add to Calendar với viral branding
- ✅ Meeting Scheduler - Tìm "Giờ Vàng" họp cho nhiều timezone
- ✅ Responsive design (mobile-first)
- ✅ PWA support với install prompt
- ✅ Multi-language (Tiếng Việt / English)
- ✅ SEO optimized với OG images

**Live URL:** https://mytimezone.online

---

## 🛠️ TECH STACK

### Core
- **React 19.2.0** + **TypeScript 5.9.3**
- **Vite 7.2.4** - Build tool
- **TailwindCSS 3.4.1** - Styling
- **Luxon 3.7.2** - Timezone handling

### Libraries
- **@dnd-kit/core 6.3.1** - Drag & drop
- **@dnd-kit/sortable 10.0.0** - Sortable components
- **react-router-dom 7.12.0** - Client-side routing
- **@vercel/analytics 1.6.1** - Analytics

### PWA
- **vite-plugin-pwa 1.2.0** - PWA support
- Service Worker với Workbox
- Install prompt với Fibonacci sequence logic

### Deployment
- **Platform:** Vercel
- **Analytics:** Google Analytics + Vercel Analytics
- **Domain:** mytimezone.online

---

## 🏗️ KIẾN TRÚC CORE

### Unified Timeline Architecture

**Điểm quan trọng nhất:** Tất cả các timezone rows hiển thị **CÙNG MỘT absolute time range**, chỉ khác nhau về cách hiển thị local time.

- Mỗi cột (column) đại diện cho **CÙNG MỘT moment in time**
- Các timezone khác nhau hiển thị local hour của họ tại cùng moment đó
- Ví dụ: 18h tại SF = 9h tại HCM = 2h tại London (cùng một cột)

### Reference Timezone System

- Thành phố đầu tiên trong danh sách là "reference timezone"
- Timeline được tính toán dựa trên reference timezone
- Current hour indicator chỉ hiển thị khi đang xem "Today"

### Routing Architecture

- **React Router DOM** với `BrowserRouter` wrap toàn bộ app
- Routes:
  - `/` - Home page (main timezone view)
  - `/about` - About page
- URL state management với `useUrlState` hook
- Infinite loop prevention trong navigation

---

## 📁 CẤU TRÚC THƯ MỤC

```
src/
├── components/
│   ├── AboutPage.tsx              # About page với SEO meta tags
│   ├── AddToCalendarButton.tsx    # Calendar integration dropdown (NEW)
│   ├── App.tsx                    # Main app component với routing
│   ├── CitySearch.tsx             # Search input với fuzzy search
│   ├── CitySidebar.tsx            # Sidebar hiển thị thông tin thành phố
│   ├── CurrentTimeLine.tsx        # Đường chỉ giờ hiện tại (vertical line)
│   ├── ErrorBoundary.tsx          # React Error Boundary
│   ├── Footer.tsx                 # Footer với navigation
│   ├── HomePage.tsx               # Home page component
│   ├── HourCell.tsx               # Component cho từng hour cell
│   ├── InstallPrompt.tsx         # PWA install prompt (Fibonacci logic)
│   ├── MeetingScheduler.tsx      # Meeting Scheduler modal
│   ├── MobileTimezoneView.tsx     # Mobile layout
│   ├── OfflineIndicator.tsx      # Offline status indicator
│   ├── ResultSection.tsx          # Result section cho Meeting Scheduler
│   ├── ShareButton.tsx            # Share URL button (short codes)
│   ├── SortableTimeZoneRow.tsx    # Wrapper cho drag & drop
│   ├── TimeSlotCard.tsx           # Time slot card với Calendar integration
│   ├── TimeZoneRow.tsx            # Main timezone row component
│   ├── TimelineGrid.tsx           # Timeline grid component
│   ├── Toast.tsx                  # Toast notification system
│   └── UpdateNotification.tsx     # Service worker update notification
│
├── constants/
│   ├── cities.ts                  # Danh sách 70+ thành phố với timezone data + short codes
│   ├── layout.ts                  # Layout constants (widths, heights, breakpoints)
│   ├── timeColors.ts              # Time-of-day color constants (Notion-style)
│   ├── theme.ts                   # Design system (Notion-style colors)
│   └── translations.ts            # i18n translations (VI/EN)
│
├── hooks/
│   ├── useClickOutside.ts         # Click outside detection
│   ├── useHoveredHour.ts          # Quản lý hover state trên timeline
│   ├── useTimezones.ts            # Core hook: tính toán timezone data
│   ├── useTimelineLayout.ts       # Responsive layout calculation
│   ├── useTranslation.ts          # i18n hook
│   └── useUrlState.ts             # URL state management + localStorage (với infinite loop fix)
│
├── types/
│   ├── index.ts                   # TypeScript type definitions (City với code field)
│   └── meetingScheduler.ts        # Types cho Meeting Scheduler
│
└── utils/
    ├── calendarUtils.ts           # Calendar integration utilities (NEW)
    ├── colorUtils.ts              # Color interpolation & gradient functions
    ├── flagEmoji.ts               # Flag emoji utilities
    ├── formatHelpers.ts           # Format functions (location, offset, time, colors)
    ├── fuzzySearch.ts             # Fuzzy search logic cho CitySearch
    ├── meetingScheduler.ts        # Meeting Scheduler algorithm
    ├── storageHelpers.ts          # localStorage helpers
    ├── timezoneDetect.ts          # Auto-detect user timezone
    ├── timezoneHelpers.ts         # Timezone calculation utilities
    └── urlHelpers.ts              # URL encoding/decoding helpers (short codes support)
```

---

## 🎨 TÍNH NĂNG CHÍNH

### 1. Unified Timeline View
- Tất cả timezone rows align theo cùng absolute time
- Mỗi cột = cùng moment in time
- Current hour indicator (vertical line) chỉ hiển thị khi viewing "Today"

### 2. Gradient Time-of-Day Colors (Notion-style)
**Màu sắc mềm mại, hài hòa:**

| Khung giờ | Màu | Hex Code |
|-----------|-----|----------|
| 0-6h, 22-23h | Night | `#EBECED` (Notion Gray) |
| 7h | Transition | Night → Morning (50%) |
| 8-13h | Morning | `#DDEDEA` (Notion Green) |
| 14h | Transition | Morning → Afternoon (50%) |
| 15-19h | Afternoon | `#DDEBF1` (Notion Blue) |
| 20-21h | Transition | Afternoon → Night (33-66%) |

### 3. City Search với Fuzzy Search
- Search input thay vì dropdown
- Fuzzy search logic:
  - Case-insensitive
  - Diacritic-insensitive
  - Partial matches
  - Common abbreviations (sf, nyc, hcm)
  - Search across: name, country, state, timezone abbreviation, GMT offset

### 4. Drag & Drop
- Sử dụng `@dnd-kit`
- Reorder cities bằng cách kéo thả
- Order được lưu vào URL và localStorage
- Thành phố đầu tiên = reference timezone

### 5. Responsive Design
- **Desktop (>1024px):** Auto-fit 24 columns, no scroll
- **Mobile (<1024px):** Horizontal scroll, sticky sidebar
- Sidebar width: 300px (desktop), 320px (mobile)
- Column width: Dynamic (desktop), 24px fixed (mobile)

### 6. Short URL Codes (NEW - v1.3.0)
**Tính năng:** URL ngắn gọn hơn 56% để dễ share qua SMS/social media

**Format:**
- **Old:** `?cities=san-francisco%2Clondon%2Csingapore` (106 chars)
- **New:** `?c=sf,ldn,sgp` (47 chars)

**Features:**
- Short codes cho 70+ cities (2-4 characters)
- Backward compatible với old format (`?cities=`)
- Support mixed format (codes + slugs)
- Auto-migration: old URLs vẫn work, new URLs dùng short format

**Code Examples:**
- San Francisco: `sf`
- New York: `nyc`
- London: `ldn`
- Singapore: `sgp`
- Tokyo: `tyo`
- Sydney: `syd`

### 7. Calendar Integration (NEW - v1.3.0)
**Tính năng:** Add to Calendar với viral branding "Scheduled with mytimezone.online"

**Features:**
- **AddToCalendarButton** dropdown với 3 options:
  - Google Calendar
  - Outlook
  - Apple Calendar (ICS download)
- **Viral Branding:** Mỗi calendar event có footer:
  ```
  🌍 Time Zone Reference:
  • San Francisco: 7:00 AM - 8:00 AM (PST)
  • London: 3:00 PM - 4:00 PM (GMT)
  • Singapore: 11:00 PM - 12:00 AM +1 (GMT+8)

  ━━━━━━━━━━━━━━━━━━━━
  Scheduled with mytimezone.online
  Compare time zones → https://mytimezone.online
  ━━━━━━━━━━━━━━━━━━━━
  ```
- **Share Meeting Button:** Copy meeting details với native share support
- **Meeting Title Input:** User có thể đặt tên meeting
- **Timezone Info:** Tự động include time range cho mỗi timezone

### 8. Meeting Scheduler
**Tính năng:** Tự động tìm "Giờ Vàng" họp cho nhiều timezone

**Features:**
- Select/deselect participants từ timeline
- Set working hours (mặc định 9-18)
- Chọn duration (30min, 1hr, 1.5hr, 2hr)
- Chọn date
- Meeting title input
- **Results phân loại:**
  - ✅ Perfect: Tất cả trong giờ làm việc
  - ⚠️ Good: 1 người hơi ngoài giờ
  - 🔶 Acceptable: 2 người ngoài giờ
- **Actions:**
  - Add to Calendar: Dropdown với Google/Outlook/Apple
  - Share Meeting: Copy details với native share

### 9. PWA Support
- Service Worker với Workbox
- Install prompt với **Fibonacci sequence logic:**
  - Hiện tại lần visit thứ 3, 5, 8, 13, 21, 34...
  - Không hiện nếu user đã dismiss
  - Delay 3 giây trước khi hiện
- Offline indicator
- Update notification

### 10. Routing & Navigation
- React Router DOM với `BrowserRouter`
- Routes: `/` (Home), `/about` (About)
- Footer navigation với `window.location.href` (guaranteed navigation)
- URL state management với infinite loop prevention

### 11. SEO & Meta Tags
- OG images với TZ monogram logo
- Meta tags cho social sharing
- Schema.org JSON-LD
- Dynamic title và description cho About page
- Favicon với version query strings (`?v=2`)

### 12. Error Handling
- ErrorBoundary component
- Toast notifications cho user feedback
- Try/catch trong localStorage operations
- Validation cho URL params

---

## 🔧 CÁC FIX GẦN ĐÂY

### Version 1.3.0 (2025-01-18)

#### 1. Calendar Integration với Viral Branding
- ✅ AddToCalendarButton component với dropdown menu
- ✅ Support Google Calendar, Outlook, Apple Calendar
- ✅ Viral branding footer trong mỗi calendar event
- ✅ Share Meeting button với native share + clipboard
- ✅ Meeting title input trong MeetingScheduler

#### 2. Simplified Calendar UI
- ✅ Removed "Download .ics" option (redundant)
- ✅ Removed "Copy meeting details" option (merged với Share Meeting)
- ✅ Chỉ còn 3 options: Google, Outlook, Apple Calendar
- ✅ Fixed duplicate timezone info trong calendar description

#### 3. Short URL Codes Implementation
- ✅ Added `code` field to City interface (2-4 characters)
- ✅ Short codes cho 70+ cities (sf, nyc, ldn, sgp, etc.)
- ✅ URL format: `?c=sf,ldn,sgp` thay vì `?cities=san-francisco,london,singapore`
- ✅ 56% shorter URLs (106 → 47 characters)
- ✅ Backward compatible với old format
- ✅ Auto-migration: old URLs vẫn work

#### 4. Favicon Cache Fix
- ✅ Added version query strings (`?v=2`) to favicon links
- ✅ Updated Vercel cache headers cho favicon files
- ✅ Force revalidate cho favicon và apple-touch-icon

### Version 1.2.0 (2025-01-18)

#### 1. About Link Navigation Fix
**Vấn đề:** Click "About" ở Footer không navigate, phải refresh page.

**Nguyên nhân:** DndContext sensors có thể intercept click events từ Link component.

**Giải pháp:**
- Thay `<Link>` bằng `<button>` với `window.location.href`
- Guaranteed navigation, bypass React Router issues
- File: `src/components/Footer.tsx`

#### 2. Infinite Loop Fix
**Vấn đề:** "Maximum update depth exceeded" khi navigate từ About về Home.

**Nguyên nhân:** `useUrlState` hook gây infinite loop:
- `popstate` event trigger `setCities`
- `setCities` trigger `updateUrlParams`
- URL change có thể trigger lại `popstate`

**Giải pháp:**
- Thêm `areCitiesEqual()` helper để so sánh cities
- Sử dụng `useRef` để tránh dependency loop
- Chỉ listen `popstate` khi ở home page
- Chỉ update URL params khi ở home page
- File: `src/hooks/useUrlState.ts`

#### 3. Router Restructure
- ✅ App.tsx chỉ chứa Routes
- ✅ HomePage component riêng biệt
- ✅ Simplified navigation với `window.location.href`

#### 4. OG Image Placeholder
- ✅ Tạo SVG placeholder: `public/og-image.svg` (1200x630)
- ✅ Update meta tags trong `index.html`
- ✅ Support cho Facebook, Twitter, LinkedIn sharing

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
  aliases?: string[];    // Alternative names
  timezone: string;      // IANA format (e.g., "America/Los_Angeles")
  slug: string;          // URL-friendly (e.g., "san-francisco")
  code: string;          // Short code for URL (e.g., "sf") - NEW
}
```

### TimeZoneData Interface:
```typescript
interface TimeZoneData {
  city: City;
  currentTime: string;
  formattedTime: string;      // "9:17p Sat, Jan 17"
  formattedDate: string;        // "Sat, Jan 17"
  dayOfWeek: string;            // "Sat"
  gmtOffset: string;            // "GMT-8"
  timezoneAbbr: string;        // "PST"
  hours: HourData[];
  isReference: boolean;        // True nếu là city đầu tiên
  offsetFromReference?: number; // +15, +8, -6, etc.
}
```

### HourData Interface:
```typescript
interface HourData {
  columnIndex: number;         // 0-23, cùng cho tất cả timezones
  referenceHour: number;       // Hour trong reference timezone
  localHour: number;           // Hour trong local timezone
  localDate: Date;
  displayLabel: string;        // "18" (chỉ số giờ)
  isNextDay: boolean;
  isPreviousDay: boolean;
  isBusinessHour: boolean;      // 9am-5pm local time
  isCurrentHour: boolean;       // Current hour trong reference timezone
  dayName?: string;            // "SAT", "SUN" cho date labels
  dateLabel?: string;           // "JAN 17", "JAN 18" cho date labels
  isNewDay?: boolean;          // True khi bắt đầu ngày mới (localHour === 0)
}
```

### CalendarEventParams Interface:
```typescript
interface CalendarEventParams {
  title: string;
  startTime: DateTime;
  duration: number; // minutes
  timezones: Array<{
    cityName: string;
    timezone: string;
    localTime: string; // "7:00 AM - 8:00 AM (PST)"
  }>;
  description?: string;
}
```

---

## 🔄 DATA FLOW

### 1. Initial Load
```
URL params (?c= or ?cities=) → useUrlState → localStorage fallback → auto-detect → default cities
↓
useTimezones → getTimeZoneData → generateTimeSlots
↓
TimeZoneData[] → Components render
```

### 2. Navigation Flow
```
User clicks About → window.location.href = '/about' → AboutPage renders
↓
User clicks Back → window.location.href = '/' → HomePage renders
↓
useUrlState syncs với URL params (với infinite loop prevention)
```

### 3. Add/Remove City
```
CitySearch → handleAddCity/handleRemoveCity
↓
setCities → useUrlState → updateUrlParams (short codes) + localStorage
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

### 5. Calendar Integration Flow
```
User selects time slot → TimeSlotCard
↓
AddToCalendarButton → generateGoogleCalendarUrl/generateOutlookUrl/downloadICS
↓
Calendar event created với viral branding footer
```

---

## 🎨 DESIGN SYSTEM

### Colors (Notion-style)
- Background: `#FAFAFA` (notion-bg)
- Text: `#37352F` (notion-text)
- Text Light: `#9B9A97` (notion-textLight)
- Border: `#E9E9E7` (notion-border)
- Hover: `#F7F6F3` (notion-hover)
- Accent: `#2F81F7` (notion-accent)

### Typography
- Font: Inter (Google Fonts)
- Sizes: 11px (xs) → 24px (2xl)
- Letter spacing: -0.01em

### Layout Constants
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

## 🚀 DEPLOYMENT

### Vercel Configuration
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Framework:** Vite
- **SPA routing:** Rewrites trong `vercel.json`
- **Cache headers:** Favicon files với `must-revalidate`

### Analytics
- Google Analytics (gtag.js) trong `index.html`
- Vercel Analytics (`@vercel/analytics`) trong `main.tsx`

### PWA
- Service Worker với Workbox
- Manifest file: `public/manifest.webmanifest`
- Icons: `public/icons/` với TZ monogram logo
- Theme color: `#000000` (black)

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
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.12.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/luxon": "^3.7.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.23",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.1",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4",
    "vite-plugin-pwa": "^1.2.0"
  }
}
```

---

## 🧪 TESTING CHECKLIST

### Core Features
- [x] Timeline alignment: Tất cả rows align đúng
- [x] Gradient colors: Màu chuyển dần theo localHour
- [x] Current hour indicator: Chỉ hiển thị khi viewing Today
- [x] Drag & drop: Reorder cities hoạt động
- [x] URL sharing: Share link load đúng cities
- [x] Mobile responsive: Sidebar sticky, timeline scrollable

### Navigation
- [x] About link navigation: Click About → navigate đúng
- [x] Back button: Click Back → navigate về home
- [x] Direct URL access: `/about` → hiển thị About page
- [x] No infinite loop: Navigate qua lại không crash

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
- [x] Meeting title input
- [x] Results phân loại đúng
- [x] Calendar integration (Google/Outlook/Apple)
- [x] Share Meeting với native share

### Calendar Integration
- [x] Add to Calendar dropdown (3 options)
- [x] Google Calendar URL generation
- [x] Outlook URL generation
- [x] Apple Calendar ICS download
- [x] Viral branding trong calendar events
- [x] Timezone reference với time range
- [x] Share Meeting copy to clipboard

### Short URL Codes
- [x] New format works: `?c=sf,ldn,sgp`
- [x] Old format still works: `?cities=san-francisco,london`
- [x] Mixed format works: `?c=sf,london,sgp`
- [x] Share button generates short URLs
- [x] URL updates with short codes

### PWA
- [x] Install prompt logic đúng (Fibonacci)
- [x] Service worker registration
- [x] Offline indicator
- [x] Update notification

---

## 💡 KEY INSIGHTS

1. **Unified Timeline:** Tất cả rows phải align theo cùng absolute time - đây là core architecture
2. **Reference Timezone:** City đầu tiên là reference, timeline tính theo timezone này
3. **Gradient Colors:** Màu được tính theo `localHour` của từng timezone, không phải reference hour
4. **Navigation:** Dùng `window.location.href` để guarantee navigation, bypass React Router issues
5. **Infinite Loop Prevention:** Luôn check state changes trước khi update, sử dụng refs để tránh dependency loops
6. **Mobile Layout:** Sidebar sticky, timeline scrollable riêng biệt
7. **Short URL Codes:** 56% shorter URLs giúp dễ share qua SMS/social media
8. **Viral Branding:** Calendar events với branding footer tạo viral loop

---

## 📚 FILES QUAN TRỌNG

### Core Logic
- `src/hooks/useTimezones.ts` - Tính toán timezone data
- `src/utils/timezoneHelpers.ts` - `generateTimeSlots()`, `getTimeZoneData()`
- `src/utils/colorUtils.ts` - `getHourColorSmooth()` - Gradient color calculation
- `src/utils/meetingScheduler.ts` - Meeting Scheduler algorithm
- `src/hooks/useUrlState.ts` - URL + localStorage sync (với infinite loop fix)

### Calendar Integration
- `src/utils/calendarUtils.ts` - Calendar URL generation, ICS export, share text
- `src/components/AddToCalendarButton.tsx` - Calendar dropdown component
- `src/components/TimeSlotCard.tsx` - Time slot với calendar integration

### URL Management
- `src/utils/urlHelpers.ts` - Short codes encode/decode, backward compatibility
- `src/constants/cities.ts` - City data với short codes

### Components
- `src/components/HourCell.tsx` - Render từng hour cell với gradient color
- `src/components/TimeZoneRow.tsx` - Main row component
- `src/components/CitySearch.tsx` - Search input với fuzzy search
- `src/components/MeetingScheduler.tsx` - Meeting Scheduler modal
- `src/components/Footer.tsx` - Footer với navigation
- `src/components/AboutPage.tsx` - About page với SEO
- `src/components/HomePage.tsx` - Home page component

### Routing
- `src/main.tsx` - Entry point với BrowserRouter
- `src/App.tsx` - Routes configuration
- `vercel.json` - Vercel deployment config với cache headers

---

## 🎯 TRẠNG THÁI HIỆN TẠI

### ✅ Hoàn thành:
- Unified timeline architecture
- Drag & drop reordering
- Gradient time-of-day colors (Notion-style)
- City Search với fuzzy search
- Responsive design
- **Short URL Codes** (56% shorter)
- **Calendar Integration** với viral branding
- Meeting Scheduler với scoring algorithm
- Error handling (ErrorBoundary + Toast)
- PWA support với Fibonacci install prompt
- Routing với React Router DOM
- About page với SEO
- OG images với TZ monogram logo
- Infinite loop fixes
- Navigation fixes
- Favicon cache fixes

### 📋 Có thể cải thiện:
- Keyboard shortcuts
- Favorite city combinations
- More timezone abbreviations
- Dark mode
- More languages
- Analytics tracking cho calendar events

---

## 📝 CHANGELOG

### Version 1.3.0 (2025-01-18)
- ✅ **Calendar Integration** với viral branding
- ✅ **Simplified Calendar UI** (3 options only)
- ✅ **Short URL Codes** implementation (56% shorter)
- ✅ **Favicon cache fix** với version query strings
- ✅ **Meeting title input** trong MeetingScheduler
- ✅ **Share Meeting** với native share support

### Version 1.2.0 (2025-01-18)
- ✅ Fix About link navigation (window.location.href)
- ✅ Fix infinite loop trong useUrlState
- ✅ Router restructure (App.tsx chỉ Routes)
- ✅ Add OG image placeholder
- ✅ Update SEO meta tags
- ✅ PWA install prompt với Fibonacci logic

### Version 1.1.0 (2025-01-XX)
- ✅ Meeting Scheduler
- ✅ PWA support
- ✅ Multi-language support

### Version 1.0.0 (2025-01-XX)
- ✅ Initial release
- ✅ Unified timeline
- ✅ Drag & drop
- ✅ Gradient colors
- ✅ City Search

---

## 🔗 LINKS

- **Live URL:** https://mytimezone.online
- **GitHub:** (Repository URL)
- **Author:** Son Piaz
- **License:** MIT

---

*Tài liệu này cung cấp ngữ cảnh đầy đủ cho AI assistant và developers khi tiếp tục phát triển dự án.*
