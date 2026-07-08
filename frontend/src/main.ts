import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

function blockBrowserZoom(): void {
  let lastTouchEnd = 0;

  document.addEventListener('gesturestart', event => event.preventDefault());
  document.addEventListener('gesturechange', event => event.preventDefault());
  document.addEventListener('gestureend', event => event.preventDefault());

  document.addEventListener('touchmove', event => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchend', event => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  document.addEventListener('wheel', event => {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }, { passive: false });
}

async function clearLocalPwaCache(): Promise<void> {
  if (!isLocalhost || !('serviceWorker' in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map(registration => registration.unregister()));

  if ('caches' in globalThis) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
  }
}

blockBrowserZoom();

clearLocalPwaCache()
  .finally(() => bootstrapApplication(App, appConfig))
  .catch((err) => console.error(err));
