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
  // Replace 'YOUR_FORM_ID' with your actual Tally form ID
  const TALLY_FORM_ID = 'YOUR_FORM_ID';

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
      className="fixed bottom-6 right-6 bg-apple-green text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition-apple flex items-center gap-2 z-50"
      aria-label={t('feedback')}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
      </svg>
      <span className="hidden sm:inline">{t('feedback')}</span>
    </button>
  );
};
