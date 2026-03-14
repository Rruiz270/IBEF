'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Calendar,
  User,
  Tag,
  AlertCircle,
  Clock,
  CheckCircle2,
  Ban,
  Flame,
  XCircle,
  PlayCircle,
  Pencil,
} from 'lucide-react';
import { format, parseISO, isPast, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Task, TaskStatus, TaskPriority, DepartmentId, Person } from '../data/types';

interface TaskCardProps {
  task: Task;
  /** Optional map of person IDs to Person objects for displaying assignee names */
  people?: Record<string, Person>;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  /** Called when the user wants to edit this task (opens modal) */
  onEdit?: (taskId: string) => void;
}

const statusConfig: Record<
  TaskStatus,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ElementType;
  }
> = {
  nao_iniciada: {
    label: 'Não Iniciada',
    color: 'text-white/60',
    bg: 'bg-white/10',
    border: 'border-white/10',
    icon: Clock,
  },
  em_andamento: {
    label: 'Em Andamento',
    color: 'text-[#00B4D8]',
    bg: 'bg-[#00B4D8]/15',
    border: 'border-[#00B4D8]/30',
    icon: PlayCircle,
  },
  concluida: {
    label: 'Concluída',
    color: 'text-[#00E5A0]',
    bg: 'bg-[#00E5A0]/15',
    border: 'border-[#00E5A0]/30',
    icon: CheckCircle2,
  },
  bloqueada: {
    label: 'Bloqueada',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    icon: Ban,
  },
  atrasada: {
    label: 'Atrasada',
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
    icon: AlertCircle,
  },
  cancelada: {
    label: 'Cancelada',
    color: 'text-white/30',
    bg: 'bg-white/5',
    border: 'border-white/5',
    icon: XCircle,
  },
};

const priorityConfig: Record<
  TaskPriority,
  { label: string; color: string; dots: number }
> = {
  baixa: { label: 'Baixa', color: 'text-white/40', dots: 1 },
  media: { label: 'Média', color: 'text-[#00B4D8]', dots: 2 },
  alta: { label: 'Alta', color: 'text-amber-400', dots: 3 },
  critica: { label: 'Crítica', color: 'text-red-400', dots: 4 },
};

const departmentColors: Record<DepartmentId, string> = {
  juridico: '#8B5CF6',
  tecnologia: '#00E5A0',
  relacoes_publicas: '#F59E0B',
  operacoes_locais: '#EF4444',
  santa_catarina: '#06B6D4',
  pedagogico: '#EC4899',
  administrativo_financeiro: '#3B82F6',
};

const departmentLabels: Record<DepartmentId, string> = {
  juridico: 'Jurídico',
  tecnologia: 'Tecnologia',
  relacoes_publicas: 'Relações Públicas',
  operacoes_locais: 'Operações Locais',
  santa_catarina: 'Santa Catarina',
  pedagogico: 'Pedagógico',
  administrativo_financeiro: 'Admin/Financeiro',
};

