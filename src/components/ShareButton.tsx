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
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md transition-colors font-normal"
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
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
      <span className="hidden sm:inline">{copied ? t('copied') : t('shareView') || 'Share View'}</span>
    </button>
  );
};
