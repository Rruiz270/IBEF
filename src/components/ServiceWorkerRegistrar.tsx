'use client';

import { useEffect } from 'react';
import { subscribeToPush } from '@/lib/notifications';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        // Check for SW updates periodically (every 60 minutes)
        const interval = setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000);

        // Auto-subscribe to push if permission is already granted
        if ('Notification' in window && Notification.permission === 'granted') {
          subscribeToPush();
        }

        return () => clearInterval(interval);
      })
      .catch((err) => {
        console.warn('SW registration failed:', err);
      });
  }, []);

  return null;
}
