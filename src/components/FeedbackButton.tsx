interface FeedbackButtonProps {
  t: (key: string) => string;
}

export const FeedbackButton = ({ t }: FeedbackButtonProps) => {
  // Replace with your Tally form URL
  const TALLY_FORM_URL = 'https://tally.so/r/YOUR_FORM_ID';

  return (
    <a
      href={TALLY_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-apple-green text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition-apple flex items-center gap-2 z-50"
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
    </a>
  );
};
