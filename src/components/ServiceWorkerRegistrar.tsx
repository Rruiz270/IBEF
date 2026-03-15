'use client';

import { useEffect } from 'react';
import { subscribeToPush } from '@/lib/notifications';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        // Check for SW updates periodically (every 60 minutes)
        interval = setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000);
      })
      .catch((err) => {
        console.warn('SW registration failed:', err);
      });

    // Wait for SW to be fully active before subscribing to push
    navigator.serviceWorker.ready.then(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        subscribeToPush();
      }
    });

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return null;
}
