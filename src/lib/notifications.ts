/**
 * Browser notification wrapper that sends notifications through the Service Worker.
 * Using SW.postMessage ensures notifications work even when the tab is not focused.
 *
 * Also handles Web Push subscription (subscribe/unsubscribe) so that
 * notifications arrive even when the app is completely closed.
 */

export interface BrowserNotificationPayload {
  title: string;
  body: string;
  url?: string;
}

// Key used in localStorage to persist the push endpoint for senderEndpoint filtering
const PUSH_ENDPOINT_KEY = 'i10-push-endpoint';

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

// ---------------------------------------------------------------------------
// Web Push subscription helpers
// ---------------------------------------------------------------------------

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Subscribe the current browser to Web Push via the Service Worker's pushManager.
 * Sends the subscription to `/api/push/subscribe`.
 * Returns the endpoint string (used as senderEndpoint) or null on failure.
 */
export async function subscribeToPush(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    console.warn('[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY not set');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    console.log('[push] SW ready, checking existing subscription...');

    // Check for existing subscription first
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log('[push] No existing subscription, creating new one...');
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
      });
    }

    const subJSON = subscription.toJSON();
    const endpoint = subJSON.endpoint!;
    const keys = subJSON.keys as { p256dh: string; auth: string };

    console.log('[push] Subscription endpoint:', endpoint.substring(0, 60) + '...');

    // Send to server
    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint, keys }),
    });

    if (!res.ok) {
      console.error('[push] Server rejected subscription:', res.status, await res.text());
      return null;
    }

    console.log('[push] Subscription saved to server');

    // Persist endpoint for senderEndpoint filtering
    localStorage.setItem(PUSH_ENDPOINT_KEY, endpoint);

    return endpoint;
  } catch (err) {
    console.error('[push] subscribeToPush failed:', err);
    return null;
  }
}

/**
 * Unsubscribe from Web Push and remove the subscription from the server.
 */
export async function unsubscribeFromPush(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const endpoint = subscription.endpoint;

      await subscription.unsubscribe();

      await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint }),
      });
    }

    localStorage.removeItem(PUSH_ENDPOINT_KEY);
  } catch (err) {
    console.error('[push] unsubscribeFromPush failed:', err);
  }
}

/**
 * Get the current push endpoint from localStorage (used as senderEndpoint in sync).
 */
export function getPushEndpoint(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PUSH_ENDPOINT_KEY);
}
