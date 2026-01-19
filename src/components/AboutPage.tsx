import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const AboutPage = () => {
  const location = useLocation();
  
  // Update document title and meta tags for SEO
  useEffect(() => {
    document.title = 'About My Time Zone - Free Time Zone Converter & Meeting Scheduler';
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDescription) {
      metaDescription.setAttribute('content', 'My Time Zone is a free, modern tool to view and compare time zones worldwide. Find the best meeting time for your global team. No ads, no limits, no signup required.');
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = 'My Time Zone is a free, modern tool to view and compare time zones worldwide. Find the best meeting time for your global team. No ads, no limits, no signup required.';
      document.head.appendChild(metaDescription);
    }

    // Add Schema.org JSON-LD
    let schemaScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'My Time Zone',
        url: 'https://mytimezone.online',
        description: 'Free time zone converter and meeting scheduler for global teams',
        applicationCategory: 'Productivity',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Person',
          name: 'Son Piaz',
        },
      });
      document.head.appendChild(schemaScript);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-notion-bg">
      {/* Header - Same as main page */}
      <header className="sticky top-0 bg-white border-b border-notion-border z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-semibold text-notion-text">
                My Time Zone
              </h1>
            </Link>
            <Link
              to="/"
              className="text-sm text-notion-text hover:text-notion-accent transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <article className="prose prose-lg max-w-none">
          {/* Title */}
          <h1 className="text-[32px] font-semibold text-[#191919] mb-6">
            About
          </h1>

          {/* Intro */}
          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-4">
            My Time Zone is a simple tool for comparing time zones across cities.
          </p>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-4">
            I built this because I work with people in different countries and got tired of doing timezone math in my head. Most tools I found were either full of ads or too complicated for what I needed.
          </p>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-12">
            So I made something simple.
          </p>

          {/* What it does */}
          <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
            What it does
          </h2>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-4">
            You add cities, and it shows you their local times on one timeline. When it's 9am in San Francisco, you can see it's 5pm in London and 1am tomorrow in Singapore.
          </p>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-12">
            There's also a meeting scheduler that finds times when everyone is awake during reasonable hours.
          </p>

          {/* Features */}
          <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
            Features
          </h2>

          <div className="text-base font-normal text-[#37352F] leading-[2] mb-12">
            <div>Unified timeline view for multiple cities</div>
            <div>Smart search with abbreviations (SF, NYC, HCM)</div>
            <div>Meeting scheduler to find the best time for everyone</div>
            <div>Works on phone and desktop</div>
            <div>Shareable links</div>
            <div>No account needed</div>
          </div>

          {/* How to use */}
          <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
            How to use
          </h2>

          <ol className="list-decimal pl-6 text-base font-normal text-[#37352F] leading-relaxed space-y-2 mb-12">
            <li>Go to <a href="https://mytimezone.online" className="text-[#2F81F7] hover:underline">mytimezone.online</a></li>
            <li>Search and add cities</li>
            <li>See all times at a glance</li>
            <li>Use "Find Best Time" to schedule meetings</li>
            <li>Share the link with your team</li>
          </ol>

          {/* About me */}
          <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
            About me
          </h2>

          <p className="text-base font-normal text-[#37352F] leading-relaxed mb-12">
            I'm Son Piaz. I make tools that solve problems I have. If you have feedback, use the button on the site.
          </p>

          {/* Questions */}
          <h2 className="text-xl font-semibold text-[#191919] mt-12 mb-4">
            Questions
          </h2>

          <div className="space-y-6 mb-12">
            <div>
              <div className="text-base font-medium text-[#191919] mt-4">
                Is it free?
              </div>
              <div className="text-base font-normal text-[#6B7280] mt-1">
                Yes, completely free. No premium tier, no ads.
              </div>
            </div>

            <div>
              <div className="text-base font-medium text-[#191919] mt-4">
                How accurate is it?
              </div>
              <div className="text-base font-normal text-[#6B7280] mt-1">
                We use standard timezone data (IANA) and handle daylight saving automatically.
              </div>
            </div>

            <div>
              <div className="text-base font-medium text-[#191919] mt-4">
                Can I save my cities?
              </div>
              <div className="text-base font-normal text-[#6B7280] mt-1">
                Yes. Your selection saves automatically in your browser.
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};
