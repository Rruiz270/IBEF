'use client';

import { useProject } from '@/contexts/ProjectContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudOff, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function SyncIndicator({ collapsed }: { collapsed: boolean }) {
  const { syncStatus, triggerFullSync } = useProject();

  const config = {
    synced: {
      icon: Cloud,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/20',
      label: 'Sincronizado',
    },
    syncing: {
      icon: Loader2,
      color: 'text-[#00B4D8]',
      bg: 'bg-[#00B4D8]/10',
      border: 'border-[#00B4D8]/20',
      label: 'Sincronizando...',
    },
    offline: {
      icon: CloudOff,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
      label: 'Offline',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/20',
      label: 'Erro de sync',
    },
  };

  const c = config[syncStatus];
  const Icon = c.icon;

  return (
    <div className="relative group">
      <button
        onClick={triggerFullSync}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${c.bg} border ${c.border} w-full transition-colors hover:brightness-125 cursor-pointer`}
        title={collapsed ? c.label : undefined}
      >
        <motion.div
          animate={syncStatus === 'syncing' ? { rotate: 360 } : {}}
          transition={syncStatus === 'syncing' ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}
        >
          <Icon size={16} className={`shrink-0 ${c.color}`} />
        </motion.div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
            >
              <span className={`text-xs font-medium ${c.color}`}>{c.label}</span>
              {syncStatus !== 'syncing' && (
                <RefreshCw size={12} className="text-white/30 hover:text-white/60 transition-colors" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Tooltip on collapsed */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-[#061742] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-white/10">
          {c.label}
        </div>
      )}
    </div>
  );
}
