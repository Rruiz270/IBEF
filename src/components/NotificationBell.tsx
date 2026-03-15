'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Clock,
  Info,
  CheckCircle2,
  CheckCheck,
} from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import type { Notification } from '@/contexts/ProjectContext';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const typeConfig: Record<
  Notification['type'],
  { color: string; bg: string; border: string; icon: React.ElementType }
> = {
  overdue: {
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
    icon: AlertCircle,
  },
  critical: {
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
    icon: AlertTriangle,
  },
  deadline: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    icon: Clock,
  },
  info: {
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-500/30',
    icon: Info,
  },
};

function timeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay}d atr\u00e1s`;
  if (diffHour > 0) return `${diffHour}h atr\u00e1s`;
  if (diffMin > 0) return `${diffMin}min atr\u00e1s`;
  return 'agora';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationBell() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
  } = useProject();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sort notifications: unread first, then by timestamp descending
  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort((a, b) => {
        if (a.read !== b.read) return a.read ? 1 : -1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }),
    [notifications],
  );

  function handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        aria-label="Notifica\u00e7\u00f5es"
      >
        <Bell size={20} />

        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-80 max-h-[420px] flex flex-col rounded-xl border border-white/10 bg-[#0A2463] shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">
                Notifica\u00e7\u00f5es
              </h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-medium text-white/40">
                  {unreadCount} n\u00e3o lida{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Notification list */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {sortedNotifications.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#00E5A0]/10 mb-3">
                    <CheckCircle2 size={24} className="text-[#00E5A0]" />
                  </div>
                  <p className="text-sm text-white/50 font-medium">
                    Sem notifica\u00e7\u00f5es
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    Tudo em dia!
                  </p>
                </div>
              ) : (
                sortedNotifications.map((notification) => {
                  const cfg = typeConfig[notification.type];
                  const Icon = cfg.icon;

                  return (
                    <motion.button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                      className={`
                        w-full text-left px-4 py-3 flex gap-3 border-b border-white/5 transition-colors
                        ${notification.read ? 'opacity-50' : ''}
                      `}
                    >
                      {/* Icon */}
                      <div
                        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${cfg.bg}`}
                      >
                        <Icon size={16} className={cfg.color} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-xs font-semibold leading-snug ${
                              notification.read ? 'text-white/50' : 'text-white'
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="shrink-0 mt-1 w-2 h-2 rounded-full bg-[#00B4D8]" />
                          )}
                        </div>
                        <p className="text-[11px] text-white/40 leading-snug mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-white/25 mt-1">
                          {timeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* Footer: mark all as read */}
            {sortedNotifications.length > 0 && unreadCount > 0 && (
              <div className="px-4 py-2.5 border-t border-white/10">
                <button
                  onClick={() => markAllNotificationsRead()}
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs font-medium text-[#00B4D8] hover:bg-[#00B4D8]/10 transition-colors"
                >
                  <CheckCheck size={14} />
                  Marcar todas como lidas
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
