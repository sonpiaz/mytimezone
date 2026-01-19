import { useTranslation } from '../hooks/useTranslation';

// Declare Tally type for TypeScript
declare global {
  interface Window {
    Tally?: {
      openPopup: (formId: string, options?: { width?: number; autoClose?: number }) => void;
    };
  }
}

interface FooterProps {
  onEmbedClick?: () => void;
}

export const Footer = ({ onEmbedClick }: FooterProps) => {
  const { language, toggleLanguage, t } = useTranslation();
  const TALLY_FORM_ID = '2EAzEp';

  const openFeedback = () => {
    if (window.Tally) {
      window.Tally.openPopup(TALLY_FORM_ID, {
        width: 400,
        autoClose: 3000,
      });
    } else {
      // Fallback: open in new tab if Tally script not loaded
      window.open(`https://tally.so/r/${TALLY_FORM_ID}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className="bg-[#FAFAFA] border-t border-[#F3F4F6] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Links + Language */}
          <div className="flex items-center gap-4 text-sm">
            <a
              href="/about"
              className="text-[#6B7280] hover:text-[#374151] transition-colors"
              title="About My Time Zone"
            >
              About
            </a>
            <span className="text-[#D1D5DB]">·</span>
            <button
              onClick={openFeedback}
              className="text-[#6B7280] hover:text-[#374151] transition-colors"
              title="Send feedback"
            >
              Feedback
            </button>
            <span className="text-[#D1D5DB]">·</span>
            <button
              onClick={onEmbedClick}
              className="text-[#6B7280] hover:text-[#374151] transition-colors"
              title="Get embed code for your website"
            >
              Embed
            </button>
            <span className="text-[#D1D5DB]">·</span>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-[#6B7280] hover:text-[#374151] transition-colors"
              aria-label={t('language')}
              title="Switch language"
            >
              <span className="text-base">🌐</span>
              <span>{language === 'vi' ? 'VI' : 'EN'}</span>
            </button>
          </div>

          {/* Right: Copyright */}
          <div className="text-sm text-[#9CA3AF]">
            Made by{' '}
            <a
              href="https://x.com/sonxpiaz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6B7280] hover:text-[#374151] hover:underline transition-colors"
            >
              Son Piaz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
