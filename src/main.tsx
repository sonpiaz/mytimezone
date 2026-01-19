import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { UpdateNotification } from './components/UpdateNotification.tsx'

// Create update notification container
const createUpdateNotification = (updateSW: (reloadPage?: boolean) => void) => {
  // Check if notification already exists
  let container = document.getElementById('update-notification-root');
  if (container) {
    return; // Already showing
  }

  container = document.createElement('div');
  container.id = 'update-notification-root';
  document.body.appendChild(container);

  const root = createRoot(container);
  
  const handleUpdate = () => {
    updateSW(true);
    root.unmount();
    container?.remove();
  };
  
  const handleDismiss = () => {
    root.unmount();
    container?.remove();
  };

  root.render(
    <UpdateNotification onUpdate={handleUpdate} onDismiss={handleDismiss} />
  );
};

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    const updateSW = registerSW({
      onNeedRefresh() {
        // Show custom notification instead of confirm()
        createUpdateNotification(updateSW);
      },
      onOfflineReady() {
        if (import.meta.env.DEV) {
          console.log('App ready to work offline');
        }
      },
    });
  }).catch(() => {
    // Ignore if virtual module not available (dev mode)
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
        <Analytics />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
