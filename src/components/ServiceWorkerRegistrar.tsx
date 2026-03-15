'use client';

import { useEffect, useCallback } from 'react';
import { subscribeToPush, getPushEndpoint } from '@/lib/notifications';

export default function ServiceWorkerRegistrar() {
  // Subscribe to push on first user interaction (iOS requires user gesture)
  const handleUserGesture = useCallback(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    // Only subscribe if not already subscribed
    if (getPushEndpoint()) return;

    navigator.serviceWorker.ready.then(() => {
      subscribeToPush();
    });

    // Remove listeners after first successful trigger
    document.removeEventListener('click', handleUserGesture);
    document.removeEventListener('touchstart', handleUserGesture);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        interval = setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000);
      })
      .catch((err) => {
        console.warn('SW registration failed:', err);
      });

    // Try automatic subscription first (works on desktop Chrome)
    navigator.serviceWorker.ready.then(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        if (!getPushEndpoint()) {
          subscribeToPush().then((endpoint) => {
            if (!endpoint) {
              // Automatic failed (likely iOS) — wait for user gesture
              document.addEventListener('click', handleUserGesture, { once: true });
              document.addEventListener('touchstart', handleUserGesture, { once: true });
            }
          });
        }
      }
    });

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('click', handleUserGesture);
      document.removeEventListener('touchstart', handleUserGesture);
    };
  }, [handleUserGesture]);

  return null;
}
