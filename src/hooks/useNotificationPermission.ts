'use client';

import { useState, useEffect, useCallback } from 'react';
import { subscribeToPush } from '@/lib/notifications';

type PermissionState = NotificationPermission | 'unsupported';

export function useNotificationPermission() {
  const [permission, setPermission] = useState<PermissionState>('default');

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async (): Promise<PermissionState> => {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') {
      setPermission('granted');
      // Ensure push subscription is active
      subscribeToPush();
      return 'granted';
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      subscribeToPush();
    }
    return result;
  }, []);

  return {
    permission,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
    isDefault: permission === 'default',
    isSupported: permission !== 'unsupported',
    requestPermission,
  };
}
