'use client';

import { useState, useMemo, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Ban,
  Calendar,
  Tag,
  Users,
  StickyNote,
  Scale,
  Code,
  Handshake,
  MapPin,
  Building2,
  GraduationCap,
  Wallet,
  ArrowUpRight,
  Flame,
  Filter,
  ArrowUpDown,
  ListChecks,
  Pencil,
  Plus,
  LayoutGrid,
  List,
  Paperclip,
  FolderOpen,
} from 'lucide-react';
import { departments, people, milestones } from '../../data/projectData';
import { useProject } from '../../contexts/ProjectContext';
import TaskEditModal from '../../components/TaskEditModal';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import FileUpload from '../../components/FileUpload';
import { formatFileSize, getFileIcon, downloadFile } from '../../lib/fileStorage';
import type { Task, Department, DepartmentId, TaskStatus, Person } from '../../data/types';

// ---------------------------------------------------------------------------
// Constants & Helpers
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, React.ElementType> = {
  Scale,
  Code,
  Handshake,
  MapPin,
  Building2,
  GraduationCap,
  Wallet,
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  nao_iniciada: { label: 'Não Iniciada', color: 'text-gray-400', bg: 'bg-gray-500/20', icon: Circle },
  em_andamento: { label: 'Em Andamento', color: 'text-cyan-400', bg: 'bg-cyan-500/20', icon: Clock },
  concluida:    { label: 'Concluída', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: CheckCircle2 },
  bloqueada:    { label: 'Bloqueada', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: Ban },
  atrasada:     { label: 'Atrasada', color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle },
  cancelada:    { label: 'Cancelada', color: 'text-gray-500', bg: 'bg-gray-600/20', icon: Ban },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; dots: number }> = {
  critica: { label: 'Crítica', color: 'bg-red-500', dots: 4 },
  alta:    { label: 'Alta', color: 'bg-amber-500', dots: 3 },
  media:   { label: 'Média', color: 'bg-blue-500', dots: 2 },
  baixa:   { label: 'Baixa', color: 'bg-gray-500', dots: 1 },
};

const PRIORITY_ORDER: Record<string, number> = { critica: 0, alta: 1, media: 2, baixa: 3 };

type StatusFilter = 'todas' | 'em_andamento' | 'nao_iniciada' | 'concluida' | 'critica';
type SortMode = 'prioridade' | 'prazo' | 'progresso';

function getPersonName(id: string): string {
  return people.find((p) => p.id === id)?.name ?? id;
}

