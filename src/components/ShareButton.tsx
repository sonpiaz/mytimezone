import { useState } from 'react';

interface ShareButtonProps {
  t: (key: string) => string;
}

export const ShareButton = ({ t }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      // Try native share API first (mobile)
      if (navigator.share) {
        await navigator.share({
          title: 'My TimeZone',
          text: 'Xem múi giờ thế giới',
          url: url,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // Fallback to clipboard if share fails
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (clipboardError) {
        console.error('Failed to copy:', clipboardError);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-2.5 py-1.5 text-sm bg-transparent text-[#37352F] hover:bg-[rgba(55,53,47,0.08)] rounded transition-colors font-normal flex items-center gap-1.5"
      title={copied ? t('copied') : t('shareView') || 'Share View'}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
        />
      </svg>
      <span className="hidden sm:inline">{copied ? t('copied') : t('shareView') || 'Share'}</span>
    </button>
  );
};
