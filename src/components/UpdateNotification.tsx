import { useState, useEffect } from 'react';

interface UpdateNotificationProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

export const UpdateNotification = ({ onUpdate, onDismiss }: UpdateNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation
  };

  const handleUpdate = () => {
    setIsVisible(false);
    setTimeout(() => {
      onUpdate();
    }, 300); // Wait for animation before updating
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-white border border-[#E9E9E7] rounded-lg shadow-lg p-4 max-w-sm transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#F7F7F5] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-[#37352F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#191919] mb-1">Update available</h3>
          <p className="text-xs text-[#6B7280]">A new version is ready to install</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-[#9B9A97] hover:text-[#37352F] transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleDismiss}
          className="flex-1 py-2 text-xs font-medium text-[#6B7280] hover:bg-[#F7F7F5] rounded-md transition-colors"
        >
          Later
        </button>
        <button
          onClick={handleUpdate}
          className="flex-1 py-2 text-xs font-medium bg-[#191919] text-white hover:bg-[#333333] rounded-md transition-colors"
        >
          Update now
        </button>
      </div>
    </div>
  );
};
