import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

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

clearLocalPwaCache()
  .finally(() => bootstrapApplication(App, appConfig))
  .catch((err) => console.error(err));