export default function TaskCard({
  task,
  people,
  onStatusChange,
  onEdit,
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;
  const deptColor = departmentColors[task.departmentId] ?? '#6B7280';
  const deptLabel = departmentLabels[task.departmentId] ?? task.departmentId;

  const hasDueDate = task.dueDate != null;
  const dueDate = hasDueDate ? parseISO(task.dueDate!) : null;
  const isOverdue =
    hasDueDate &&
    dueDate != null &&
    isPast(dueDate) &&
    task.status !== 'concluida' &&
    task.status !== 'cancelada';
  const daysUntilDue =
    dueDate != null ? differenceInDays(dueDate, new Date()) : null;

  let formattedDate = '';
  if (dueDate != null) {
    try {
      formattedDate = format(dueDate, 'dd MMM yyyy', { locale: ptBR });
    } catch {
      formattedDate = task.dueDate ?? '';
    }
  }

  /** Resolve assignee IDs to names */
  const assigneeNames = task.assigneeIds.map((id) => {
    if (people && people[id]) return people[id].name;
    return id;
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative rounded-xl border overflow-hidden transition-all duration-200
        ${expanded ? 'shadow-lg' : 'shadow-sm'}
        bg-[#0A2463]/60 hover:bg-[#0A2463]/80
        ${isOverdue ? 'border-red-500/30' : status.border}
      `}
    >
      {/* Department color accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
        style={{ backgroundColor: deptColor }}
      />

      {/* Main clickable area */}
      <button
        onClick={() => {
          if (onEdit) {
            onEdit(task.id);
          } else {
            setExpanded(!expanded);
          }
        }}
        className={`w-full text-left p-4 pl-5 ${onEdit ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-2">
              <h4
                className={`text-sm font-semibold leading-snug ${
                  task.status === 'concluida'
                    ? 'text-white/50 line-through'
                    : task.status === 'cancelada'
                      ? 'text-white/30 line-through'
                      : 'text-white'
                }`}
              >
                {task.title}
              </h4>
              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                {onEdit && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#00B4D8]/10 text-[#00B4D8] text-[10px] font-medium">
                    <Pencil size={10} />
                    Editar
                  </span>
                )}
                {!onEdit && (
                  <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={14} className="text-white/30" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
              {/* Status badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${status.bg} ${status.color}`}
              >
                <StatusIcon size={10} />
                {status.label}
              </span>

              {/* Priority dots */}
              <div className={`flex items-center gap-0.5 ${priority.color}`}>
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i < priority.dots ? 'bg-current' : 'bg-white/10'
                    }`}
                  />
                ))}
                <span className="ml-1 text-[10px]">{priority.label}</span>
              </div>

              {/* Due date */}
              {hasDueDate && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] ${
                    isOverdue
                      ? 'text-red-400'
                      : daysUntilDue != null && daysUntilDue <= 3
                        ? 'text-amber-400'
                        : 'text-white/40'
                  }`}
                >
                  <Calendar size={10} />
                  {formattedDate}
                  {isOverdue && (
                    <span className="font-medium">(atrasado)</span>
                  )}
                  {!isOverdue &&
                    daysUntilDue != null &&
                    daysUntilDue <= 3 &&
                    daysUntilDue >= 0 && (
                      <span className="font-medium">({daysUntilDue}d)</span>
                    )}
                </span>
              )}

              {/* Department */}
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium"
                style={{ color: deptColor }}
              >
                <Tag size={10} />
                {deptLabel}
              </span>
            </div>

            {/* Assignees */}
            {assigneeNames.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <User size={10} className="text-white/30 shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {assigneeNames.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-white/50"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Task progress mini bar */}
            {task.progress > 0 && task.status !== 'concluida' && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#00B4D8]/60 transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-white/30 shrink-0">
                  {task.progress}%
                </span>
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 border-t border-white/5 pt-3">
              {/* Description */}
              {task.description && (
                <p className="text-xs text-white/50 leading-relaxed mb-3">
                  {task.description}
                </p>
              )}

              {/* Notes */}
              {task.notes && (
                <div className="mb-3">
                  <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-1">
                    Notas
                  </p>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {task.notes}
                  </p>
                </div>
              )}

              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-[#00B4D8]/10 text-[#90E0EF] text-[10px] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Dependencies */}
              {task.dependencies.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-1">
                    Dependências
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {task.dependencies.map((dep) => (
                      <span
                        key={dep}
                        className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-white/30 font-mono"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Edit button */}
              {onEdit && (
                <div className="mb-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/30 hover:bg-[#00B4D8]/25 transition-colors"
                  >
                    <Pencil size={12} />
                    Editar Tarefa
                  </button>
                </div>
              )}

              {/* Quick status change buttons */}
              {onStatusChange && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-2">
                    Alterar Status
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      Object.entries(statusConfig) as [
                        TaskStatus,
                        (typeof statusConfig)[TaskStatus],
                      ][]
                    ).map(([key, cfg]) => {
                      if (key === task.status) return null;
                      const BtnIcon = cfg.icon;
                      return (
                        <button
                          key={key}
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(task.id, key);
                          }}
                          className={`
                            flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium
                            border transition-all duration-200
                            ${cfg.bg} ${cfg.color} ${cfg.border}
                            hover:brightness-125
                          `}
                        >
                          <BtnIcon size={10} />
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Metadata footer */}
              <div className="mt-3 flex gap-3 text-[10px] text-white/20 flex-wrap">
                {task.phaseId && <span>Fase: {task.phaseId}</span>}
                <span>Criado: {task.createdAt}</span>
                {task.completedAt && (
                  <span>Concluído: {task.completedAt}</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
