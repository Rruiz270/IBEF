'use client';

import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, GripVertical, Tag } from 'lucide-react';
import type { Task, TaskStatus } from '@/data/types';

const KANBAN_STATUSES: { key: TaskStatus; color: string }[] = [
  { key: 'nao_iniciada', color: '#6B7280' },
  { key: 'em_andamento', color: '#00B4D8' },
  { key: 'bloqueada', color: '#F59E0B' },
  { key: 'atrasada', color: '#EF4444' },
  { key: 'concluida', color: '#10B981' },
];

const PRIORITY_COLORS: Record<string, string> = {
  critica: '#EF4444',
  alta: '#F59E0B',
  media: '#3B82F6',
  baixa: '#6B7280',
};

const DEPARTMENT_COLORS: Record<string, string> = {
  juridico: '#6366F1',
  tecnologia: '#10B981',
  relacoes_publicas: '#F59E0B',
  operacoes_locais: '#EF4444',
  santa_catarina: '#8B5CF6',
  pedagogico: '#EC4899',
  administrativo_financeiro: '#14B8A6',
};

const PRIORITY_LABELS: Record<string, string> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

function daysRemaining(dueDate: string | null): number | null {
  if (!dueDate) return null;
  const target = new Date(dueDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function dueDateColor(days: number | null): string {
  if (days === null) return '';
  if (days < 0) return 'bg-red-500/20 text-red-400';
  if (days <= 3) return 'bg-amber-500/20 text-amber-400';
  if (days <= 7) return 'bg-yellow-500/15 text-yellow-400';
  return 'bg-white/[0.06] text-white/50';
}

interface KanbanCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

function KanbanCard({ task, onEdit, onStatusChange, onDragStart, onDragEnd }: KanbanCardProps) {
  const priorityColor = PRIORITY_COLORS[task.priority] ?? '#6B7280';
  const days = daysRemaining(task.dueDate);
  const dateChipClass = dueDateColor(days);

  const handleDotClick = useCallback(
    (e: React.MouseEvent, status: TaskStatus) => {
      e.stopPropagation();
      if (status !== task.status) {
        onStatusChange(task.id, status);
      }
    },
    [task.id, task.status, onStatusChange],
  );

  return (
    <motion.div
      layout
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(task.id)}
      className="group relative rounded-xl bg-white/[0.04] border border-white/[0.08] cursor-pointer hover:bg-white/[0.07] hover:shadow-lg hover:shadow-black/20 transition-all duration-200 overflow-hidden"
      whileHover={{ scale: 1.01 }}
    >
      {/* Department + Priority color strips */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl" style={{ backgroundColor: DEPARTMENT_COLORS[task.departmentId] ?? '#6B7280' }} />
      <div className="absolute left-[3px] top-0 bottom-0 w-[2px]" style={{ backgroundColor: priorityColor, opacity: 0.6 }} />

      <div className="pl-4 pr-2.5 py-2.5">
        {/* Title row */}
        <div className="flex items-start gap-1.5 mb-1.5">
          <GripVertical size={11} className="text-white/15 mt-0.5 shrink-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
          <h5 className="text-[11px] font-medium text-white/90 leading-snug flex-1 line-clamp-2">
            {task.title}
          </h5>
          {/* Priority badge */}
          <span
            className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: `${priorityColor}20`, color: priorityColor }}
          >
            {PRIORITY_LABELS[task.priority] ?? task.priority}
          </span>
        </div>

        {/* Due date chip + assignee dots */}
        <div className="flex items-center gap-1.5 mb-2">
          {task.dueDate && (
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${dateChipClass}`}>
              <Calendar size={9} />
              {days !== null && (days < 0 ? `${Math.abs(days)}d atraso` : days === 0 ? 'Hoje' : `${days}d`)}
            </span>
          )}
          {task.assigneeIds.length > 0 && (
            <div className="flex -space-x-1">
              {task.assigneeIds.slice(0, 3).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full bg-white/[0.12] border border-white/[0.06]"
                  title={task.assigneeIds[i]}
                />
              ))}
              {task.assigneeIds.length > 3 && (
                <span className="text-[8px] text-white/30 ml-1">+{task.assigneeIds.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Progress micro-bar */}
        {task.progress > 0 && (
          <div className="h-[2px] rounded-full bg-white/[0.06] overflow-hidden mb-2">
            <div
              className="h-full rounded-full"
              style={{
                width: `${task.progress}%`,
                background: task.progress === 100 ? '#10B981' : 'linear-gradient(90deg, #00B4D8, #00E5A0)',
              }}
            />
          </div>
        )}

        {/* Quick status dots */}
        <div className="flex items-center justify-center gap-2 pt-1 border-t border-white/[0.04]">
          {KANBAN_STATUSES.map((s) => {
            const isCurrent = task.status === s.key;
            return (
              <button
                key={s.key}
                onClick={(e) => handleDotClick(e, s.key)}
                className={`rounded-full transition-all ${
                  isCurrent
                    ? 'w-2.5 h-2.5 ring-2 ring-offset-1 ring-offset-transparent'
                    : 'w-2 h-2 opacity-40 hover:opacity-80 hover:scale-125'
                }`}
                style={{
                  backgroundColor: s.color,
                  ...(isCurrent ? { ringColor: s.color, boxShadow: `0 0 0 2px ${s.color}40` } : {}),
                }}
                title={s.key.replace('_', ' ')}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(KanbanCard);
