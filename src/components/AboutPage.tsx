import { useEffect } from 'react';
import { Footer } from './Footer';

export const AboutPage = () => {
  // Debug: Log when AboutPage renders
  useEffect(() => {
    console.log('=== ABOUT PAGE RENDERED ===');
    console.log('AboutPage pathname:', window.location.pathname);
  }, []);
  
  // Update document title and meta tags for SEO
  useEffect(() => {
    document.title = 'About − MyTimezone';
    
    // Update meta description
    const description = 'MyTimezone giúp bạn chia sẻ khung giờ làm việc của mình với người khác dễ dàng. Kết nối phối hợp quốc tế không còn rào cản.';
    
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = description;
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
    updateOrCreateMeta('og:description', description, true);
    updateOrCreateMeta('og:type', 'website', true);
    updateOrCreateMeta('og:url', 'https://mytimezone.online/about', true);
    updateOrCreateMeta('og:image', 'https://mytimezone.online/og-image.svg', true);
    updateOrCreateMeta('twitter:card', 'summary_large_image');
    updateOrCreateMeta('twitter:title', 'About − MyTimezone');
    updateOrCreateMeta('twitter:description', description);
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
        description: description,
      },
    });
    document.head.appendChild(schemaScript);
  }, []);

  return (
    <div className="min-h-screen bg-notion-bg flex flex-col">
      {/* Header - Same as main page */}
      <header className="sticky top-0 bg-white border-b border-notion-border z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => { window.location.href = '/'; }}
              className="hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl font-semibold text-notion-text">
                My Time Zone
              </h1>
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="text-sm text-notion-text hover:text-notion-accent transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <article className="prose prose-lg max-w-none">
          {/* Title */}
          <h1 className="text-[32px] font-semibold text-[#191919] mb-6">
            Về MyTimezone
          </h1>

          {/* Intro */}
          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-4">
            MyTimezone là công cụ đơn giản giúp bạn hiển thị khung giờ làm việc quốc tế, dễ dàng chia sẻ ‒ cho cá nhân, nhóm hay tổ chức.
          </p>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-12">
            Được thiết kế với giao diện rõ ràng, linh hoạt trong tùy chỉnh và dễ dàng nhúng, MyTimezone hỗ trợ bạn làm việc toàn cầu mà không gặp rào cản về múi giờ.
          </p>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-12">
            Sản phẩm này được phát triển bởi{' '}
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

          {/* Get Embed Code Button */}
          <div className="mb-12">
            <a
              href="/?openEmbed=true"
              className="inline-block px-4 py-2 bg-[#191919] text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Get Embed Code
            </a>
          </div>
        </article>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
