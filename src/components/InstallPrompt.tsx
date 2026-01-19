import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check nếu đã dismiss trước đó - không hiện nữa
    const wasDismissed = localStorage.getItem('mytimezone_install_dismissed');
    if (wasDismissed === 'true') {
      return; // Không hiện nữa nếu đã dismiss
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Chỉ hiện prompt nếu đã visit ít nhất 1 lần trước đó (lần 2 trở đi)
      const visitCount = parseInt(localStorage.getItem('mytimezone_visit_count') || '0', 10);
      
      if (visitCount >= 1) {
        // Delay 3 giây trước khi hiện prompt để không làm phiền user ngay
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
      
      // Tăng visit count
      localStorage.setItem('mytimezone_visit_count', String(visitCount + 1));
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Nếu là lần đầu, chỉ ghi nhận visit (không hiện prompt)
    const visitCount = parseInt(localStorage.getItem('mytimezone_visit_count') || '0', 10);
    if (visitCount === 0) {
      localStorage.setItem('mytimezone_visit_count', '1');
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      if (import.meta.env.DEV) {
        console.log('User accepted install');
      }
    }
    
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('mytimezone_install_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-white border border-[#E9E9E7] rounded-lg shadow-lg p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#F7F7F5] flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🌍</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#191919] mb-1">Install My Time Zone</h3>
          <p className="text-xs text-[#6B7280]">Add to home screen for quick access</p>
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
          Not now
        </button>
        <button
          onClick={handleInstall}
          className="flex-1 py-2 text-xs font-medium bg-[#191919] text-white hover:bg-[#333333] rounded-md transition-colors"
        >
          Install
        </button>
      </div>
    </div>
  );
};
