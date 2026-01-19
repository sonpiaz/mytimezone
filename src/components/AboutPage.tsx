import { useEffect } from 'react';
import { Footer } from './Footer';
import { useTranslation } from '../hooks/useTranslation';

// Content definitions for both languages
const aboutContent = {
  vi: {
    title: 'Về MyTimezone',
    description: 'MyTimezone giúp bạn chia sẻ khung giờ làm việc của mình với người khác dễ dàng. Kết nối phối hợp quốc tế không còn rào cản.',
    intro1: 'MyTimezone là công cụ đơn giản giúp bạn hiển thị khung giờ làm việc quốc tế, dễ dàng chia sẻ ‒ cho cá nhân, nhóm hay tổ chức.',
    intro2: 'Được thiết kế với giao diện rõ ràng, linh hoạt trong tùy chỉnh và dễ dàng nhúng, MyTimezone hỗ trợ bạn làm việc toàn cầu mà không gặp rào cản về múi giờ.',
    whatItDoes: 'Cách hoạt động',
    whatItDoesDesc1: 'Bạn thêm các thành phố, và công cụ hiển thị giờ địa phương của chúng trên một timeline duy nhất. Khi là 9 giờ sáng ở San Francisco, bạn có thể thấy đó là 5 giờ chiều ở London và 1 giờ sáng ngày mai ở Singapore.',
    whatItDoesDesc2: 'Ngoài ra còn có tính năng lên lịch cuộc họp tìm thời gian khi mọi người đều thức trong giờ làm việc hợp lý.',
    whenToUse: 'Khi nào nên sử dụng My Time Zone',
    whenToUseDesc: 'My Time Zone hữu ích khi bạn cần phối hợp với người ở các múi giờ khác nhau, lên lịch cuộc họp quốc tế, hoặc đơn giản là muốn biết giờ hiện tại ở các thành phố khác nhau.',
    features: 'Tính năng',
    featuresList: [
      'Timeline thống nhất cho nhiều thành phố',
      'Tìm kiếm thông minh với viết tắt (SF, NYC, HCM)',
      'Lên lịch cuộc họp để tìm thời gian tốt nhất cho mọi người',
      'Hoạt động trên điện thoại và máy tính',
      'Link có thể chia sẻ',
      'Không cần tài khoản',
      'Hoàn toàn miễn phí, không quảng cáo',
    ],
    howItCompares: 'So sánh với các công cụ khác',
    howItComparesDesc: 'Khác với các công cụ timezone khác, MyTimezone tập trung vào sự đơn giản và dễ sử dụng. Không có quảng cáo, không cần đăng ký, và giao diện rõ ràng giúp bạn nhanh chóng xem và chia sẻ múi giờ.',
    howToUse: 'Cách sử dụng',
    howToUseSteps: [
      'Truy cập mytimezone.online',
      'Tìm kiếm và thêm các thành phố',
      'Xem tất cả các múi giờ cùng lúc',
      'Sử dụng "Tìm Giờ Họp" để lên lịch cuộc họp',
      'Chia sẻ link với nhóm của bạn',
    ],
    embed: 'Nhúng vào website của bạn',
    embedDesc: 'Thêm widget timezone trực tiếp vào website, trang Notion, hoặc blog của bạn.',
    getEmbedCode: 'Get Embed Code',
    aboutMe: 'Về tôi',
    aboutMeDesc: 'Tôi là Son Piaz. Tôi tạo các công cụ giải quyết những vấn đề tôi gặp phải. Nếu bạn có phản hồi, hãy sử dụng nút trên trang web.',
    questions: 'Câu hỏi thường gặp',
    questionFree: 'Có miễn phí không?',
    answerFree: 'Có, hoàn toàn miễn phí. Không có gói premium, không có quảng cáo.',
    questionAccurate: 'Độ chính xác như thế nào?',
    answerAccurate: 'Chúng tôi sử dụng dữ liệu timezone chuẩn (IANA) và tự động xử lý daylight saving.',
    questionSave: 'Tôi có thể lưu các thành phố không?',
    answerSave: 'Có. Lựa chọn của bạn được lưu tự động trong trình duyệt.',
    developedBy: 'Sản phẩm này được phát triển bởi',
    backToHome: '← Về Trang Chủ',
  },
  en: {
    title: 'About MyTimezone',
    description: 'MyTimezone helps you easily share your working hours with others. International collaboration without timezone barriers.',
    intro1: 'MyTimezone is a simple tool for displaying international working hours, easy to share — for individuals, teams, or organizations.',
    intro2: 'Designed with a clear interface, flexible customization, and easy embedding, MyTimezone helps you work globally without timezone barriers.',
    whatItDoes: 'What it does',
    whatItDoesDesc1: 'You add cities, and it shows you their local times on one timeline. When it\'s 9am in San Francisco, you can see it\'s 5pm in London and 1am tomorrow in Singapore.',
    whatItDoesDesc2: 'There\'s also a meeting scheduler that finds times when everyone is awake during reasonable hours.',
    whenToUse: 'When to use My Time Zone',
    whenToUseDesc: 'My Time Zone is useful when you need to coordinate with people in different timezones, schedule international meetings, or simply want to know the current time in different cities.',
    features: 'Features',
    featuresList: [
      'Unified timeline view for multiple cities',
      'Smart search with abbreviations (SF, NYC, HCM)',
      'Meeting scheduler to find the best time for everyone',
      'Works on phone and desktop',
      'Shareable links',
      'No account needed',
      'Completely free, no ads',
    ],
    howItCompares: 'How it compares',
    howItComparesDesc: 'Unlike other timezone tools, MyTimezone focuses on simplicity and ease of use. No ads, no signup required, and a clear interface that helps you quickly view and share timezones.',
    howToUse: 'How to use',
    howToUseSteps: [
      'Go to mytimezone.online',
      'Search and add cities',
      'See all times at a glance',
      'Use "Find Best Time" to schedule meetings',
      'Share the link with your team',
    ],
    embed: 'Embed on your website',
    embedDesc: 'Add a live timezone widget to your website, Notion page, or blog.',
    getEmbedCode: 'Get Embed Code',
    aboutMe: 'About me',
    aboutMeDesc: 'I\'m Son Piaz. I make tools that solve problems I have. If you have feedback, use the button on the site.',
    questions: 'Questions',
    questionFree: 'Is it free?',
    answerFree: 'Yes, completely free. No premium tier, no ads.',
    questionAccurate: 'How accurate is it?',
    answerAccurate: 'We use standard timezone data (IANA) and handle daylight saving automatically.',
    questionSave: 'Can I save my cities?',
    answerSave: 'Yes. Your selection saves automatically in your browser.',
    developedBy: 'This product is developed by',
    backToHome: '← Back to Home',
  },
};

