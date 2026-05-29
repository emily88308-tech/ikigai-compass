// Registers the service worker so the app is installable as a PWA.
// Only runs in production builds (dev uses Vite's HMR, which a SW would fight).
export function registerSW() {
  if (!import.meta.env.PROD) return;
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('Service worker registration failed:', err);
    });
  });
}
