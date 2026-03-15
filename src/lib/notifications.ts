/**
 * Browser notification wrapper that sends notifications through the Service Worker.
 * Using SW.postMessage ensures notifications work even when the tab is not focused.
 */

export interface BrowserNotificationPayload {
  title: string;
  body: string;
  url?: string;
}

/**
 * Show a browser notification via the active Service Worker.
 * Falls back to the Notification API if SW is unavailable.
 * Does nothing if permission is not granted.
 */
export async function showBrowserNotification(payload: BrowserNotificationPayload): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const { title, body, url } = payload;

  // Prefer SW-based notification (works when tab is not focused)
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      registration.active.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        body,
        url: url || '/dashboard',
      });
      return;
    }
  }

  // Fallback: direct Notification API
  new Notification(title, {
    body,
    icon: '/icons/icon-192x192.png',
  });
}