export const AboutPage = () => {
  const { language } = useTranslation();
  const content = aboutContent[language];

  // Debug: Log when AboutPage renders
  useEffect(() => {
    console.log('=== ABOUT PAGE RENDERED ===');
    console.log('AboutPage pathname:', window.location.pathname);
  }, []);
  
  // Update document title and meta tags for SEO
  useEffect(() => {
    document.title = `About − MyTimezone`;
    
    // Update meta description based on language
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDescription) {
      metaDescription.setAttribute('content', content.description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = content.description;
      document.head.appendChild(metaDescription);
    }

    // Update OG tags
    const updateOrCreateMeta = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    updateOrCreateMeta('og:title', 'About − MyTimezone', true);
    updateOrCreateMeta('og:description', content.description, true);
    updateOrCreateMeta('og:type', 'website', true);
    updateOrCreateMeta('og:url', 'https://mytimezone.online/about', true);
    updateOrCreateMeta('og:image', 'https://mytimezone.online/og-image.svg', true);
    updateOrCreateMeta('twitter:card', 'summary_large_image');
    updateOrCreateMeta('twitter:title', 'About − MyTimezone');
    updateOrCreateMeta('twitter:description', content.description);
    updateOrCreateMeta('twitter:image', 'https://mytimezone.online/og-image.svg');

    // Remove existing About page schema if exists
    const existingAboutSchema = document.querySelector('script[data-about-schema]');
    if (existingAboutSchema) {
      existingAboutSchema.remove();
    }

    // Add Schema.org JSON-LD for About page
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.setAttribute('data-about-schema', 'true');
    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      mainEntity: {
        '@type': 'WebPage',
        name: 'About − MyTimezone',
        url: 'https://mytimezone.online/about',
        description: content.description,
      },
    });
    document.head.appendChild(schemaScript);
  }, [content.description]);

  return (
    <div className="min-h-screen bg-notion-bg flex flex-col">
      {/* Header - Same as main page */}
      <header className="sticky top-0 bg-white border-b border-notion-border z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl font-semibold text-notion-text">
                My Time Zone
              </h1>
            </a>
            <a
              href="/"
              className="text-sm text-notion-text hover:text-notion-accent transition-colors"
            >
              {content.backToHome}
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <article className="prose prose-lg max-w-none">
          {/* Title */}
          <h1 className="text-[32px] font-semibold text-[#191919] mb-6">
            {content.title}
          </h1>

          {/* Intro */}
          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-4">
            {content.intro1}
          </p>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-12">
            {content.intro2}
          </p>

          {/* What it does */}
          <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
            {content.whatItDoes}
          </h2>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-4">
            {content.whatItDoesDesc1}
          </p>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-12">
            {content.whatItDoesDesc2}
          </p>

          {/* When to use */}
          <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
            {content.whenToUse}
          </h2>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-12">
            {content.whenToUseDesc}
          </p>

          {/* Features */}
          <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
            {content.features}
          </h2>

          <div className="text-base font-normal text-[#37352F] leading-[2] mb-12">
            {content.featuresList.map((feature, index) => (
              <div key={index}>{feature}</div>
            ))}
          </div>

          {/* How it compares */}
          <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
            {content.howItCompares}
          </h2>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-12">
            {content.howItComparesDesc}
          </p>

          {/* How to use */}
          <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
            {content.howToUse}
          </h2>

          <ol className="list-decimal pl-6 text-base font-normal text-[#37352F] leading-relaxed space-y-2 mb-12">
            {content.howToUseSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>

          {/* Embed on your website */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
              {content.embed}
            </h2>
            <p className="text-base font-normal text-[#37352F] leading-relaxed mb-4">
              {content.embedDesc}
            </p>
            <a
              href="/embed"
              className="inline-block mt-4 px-4 py-2 bg-[#191919] text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {content.getEmbedCode}
            </a>
          </section>

          {/* About me */}
          <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
            {content.aboutMe}
          </h2>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-12">
            {content.aboutMeDesc}
          </p>

          {/* Questions */}
          <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
            {content.questions}
          </h2>

          <div className="space-y-6 mb-12">
            <div>
              <div className="text-base font-medium text-[#191919] mt-4">
                {content.questionFree}
              </div>
              <div className="text-base font-normal text-[#6B7280] mt-1">
                {content.answerFree}
              </div>
            </div>

            <div>
              <div className="text-base font-medium text-[#191919] mt-4">
                {content.questionAccurate}
              </div>
              <div className="text-base font-normal text-[#6B7280] mt-1">
                {content.answerAccurate}
              </div>
            </div>

            <div>
              <div className="text-base font-medium text-[#191919] mt-4">
                {content.questionSave}
              </div>
              <div className="text-base font-normal text-[#6B7280] mt-1">
                {content.answerSave}
              </div>
            </div>
          </div>

          {/* Developer credit */}
          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-12">
            {content.developedBy}{' '}
            <a 
              href="https://x.com/sonxpiaz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#2F81F7] hover:underline"
            >
              Son Piaz
            </a>
            .
          </p>
        </article>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
