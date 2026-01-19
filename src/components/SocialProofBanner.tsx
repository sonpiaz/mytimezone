import { useEffect, useState } from 'react';

export function SocialProofBanner() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const sessionKey = 'mtz-counted';
        const today = new Date().toISOString().split('T')[0];
        const alreadyCounted = sessionStorage.getItem(sessionKey) === today;
        
        const response = await fetch('/api/stats', { 
          method: alreadyCounted ? 'GET' : 'POST' 
        });
        
        const data = await response.json();
        setCount(data.today || 0);
        
        if (!alreadyCounted) {
          sessionStorage.setItem(sessionKey, today);
        }
      } catch (error) {
        console.log('Stats API not available');
        setCount(null);
      }
    };
    
    trackVisit();
  }, []);

  // Hide if no data or count too low
  if (count === null || count < 5) return null;

  const displayCount = count < 50 ? `${count}` 
    : count < 100 ? '50+' 
    : count < 500 ? '100+' 
    : '500+';

  return (
    <div className="flex items-center justify-center gap-2 py-2 text-sm text-gray-500">
      <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span>{displayCount} people used this today</span>
    </div>
  );
}

export default SocialProofBanner;
