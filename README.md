# My TimeZone - World Time Zone Viewer

Tool đơn giản để xem và so sánh múi giờ của các thành phố trên thế giới. Perfect cho việc schedule meetings với team ở nhiều quốc gia.

## ✨ Features

- ✅ View 3+ timezones cùng lúc
- ✅ Thêm/xóa thành phố dễ dàng
- ✅ Hiển thị GMT offset
- ✅ Share link (URL encoding) - mọi người không cần setup lại
- ✅ Responsive mobile-first (iPhone focus)
- ✅ Clean Apple-style UI
- ✅ Tiếng Việt / English toggle
- ✅ Feedback form integration

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React** + **TypeScript** + **Vite**
- **TailwindCSS** (Apple-style design)
- **Luxon** (timezone handling)
- **URL params** for sharing (no backend needed!)

## 📱 Mobile-First Design

- Stack timezones vertically on mobile
- Horizontal scroll for hours
- Large touch targets (44px min)
- Sticky header with Share button

## 🔗 URL Sharing

Share link format:
```
https://mytimezone.io?cities=san-francisco,london,ho-chi-minh
```

## 🌍 Supported Cities

50+ cities including:
- San Francisco, New York, London, Paris, Berlin
- Ho Chi Minh City, Hanoi, Singapore, Bangkok
- Tokyo, Seoul, Beijing, Hong Kong
- Sydney, Melbourne, Dubai, and more...

## 📦 Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → "Import Project"
3. Select your GitHub repo
4. Click "Deploy" (done!)

## 🎨 Design Principles

- **Colors**: Apple blue (#0071E3), clean white background
- **Typography**: SF Pro Display, system fonts
- **Spacing**: Generous whitespace, 12px border-radius
- **Shadows**: Subtle (0 2px 8px rgba(0,0,0,0.08))

## 📝 License

ISC