function daysRemaining(dueDate: string | null): number | null {
  if (!dueDate) return null;
  const target = new Date(dueDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// Circular Progress
// ---------------------------------------------------------------------------

function CircularProgress({ value, size = 44, strokeWidth = 4, color }: { value: number; size?: number; strokeWidth?: number; color: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={size * 0.26}
        fontWeight={600}
        className="rotate-90 origin-center"
      >
        {value}%
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Status Stacked Bar
// ---------------------------------------------------------------------------

function StatusStackedBar({ taskList }: { taskList: Task[] }) {
  const total = taskList.length;
  if (total === 0) return null;

  const counts: Record<string, number> = {
    concluida: 0,
    em_andamento: 0,
    nao_iniciada: 0,
    bloqueada: 0,
    atrasada: 0,
    cancelada: 0,
  };
  taskList.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });

  const barColors: Record<string, string> = {
    concluida: '#10B981',
    em_andamento: '#00B4D8',
    nao_iniciada: '#6B7280',
    bloqueada: '#F59E0B',
    atrasada: '#EF4444',
    cancelada: '#374151',
  };

  return (
    <div className="w-full">
      <div className="flex h-3 rounded-full overflow-hidden bg-white/5">
        {Object.entries(counts).map(([status, count]) =>
          count > 0 ? (
            <motion.div
              key={status}
              className="h-full"
              style={{ backgroundColor: barColors[status] }}
              initial={{ width: 0 }}
              animate={{ width: `${(count / total) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              title={`${STATUS_CONFIG[status]?.label ?? status}: ${count}`}
            />
          ) : null,
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {Object.entries(counts).map(([status, count]) =>
          count > 0 ? (
            <span key={status} className="flex items-center gap-1.5 text-xs text-white/60">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: barColors[status] }} />
              {STATUS_CONFIG[status]?.label}: {count}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Task Card
// ---------------------------------------------------------------------------

function WorkstreamTaskCard({ task, allTasks, onEdit }: { task: Task; allTasks: Task[]; onEdit?: (taskId: string) => void }) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);
  const { getAttachmentsForEntity } = useProject();
  const taskAttachments = getAttachmentsForEntity('task', task.id);
  const status = STATUS_CONFIG[task.status];
  const priority = PRIORITY_CONFIG[task.priority];
  const days = daysRemaining(task.dueDate);
  const StatusIcon = status.icon;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const depTitles = task.dependencies
    .map((depId) => allTasks.find((t) => t.id === depId)?.title ?? depId)
    .filter(Boolean);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.05] transition-colors"
    >
      {/* Row 1: Title + Status + Priority */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <h4
          className={`text-sm font-semibold text-white flex-1 min-w-0 ${onEdit ? 'cursor-pointer hover:text-[#00B4D8] transition-colors' : ''}`}
          onClick={() => onEdit?.(task.id)}
        >
          {task.title}
        </h4>
        <div className="flex items-center gap-2 shrink-0">
          {/* Attach button */}
          <button
            onClick={(e) => { e.stopPropagation(); setFilesOpen(!filesOpen); }}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
              filesOpen || taskAttachments.length > 0
                ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25'
                : 'bg-white/[0.06] text-white/40 hover:bg-white/10 hover:text-white/60'
            }`}
          >
            <Paperclip size={10} />
            Anexar
            {taskAttachments.length > 0 && (
              <span className="px-1 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                {taskAttachments.length}
              </span>
            )}
          </button>
          {/* Edit badge */}
          {onEdit && (
            <button
              onClick={() => onEdit(task.id)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#00B4D8]/10 text-[#00B4D8] text-[10px] font-medium hover:bg-[#00B4D8]/20 transition-colors"
            >
              <Pencil size={10} />
              Editar
            </button>
          )}
          {/* Priority dots */}
          <div className="flex items-center gap-0.5" title={`Prioridade: ${priority.label}`}>
            {Array.from({ length: priority.dots }).map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full ${priority.color}`} />
            ))}
          </div>
          {/* Status badge */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
            <StatusIcon size={12} />
            {status.label}
          </span>
        </div>
      </div>

      {/* Row 2: Assignees + Due date */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50 mb-3">
        {task.assigneeIds.length > 0 && (
          <span className="flex items-center gap-1">
            <Users size={12} />
            {task.assigneeIds.map(getPersonName).join(', ')}
          </span>
        )}
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(task.dueDate)}
            {days !== null && (
              <span className={`ml-1 font-medium ${days < 0 ? 'text-red-400' : days <= 7 ? 'text-amber-400' : 'text-white/60'}`}>
                ({days < 0 ? `${Math.abs(days)} dias atrasada` : days === 0 ? 'Hoje' : `${days} dias restantes`})
              </span>
            )}
          </span>
        )}
      </div>

      {/* Row 3: Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-white/40">Progresso</span>
          <span className="text-xs font-medium text-white/70">{task.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: task.progress === 100
                ? '#10B981'
                : task.progress > 0
                  ? 'linear-gradient(90deg, #00B4D8, #00E5A0)'
                  : '#374151',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${task.progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Row 4: Dependencies + Tags */}
      <div className="flex flex-wrap gap-2 text-xs">
        {depTitles.length > 0 && (
          <div className="flex items-center gap-1 text-white/40">
            <ArrowUpRight size={12} />
            <span>Depende de: {depTitles.join('; ')}</span>
          </div>
        )}
      </div>
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.05] text-white/50 text-[10px]"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Row 5: Notes (collapsible) */}
      {task.notes && (
        <div className="mt-3 border-t border-white/[0.04] pt-2">
          <button
            onClick={(e) => { e.stopPropagation(); setNotesOpen(!notesOpen); }}
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            <StickyNote size={12} />
            <span>Observações</span>
            {notesOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <AnimatePresence>
            {notesOpen && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-white/40 mt-1 leading-relaxed overflow-hidden"
              >
                {task.notes}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Row 6: File upload area (expanded via Anexar button) */}
      <AnimatePresence>
        {filesOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t border-white/[0.06] pt-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-2">
                <Paperclip size={12} className="text-amber-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Arquivos da Tarefa
                </span>
              </div>
              <FileUpload
                entityType="task"
                entityId={task.id}
                departmentId={task.departmentId}
                compact
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Workstream Accordion Item
// ---------------------------------------------------------------------------

function WorkstreamItem({
  dept,
  deptTasks,
  allTasks,
  isOpen,
  onToggle,
  statusFilter,
  sortMode,
  onEditTask,
  onAddTask,
}: {
  dept: Department;
  deptTasks: Task[];
  allTasks: Task[];
  isOpen: boolean;
  onToggle: () => void;
  statusFilter: StatusFilter;
  sortMode: SortMode;
  onEditTask?: (taskId: string) => void;
  onAddTask?: () => void;
}) {
  const DeptIcon = ICON_MAP[dept.icon] || ListChecks;
  const [deptFilesOpen, setDeptFilesOpen] = useState(false);
  const { getAttachmentsForDepartment } = useProject();
  const deptAttachments = getAttachmentsForDepartment(dept.id as DepartmentId);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...deptTasks];
    if (statusFilter === 'em_andamento') filtered = filtered.filter((t) => t.status === 'em_andamento');
    else if (statusFilter === 'nao_iniciada') filtered = filtered.filter((t) => t.status === 'nao_iniciada');
    else if (statusFilter === 'concluida') filtered = filtered.filter((t) => t.status === 'concluida');
    else if (statusFilter === 'critica') filtered = filtered.filter((t) => t.priority === 'critica');
    return filtered;
  }, [deptTasks, statusFilter]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    const sorted = [...filteredTasks];
    if (sortMode === 'prioridade') {
      sorted.sort((a, b) => {
        const pDiff = (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9);
        if (pDiff !== 0) return pDiff;
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      });
    } else if (sortMode === 'prazo') {
      sorted.sort((a, b) => {
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      });
    } else if (sortMode === 'progresso') {
      sorted.sort((a, b) => b.progress - a.progress);
    }
    return sorted;
  }, [filteredTasks, sortMode]);

  // Stats
  const completedCount = deptTasks.filter((t) => t.status === 'concluida').length;
  const progress = deptTasks.length > 0
    ? Math.round(deptTasks.reduce((s, t) => s + t.progress, 0) / deptTasks.length)
    : 0;
  const leads = dept.leadIds.map(getPersonName);

  // Quick stats for expanded view
  const criticalCount = deptTasks.filter((t) => t.priority === 'critica' && t.status !== 'concluida' && t.status !== 'cancelada').length;
  const nearestDeadline = deptTasks
    .filter((t) => t.dueDate && t.status !== 'concluida' && t.status !== 'cancelada')
    .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''))[0];

  return (
    <motion.div
      layout
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
    >
      {/* Collapsed header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-4 sm:px-5 hover:bg-white/[0.03] transition-colors"
      >
        {/* Color bar */}
        <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: dept.color }} />

        {/* Icon */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: dept.color + '20' }}
        >
          <DeptIcon size={18} style={{ color: dept.color }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-left">
          <h3 className="text-sm font-semibold text-white truncate">{dept.name}</h3>
          {leads.length > 0 && (
            <p className="text-xs text-white/40 truncate">{leads.join(', ')}</p>
          )}
        </div>

        {/* Task count */}
        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-white/50 shrink-0">
          <CheckCircle2 size={12} className="text-emerald-400" />
          {completedCount}/{deptTasks.length} tarefas
        </span>

        {/* Circular progress */}
        <div className="shrink-0">
          <CircularProgress value={progress} color={dept.color} />
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-white/40"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 sm:px-5 space-y-4">
              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Distribuição por Status</p>
                  <StatusStackedBar taskList={deptTasks} />
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05] flex flex-col justify-center">
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Prazo Mais Próximo</p>
                  {nearestDeadline ? (
                    <>
                      <p className="text-sm font-medium text-white truncate">{nearestDeadline.title}</p>
                      <p className="text-xs text-white/50">
                        {formatDate(nearestDeadline.dueDate!)} &mdash;{' '}
                        <span className={
                          (daysRemaining(nearestDeadline.dueDate) ?? 0) < 0
                            ? 'text-red-400 font-medium'
                            : (daysRemaining(nearestDeadline.dueDate) ?? 0) <= 7
                              ? 'text-amber-400 font-medium'
                              : 'text-white/50'
                        }>
                          {(() => {
                            const d = daysRemaining(nearestDeadline.dueDate);
                            if (d === null) return '';
                            if (d < 0) return `${Math.abs(d)} dias atrasada`;
                            if (d === 0) return 'Hoje';
                            return `${d} dias restantes`;
                          })()}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-white/40">Sem prazos pendentes</p>
                  )}
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05] flex flex-col justify-center">
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Tarefas Críticas</p>
                  <div className="flex items-center gap-2">
                    <Flame size={18} className={criticalCount > 0 ? 'text-red-400' : 'text-white/20'} />
                    <span className={`text-2xl font-bold ${criticalCount > 0 ? 'text-red-400' : 'text-white/30'}`}>
                      {criticalCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Task list */}
              {sortedTasks.length > 0 ? (
                <div className="space-y-3">
                  {sortedTasks.map((task) => (
                    <WorkstreamTaskCard key={task.id} task={task} allTasks={allTasks} onEdit={onEditTask} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/30 text-center py-6">
                  Nenhuma tarefa encontrada com os filtros selecionados.
                </p>
              )}

              {/* Department files section */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <button
                  onClick={() => setDeptFilesOpen(!deptFilesOpen)}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                >
                  <FolderOpen size={14} style={{ color: dept.color }} />
                  <span className="text-xs font-medium text-white/60 flex-1 text-left">
                    Documentos do Departamento
                  </span>
                  {deptAttachments.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ backgroundColor: dept.color + '20', color: dept.color }}>
                      {deptAttachments.length}
                    </span>
                  )}
                  <motion.div
                    animate={{ rotate: deptFilesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/30"
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {deptFilesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-white/[0.04]">
                        {deptAttachments.length > 0 ? (
                          <div className="space-y-1.5 mb-3">
                            {deptAttachments.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2"
                              >
                                <span className="text-sm shrink-0" aria-hidden>
                                  {getFileIcon(file.type, file.name)}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-white/70 truncate">{file.name}</p>
                                  <p className="text-[10px] text-white/30">
                                    {formatFileSize(file.size)}
                                    {' · '}
                                    {file.entityType === 'task' ? 'Tarefa' : 'Vaga'}
                                  </p>
                                </div>
                                <button
                                  onClick={() => downloadFile(file.id, file.name)}
                                  className="shrink-0 p-1.5 rounded-md hover:bg-white/10 text-white/30 hover:text-[#00B4D8] transition-colors"
                                  title="Baixar"
                                >
                                  <ArrowUpRight size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-white/25 text-center py-3">
                            Nenhum arquivo neste departamento ainda.
                          </p>
                        )}
                        <p className="text-[10px] text-white/25 mt-1">
                          Clique em &quot;Anexar&quot; em cada tarefa acima para adicionar arquivos.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Add new task button */}
              {onAddTask && (
                <button
                  onClick={onAddTask}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/[0.12] text-white/40 text-sm font-medium hover:border-white/[0.25] hover:text-white/60 hover:bg-white/[0.03] transition-colors"
                >
                  <Plus size={16} />
                  Nova Atividade
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Summary Bar
// ---------------------------------------------------------------------------

function SummaryBar({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const emAndamento = tasks.filter((t) => t.status === 'em_andamento').length;
  const concluidas = tasks.filter((t) => t.status === 'concluida').length;
  const atrasadas = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'concluida' || t.status === 'cancelada') return false;
    return new Date(t.dueDate + 'T23:59:59') < new Date();
  }).length;
  const naoIniciadas = tasks.filter((t) => t.status === 'nao_iniciada').length;

  const items = [
    { label: 'Total Tarefas', value: total, color: '#90E0EF', pct: 100 },
    { label: 'Em Andamento', value: emAndamento, color: '#00B4D8', pct: total > 0 ? (emAndamento / total) * 100 : 0 },
    { label: 'Concluídas', value: concluidas, color: '#00E5A0', pct: total > 0 ? (concluidas / total) * 100 : 0 },
    { label: 'Atrasadas', value: atrasadas, color: '#EF4444', pct: total > 0 ? (atrasadas / total) * 100 : 0 },
    { label: 'Não Iniciadas', value: naoIniciadas, color: '#6B7280', pct: total > 0 ? (naoIniciadas / total) * 100 : 0 },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((item) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 sm:p-4"
        >
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{item.label}</p>
          <p className="text-xl sm:text-2xl font-bold text-white" style={{ color: item.color }}>
            {item.value}
          </p>
          <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
              initial={{ width: 0 }}
              animate={{ width: `${item.pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

type ViewMode = 'list' | 'kanban';

function WorkstreamsContent() {
  const { tasks, addTask, updateTask } = useProject();
  const searchParams = useSearchParams();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [openDepts, setOpenDepts] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas');
  const [sortMode, setSortMode] = useState<SortMode>('prioridade');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Read filter from URL (dashboard drill-down)
  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter) {
      if (['todas', 'em_andamento', 'nao_iniciada', 'concluida', 'critica'].includes(urlFilter)) {
        setStatusFilter(urlFilter as StatusFilter);
      }
      // Handle special "atrasada" filter
      if (urlFilter === 'atrasada') {
        setStatusFilter('todas');
        // Open all departments so user sees overdue tasks
        setOpenDepts(new Set(departments.map((d) => d.id)));
      }
    }
  }, [searchParams]);

  const toggleDept = useCallback((id: string) => {
    setOpenDepts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Build tasks per department
  const deptTasksMap = useMemo(() => {
    const map: Record<string, Task[]> = {};
    departments.forEach((d) => {
      map[d.id] = tasks.filter((t) => t.departmentId === d.id);
    });
    return map;
  }, [tasks]);

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: 'todas', label: 'Todas' },
    { key: 'em_andamento', label: 'Em Andamento' },
    { key: 'nao_iniciada', label: 'Não Iniciadas' },
    { key: 'concluida', label: 'Concluídas' },
    { key: 'critica', label: 'Críticas' },
  ];

  const sortOptions: { key: SortMode; label: string }[] = [
    { key: 'prioridade', label: 'Por Prioridade' },
    { key: 'prazo', label: 'Por Prazo' },
    { key: 'progresso', label: 'Por Progresso' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Departamentos e Atividades
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Acompanhamento detalhado por área de atuação
        </p>
      </motion.div>

      {/* Summary Bar */}
      <SummaryBar tasks={tasks} />

      {/* View Toggle + Filters and Sort */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
      >
        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'list' ? 'bg-[#00B4D8]/20 text-[#00B4D8]' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <List size={14} />
            Lista
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'kanban' ? 'bg-[#00B4D8]/20 text-[#00B4D8]' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <LayoutGrid size={14} />
            Kanban
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
      >
        {/* Status filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-white/40 shrink-0" />
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === f.key
                  ? 'bg-[#00B4D8]/20 text-[#00B4D8] border border-[#00B4D8]/30'
                  : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          <ArrowUpDown size={14} className="text-white/40 shrink-0" />
          {sortOptions.map((s) => (
            <button
              key={s.key}
              onClick={() => setSortMode(s.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sortMode === s.key
                  ? 'bg-[#00E5A0]/20 text-[#00E5A0] border border-[#00E5A0]/30'
                  : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <KanbanBoard
            tasks={tasks}
            onEditTask={(id) => setEditingTaskId(id)}
            onStatusChange={(id, status) => updateTask(id, { status: status as Task['status'] })}
            onAddTask={(status: TaskStatus) => {
              const newId = addTask({
                title: 'Nova Atividade',
                departmentId: 'tecnologia' as DepartmentId,
                status,
                priority: 'media',
              });
              setEditingTaskId(newId);
            }}
          />
        </motion.div>
      )}

      {/* Workstream Accordion List */}
      {viewMode === 'list' && <div className="space-y-3">
        {departments.map((dept, i) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <WorkstreamItem
              dept={dept}
              deptTasks={deptTasksMap[dept.id] || []}
              allTasks={tasks}
              isOpen={openDepts.has(dept.id)}
              onToggle={() => toggleDept(dept.id)}
              statusFilter={statusFilter}
              sortMode={sortMode}
              onEditTask={(id) => setEditingTaskId(id)}
              onAddTask={() => {
                const newId = addTask({
                  title: 'Nova Atividade',
                  departmentId: dept.id as DepartmentId,
                  status: 'nao_iniciada',
                  priority: 'media',
                });
                setEditingTaskId(newId);
              }}
            />
          </motion.div>
        ))}
      </div>}

      {/* Task Edit Modal */}
      <TaskEditModal taskId={editingTaskId} onClose={() => setEditingTaskId(null)} />
    </div>
  );
}

export default function WorkstreamsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkstreamsContent />
    </Suspense>
  );
}
