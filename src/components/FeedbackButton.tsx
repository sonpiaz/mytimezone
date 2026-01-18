interface FeedbackButtonProps {
  t: (key: string) => string;
}

// Declare Tally type for TypeScript
declare global {
  interface Window {
    Tally?: {
      openPopup: (formId: string, options?: { width?: number; autoClose?: number }) => void;
    };
  }
}

export const FeedbackButton = ({ t }: FeedbackButtonProps) => {
  // Tally form ID: https://tally.so/r/2EAzEp
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
    <button
      onClick={openFeedback}
      className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 bg-white border border-notion-border rounded-full text-sm font-medium text-notion-text shadow-notion-md hover:shadow-notion-lg hover:border-notion-textPlaceholder transition-notion z-50"
      aria-label={t('feedback')}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <span className="hidden sm:inline">{t('feedback')}</span>
    </button>
  );
};
