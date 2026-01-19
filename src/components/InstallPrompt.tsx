import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// LocalStorage keys
const VISIT_COUNT_KEY = 'pwa_visit_count';
const NEXT_PROMPT_VISIT_KEY = 'pwa_next_prompt_visit';
const INSTALLED_KEY = 'pwa_installed';

// Helper: Get next Fibonacci number after current
const getNextFibonacci = (current: number): number => {
  const fibs = [3, 5, 8, 13, 21, 34, 55, 89, 144, 233];
  const next = fibs.find(f => f > current);
  return next || fibs[fibs.length - 1] + current; // fallback for very high numbers
};

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (localStorage.getItem(INSTALLED_KEY) === 'true') {
      return;
    }

    // Increment visit count
    const visitCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10) + 1;
    localStorage.setItem(VISIT_COUNT_KEY, visitCount.toString());

    // Get next prompt visit (default to 3 - first Fibonacci number in sequence)
    const nextPromptVisit = parseInt(localStorage.getItem(NEXT_PROMPT_VISIT_KEY) || '3', 10);

    console.log('=== INSTALL PROMPT DEBUG ===');
    console.log('Visit count:', visitCount);
    console.log('Next prompt visit:', nextPromptVisit);

    // Check if should show prompt
    if (visitCount >= nextPromptVisit) {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        
        // Delay 3 giây trước khi hiện prompt để không làm phiền user ngay
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      };

      window.addEventListener('beforeinstallprompt', handler);
      
      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  // Debug helpers (remove in production)
  useEffect(() => {
    // @ts-ignore
    window.resetPWAPrompt = () => {
      localStorage.removeItem(VISIT_COUNT_KEY);
      localStorage.removeItem(NEXT_PROMPT_VISIT_KEY);
      localStorage.removeItem(INSTALLED_KEY);
      console.log('PWA prompt reset. Refresh the page.');
    };
    
    // @ts-ignore
    window.simulateVisits = (count: number) => {
      localStorage.setItem(VISIT_COUNT_KEY, count.toString());
      console.log('Visit count set to:', count, '. Refresh the page.');
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log('Install outcome:', outcome);
    
    if (outcome === 'accepted') {
      localStorage.setItem(INSTALLED_KEY, 'true');
      if (import.meta.env.DEV) {
        console.log('User accepted install');
      }
    }
    
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleNotNow = () => {
    // Get current visit count
    const visitCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
    
    // Calculate next Fibonacci prompt visit
    const nextPromptVisit = getNextFibonacci(visitCount);
    localStorage.setItem(NEXT_PROMPT_VISIT_KEY, nextPromptVisit.toString());
    
    console.log('User clicked "Not now". Next prompt at visit:', nextPromptVisit);
    
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    // Same as "Not now" - dismiss with X button
    handleNotNow();
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-white border border-[#E9E9E7] rounded-lg shadow-lg p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#F7F7F5] flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🌐</span>
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
          onClick={handleNotNow}
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
