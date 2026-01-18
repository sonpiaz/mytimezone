# 🌍 My Time Zone

Ứng dụng web để xem và so sánh múi giờ của các thành phố trên thế giới, tương tự World Time Buddy.

## ✨ Tính năng chính

- ✅ **Xem nhiều timezone cùng lúc** - Timeline thống nhất hiển thị cùng một absolute time range
- ✅ **Fuzzy Search** - Tìm kiếm thành phố thông minh với autocomplete
- ✅ **Drag & Drop** - Sắp xếp lại thứ tự thành phố dễ dàng
- ✅ **Share Link** - Chia sẻ URL với danh sách thành phố đã chọn
- ✅ **Meeting Scheduler** - Tìm "Giờ Vàng" họp cho nhiều timezone
- ✅ **Responsive Design** - Hoạt động tốt trên mobile và desktop
- ✅ **Gradient Colors** - Màu sắc theo thời gian trong ngày (Notion-style)
- ✅ **i18n** - Hỗ trợ tiếng Việt và tiếng Anh

## 🛠️ Tech Stack

- **React 19.2.0** + **TypeScript**
- **Vite 7.3.1** - Build tool
- **TailwindCSS 3.4.1** - Styling
- **Luxon 3.7.2** - Timezone handling
- **@dnd-kit** - Drag & drop
- **@vercel/analytics** - Analytics

## 🏗️ Kiến trúc

### Unified Timeline Architecture

Tất cả các timezone rows hiển thị **CÙNG MỘT absolute time range**, chỉ khác nhau về cách hiển thị local time.

- Mỗi cột (column) đại diện cho **CÙNG MỘT moment in time**
- Các timezone khác nhau hiển thị local hour của họ tại cùng moment đó
- Ví dụ: 18h tại SF = 9h tại HCM = 2h tại London (cùng một cột)

### Reference Timezone System

- Thành phố đầu tiên trong danh sách là "reference timezone"
- Timeline được tính toán dựa trên reference timezone
- Current hour indicator chỉ hiển thị khi đang xem "Today"

## 📦 Cài đặt

```bash
npm install
npm run dev
```

## 🚀 Build

```bash
npm run build
npm run preview
```

## 📁 Cấu trúc thư mục

```
src/
├── components/          # React components
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── constants/          # Constants & data
└── types/              # TypeScript types
```

## 🎨 Design System

- **Colors**: Notion-style soft colors
- **Typography**: Inter font family
- **Spacing**: Consistent padding/margins
- **Responsive**: Mobile-first approach

## 📝 Recent Updates

### Latest Fixes (2024)

- ✅ **Time Indicator Position Fix** - Sử dụng DOM position trực tiếp thay vì tính toán
- ✅ **Layout Alignment** - Sidebar và Timeline align đúng trên desktop
- ✅ **Mobile Overlap Fix** - Text không chồng lên nhau trên mobile
- ✅ **Compact Sidebar** - Layout gọn hơn, 1-2 lines
- ✅ **Removed Date Navigator** - Đơn giản hóa UI, luôn hiển thị "Today"

## 🌐 Deployment

- **Platform**: Vercel
- **Analytics**: Google Analytics + Vercel Analytics
- **Domain**: Custom domain support

## 📄 License

MIT

## 👨‍💻 Author

Son Piaz
