'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ListChecks,
  UserPlus,
  Building2,
  User,
  Network,
  Clock,
  Plus,
  Pencil,
  Trash2,
  ArrowRightLeft,
  ArrowRight,
} from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import type { ActivityLogEntry } from '@/data/types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ActivityLogProps {
  /** Maximum number of entries to display. Defaults to all. */
  maxEntries?: number;
  /** Compact mode shows less detail per entry. */
  compact?: boolean;
}

// ---------------------------------------------------------------------------
// Config maps
// ---------------------------------------------------------------------------

const entityTypeIcons: Record<ActivityLogEntry['entityType'], React.ElementType> = {
  task: ListChecks,
  hiring: UserPlus,
  company: Building2,
  person: User,
  orgchart: Network,
};

const entityTypeLabels: Record<ActivityLogEntry['entityType'], string> = {
  task: 'Tarefa',
  hiring: 'Contratacao',
  company: 'Empresa',
  person: 'Pessoa',
  orgchart: 'Organograma',
};

const actionConfig: Record<
  ActivityLogEntry['action'],
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  created: {
    label: 'criou',
    color: 'text-[#00E5A0]',
    bg: 'bg-[#00E5A0]/15',
    icon: Plus,
  },
  updated: {
    label: 'atualizou',
    color: 'text-[#00B4D8]',
    bg: 'bg-[#00B4D8]/15',
    icon: Pencil,
  },
  deleted: {
    label: 'excluiu',
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    icon: Trash2,
  },
  status_changed: {
    label: 'alterou status de',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    icon: ArrowRightLeft,
  },
};

// ---------------------------------------------------------------------------
// Time-ago helper (Portuguese)
// ---------------------------------------------------------------------------

function timeAgo(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = Math.max(0, now - then);

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return 'agora mesmo';
  if (minutes === 1) return 'ha 1 minuto';
  if (minutes < 60) return `ha ${minutes} minutos`;
  if (hours === 1) return 'ha 1 hora';
  if (hours < 24) return `ha ${hours} horas`;
  if (days === 1) return 'ha 1 dia';
  if (days < 7) return `ha ${days} dias`;
  if (weeks === 1) return 'ha 1 semana';
  if (weeks < 5) return `ha ${weeks} semanas`;
  if (months === 1) return 'ha 1 mes';
  return `ha ${months} meses`;
}

// ---------------------------------------------------------------------------
// Single entry component
// ---------------------------------------------------------------------------

function ActivityEntry({
  entry,
  compact,
}: {
  entry: ActivityLogEntry;
  compact: boolean;
}) {
  const action = actionConfig[entry.action];
  const ActionIcon = action.icon;
  const EntityIcon = entityTypeIcons[entry.entityType];
  const entityLabel = entityTypeLabels[entry.entityType];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2 }}
      className={`
        group flex items-start gap-3
        ${compact ? 'py-2' : 'py-3'}
        border-b border-white/5 last:border-b-0
      `}
    >
      {/* Action icon */}
      <div
        className={`
          shrink-0 flex items-center justify-center rounded-lg
          ${compact ? 'w-7 h-7' : 'w-8 h-8'}
          ${action.bg}
        `}
      >
        <ActionIcon size={compact ? 12 : 14} className={action.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Main line */}
        <p className={`leading-snug ${compact ? 'text-xs' : 'text-sm'}`}>
          <span className={`font-medium ${action.color}`}>
            {action.label}
          </span>
          {' '}
          <span className="text-white font-semibold truncate">
            {entry.entityTitle}
          </span>
        </p>

        {/* Entity type badge + field info (not in compact) */}
        {!compact && (
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-white/40 font-medium">
              <EntityIcon size={10} />
              {entityLabel}
            </span>

            {entry.field && entry.action === 'updated' && (
              <span className="text-[10px] text-white/30">
                campo: <span className="text-white/50">{entry.field}</span>
              </span>
            )}
          </div>
        )}

        {/* Status change: old -> new */}
        {entry.action === 'status_changed' && entry.oldValue && entry.newValue && (
          <div
            className={`
              flex items-center gap-1.5 mt-1.5
              ${compact ? 'text-[10px]' : 'text-xs'}
            `}
          >
            <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/50 font-medium">
              {entry.oldValue}
            </span>
            <ArrowRight size={10} className="text-white/20 shrink-0" />
            <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-medium">
              {entry.newValue}
            </span>
          </div>
        )}

        {/* Field change values (non-status updates, not in compact) */}
        {!compact &&
          entry.action === 'updated' &&
          entry.oldValue &&
          entry.newValue && (
            <div className="flex items-center gap-1.5 mt-1.5 text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/40 max-w-[120px] truncate">
                {entry.oldValue}
              </span>
              <ArrowRight size={10} className="text-white/20 shrink-0" />
              <span className="px-1.5 py-0.5 rounded bg-[#00B4D8]/10 text-[#00B4D8] max-w-[120px] truncate">
                {entry.newValue}
              </span>
            </div>
          )}
      </div>

      {/* Timestamp */}
      <span
        className={`
          shrink-0 text-white/25
          ${compact ? 'text-[10px]' : 'text-[11px]'}
        `}
      >
        {timeAgo(entry.timestamp)}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ActivityLog({ maxEntries, compact = false }: ActivityLogProps) {
  const { activityLog } = useProject();

  const entries = useMemo(() => {
    if (maxEntries != null && maxEntries > 0) {
      return activityLog.slice(0, maxEntries);
    }
    return activityLog;
  }, [activityLog, maxEntries]);

  return (
    <div
      className={`
        rounded-2xl border border-white/5 bg-[#0A2463]/60
        ${compact ? 'p-3' : 'p-5'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00B4D8]/15 flex items-center justify-center">
            <Clock size={14} className="text-[#00B4D8]" />
          </div>
          <div>
            <h3 className={`font-bold text-white ${compact ? 'text-sm' : 'text-base'}`}>
              Registro de Atividades
            </h3>
            {!compact && (
              <p className="text-[11px] text-white/40">
                {activityLog.length}{' '}
                {activityLog.length === 1 ? 'atividade' : 'atividades'} registradas
              </p>
            )}
          </div>
        </div>

        {maxEntries != null && activityLog.length > maxEntries && (
          <span className="text-[10px] text-white/30 px-2 py-0.5 rounded-full bg-white/5">
            {maxEntries} de {activityLog.length}
          </span>
        )}
      </div>

      {/* Entries list */}
      {entries.length > 0 ? (
        <div
          className={`
            overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10
            ${compact ? 'max-h-[280px]' : 'max-h-[420px]'}
            ${compact ? '-mx-3 px-3' : '-mx-5 px-5'}
          `}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {entries.map((entry) => (
              <ActivityEntry
                key={entry.id}
                entry={entry}
                compact={compact}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
            <Clock size={20} className="text-white/20" />
          </div>
          <p className="text-sm text-white/30 font-medium">
            Nenhuma atividade registrada
          </p>
          <p className="text-[11px] text-white/15 mt-1">
            As alteracoes no projeto aparecao aqui
          </p>
        </div>
      )}
    </div>
  );
}
