import { useNavigate } from 'react-router-dom';

// Declare Tally type for TypeScript
declare global {
  interface Window {
    Tally?: {
      openPopup: (formId: string, options?: { width?: number; autoClose?: number }) => void;
    };
  }
}

export const Footer = () => {
  const navigate = useNavigate();
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

  const handleAboutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/about');
  };

  return (
    <footer className="bg-[#FAFAFA] border-t border-[#F3F4F6] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Links */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={handleAboutClick}
              className="text-[#6B7280] hover:text-[#374151] transition-colors cursor-pointer"
            >
              About
            </button>
            <span className="text-[#D1D5DB]">·</span>
            <button
              onClick={openFeedback}
              className="text-[#6B7280] hover:text-[#374151] transition-colors"
            >
              Feedback
            </button>
          </div>

          {/* Right: Copyright */}
          <div className="text-sm text-[#9CA3AF]">
            Made by <span className="text-[#6B7280]">Son Piaz</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
