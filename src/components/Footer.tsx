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
    console.log('=== ABOUT CLICK DEBUG ===');
    console.log('1. Event target:', e.target);
    console.log('2. Event currentTarget:', e.currentTarget);
    console.log('3. Event type:', e.type);
    console.log('4. Default prevented before:', e.defaultPrevented);
    console.log('5. Event bubbles:', e.bubbles);
    console.log('6. Event cancelable:', e.cancelable);
    
    e.preventDefault();
    e.stopPropagation();
    
    console.log('7. Default prevented after:', e.defaultPrevented);
    console.log('8. Current pathname:', window.location.pathname);
    console.log('9. Calling navigate("/about")...');
    
    try {
      navigate('/about');
      console.log('10. navigate() called successfully');
    } catch (error) {
      console.error('11. Error calling navigate:', error);
    }
    
    // Check pathname after a short delay to see if navigation happened
    setTimeout(() => {
      console.log('12. After navigate - pathname:', window.location.pathname);
      console.log('13. After navigate - href:', window.location.href);
      console.log('=== END DEBUG ===');
    }, 100);
  };
  
  // Also add onMouseDown handler to catch events before DndContext
  const handleAboutMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('=== ABOUT MOUSEDOWN DEBUG ===');
    console.log('MouseDown event fired on About button');
    e.stopPropagation(); // Stop propagation before DndContext can catch it
  };

  return (
    <footer className="bg-[#FAFAFA] border-t border-[#F3F4F6] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Links */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onMouseDown={handleAboutMouseDown}
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
