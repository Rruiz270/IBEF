'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Clock,
  Diamond,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Calendar,
  Target,
  TrendingUp,
  Info,
  Plus,
  Filter,
  X,
} from 'lucide-react';

import { phases, milestones, departments, people } from '../../data/projectData';
import type { Task, Department, Phase, Milestone, TaskStatus, TaskPriority, DepartmentId } from '../../data/types';
import { useProject } from '@/contexts/ProjectContext';
import TaskEditModal from '@/components/TaskEditModal';

// =============================================================================
// Animation Variants
// =============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// =============================================================================
// Constants
// =============================================================================

const ETEC_CONTRACT_DATE = '2026-07-15';

const YEAR_QUARTERS: Record<number, { label: string; start: string; end: string }[]> = {
  2026: [
    { label: 'Q1', start: '2026-01-01', end: '2026-03-31' },
    { label: 'Q2', start: '2026-04-01', end: '2026-06-30' },
    { label: 'Q3', start: '2026-07-01', end: '2026-09-30' },
    { label: 'Q4', start: '2026-10-01', end: '2026-12-31' },
  ],
  2027: [
    { label: 'Q1', start: '2027-01-01', end: '2027-03-31' },
    { label: 'Q2', start: '2027-04-01', end: '2027-06-30' },
    { label: 'Q3', start: '2027-07-01', end: '2027-09-30' },
    { label: 'Q4', start: '2027-10-01', end: '2027-12-31' },
  ],
  2028: [
    { label: 'Q1', start: '2028-01-01', end: '2028-03-31' },
    { label: 'Q2', start: '2028-04-01', end: '2028-06-30' },
    { label: 'Q3', start: '2028-07-01', end: '2028-09-30' },
    { label: 'Q4', start: '2028-10-01', end: '2028-12-31' },
  ],
};

const PHASE_COLORS: Record<number, string> = {
  0: '#00B4D8',
  1: '#00E5A0',
  2: '#F59E0B',
  3: '#8B5CF6',
};

const PHASE_BG_COLORS: Record<number, string> = {
  0: 'rgba(0, 180, 216, 0.08)',
  1: 'rgba(0, 229, 160, 0.08)',
  2: 'rgba(245, 158, 11, 0.08)',
  3: 'rgba(139, 92, 246, 0.08)',
};

// Map department IDs to the display labels used in the timeline
const DEPT_ORDER: string[] = [
  'juridico',
  'tecnologia',
  'relacoes_publicas',
  'operacoes_locais',
  'santa_catarina',
  'pedagogico',
  'administrativo_financeiro',
];

const DEPT_SHORT_LABELS: Record<string, string> = {
  juridico: 'Jur\u00eddico',
  tecnologia: 'Tecnologia',
  relacoes_publicas: 'Rela\u00e7\u00f5es P\u00fablicas',
  operacoes_locais: 'Opera\u00e7\u00f5es',
  santa_catarina: 'Santa Catarina',
  pedagogico: 'Pedag\u00f3gico',
  administrativo_financeiro: 'Admin/Financeiro',
};

// Height in px for each task bar row inside a department
const TASK_ROW_HEIGHT = 28;
// Vertical padding around the task bars inside a department row
const DEPT_ROW_PADDING = 8;

// =============================================================================
// Filter & Status Constants
// =============================================================================

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string; bg: string }[] = [
  { value: 'nao_iniciada', label: 'N\u00e3o Iniciada', color: '#94A3B8', bg: 'rgba(148,163,184,0.15)' },
  { value: 'em_andamento', label: 'Em Andamento', color: '#00B4D8', bg: 'rgba(0,180,216,0.15)' },
  { value: 'concluida', label: 'Conclu\u00edda', color: '#00E5A0', bg: 'rgba(0,229,160,0.15)' },
  { value: 'bloqueada', label: 'Bloqueada', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  { value: 'atrasada', label: 'Atrasada', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  { value: 'cancelada', label: 'Cancelada', color: '#6B7280', bg: 'rgba(107,114,128,0.15)' },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'critica', label: 'Cr\u00edtica', color: '#EF4444' },
  { value: 'alta', label: 'Alta', color: '#F59E0B' },
  { value: 'media', label: 'M\u00e9dia', color: '#00B4D8' },
  { value: 'baixa', label: 'Baixa', color: '#94A3B8' },
];

const DEPARTMENT_OPTIONS: { value: DepartmentId; label: string }[] = [
  { value: 'juridico', label: 'Jur\u00eddico' },
  { value: 'tecnologia', label: 'Tecnologia' },
  { value: 'relacoes_publicas', label: 'Rela\u00e7\u00f5es P\u00fablicas' },
  { value: 'operacoes_locais', label: 'Opera\u00e7\u00f5es Locais' },
  { value: 'santa_catarina', label: 'Santa Catarina' },
  { value: 'pedagogico', label: 'Pedag\u00f3gico' },
  { value: 'administrativo_financeiro', label: 'Admin/Financeiro' },
];

const PEOPLE_MAP = Object.fromEntries(people.map((p) => [p.id, p.name]));

// =============================================================================
// Utility Functions
// =============================================================================

function getCountdown(targetDate: string): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date().getTime();
  const target = new Date(targetDate + 'T00:00:00').getTime();
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function computeOverallProgress(): number {
  const totalBudget = phases.reduce((sum, p) => sum + (p.budgetBRL ?? 0), 0);
  if (totalBudget === 0) {
    const avg = phases.reduce((sum, p) => sum + p.progress, 0) / phases.length;
    return Math.round(avg);
  }
  const weighted = phases.reduce((sum, p) => {
    const weight = (p.budgetBRL ?? 0) / totalBudget;
    return sum + p.progress * weight;
  }, 0);
  return Math.round(weighted);
}

/** Returns 0..1 position within a year for a given date string */
function getYearPosition(dateStr: string, year: number): number {
  const date = new Date(dateStr + 'T00:00:00');
  const yearStart = new Date(`${year}-01-01T00:00:00`);
  const yearEnd = new Date(`${year}-12-31T23:59:59`);
  const totalMs = yearEnd.getTime() - yearStart.getTime();
  const posMs = date.getTime() - yearStart.getTime();
  return Math.max(0, Math.min(1, posMs / totalMs));
}

/** Returns 0..1 position within a specific quarter */
function getQuarterPosition(dateStr: string, qStart: string, qEnd: string): number {
  const date = new Date(dateStr + 'T00:00:00');
  const start = new Date(qStart + 'T00:00:00');
  const end = new Date(qEnd + 'T23:59:59');
  const totalMs = end.getTime() - start.getTime();
  const posMs = date.getTime() - start.getTime();
  return Math.max(0, Math.min(1, posMs / totalMs));
}

function isDateInRange(dateStr: string, rangeStart: string, rangeEnd: string): boolean {
  const d = new Date(dateStr + 'T00:00:00').getTime();
  const s = new Date(rangeStart + 'T00:00:00').getTime();
  const e = new Date(rangeEnd + 'T23:59:59').getTime();
  return d >= s && d <= e;
}

function dateOverlapsRange(taskStart: string, taskEnd: string, rangeStart: string, rangeEnd: string): boolean {
  const ts = new Date(taskStart + 'T00:00:00').getTime();
  const te = new Date(taskEnd + 'T23:59:59').getTime();
  const rs = new Date(rangeStart + 'T00:00:00').getTime();
  const re = new Date(rangeEnd + 'T23:59:59').getTime();
  return ts <= re && te >= rs;
}

function formatDateBR(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function getMonthLabel(dateStr: string): string {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const date = new Date(dateStr + 'T00:00:00');
  return months[date.getMonth()];
}

// Get tasks for a department, computing effective start/end from dueDate and createdAt
function getTasksForDept(allTasks: Task[], deptId: string): Array<Task & { effectiveStart: string; effectiveEnd: string }> {
  return allTasks
    .filter((t) => t.departmentId === deptId)
    .map((t) => {
      const effectiveEnd = t.dueDate ?? t.createdAt;
      const effectiveStart = t.createdAt;
      return { ...t, effectiveStart, effectiveEnd };
    });
}

// =============================================================================
// Filter Types
// =============================================================================

interface FilterState {
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  departments: DepartmentId[];
  assignees: string[];
}

const EMPTY_FILTERS: FilterState = {
  statuses: [],
  priorities: [],
  departments: [],
  assignees: [],
};

function countActiveFilters(filters: FilterState): number {
  return filters.statuses.length + filters.priorities.length + filters.departments.length + filters.assignees.length;
}

function applyFilters(allTasks: Task[], filters: FilterState): Task[] {
  return allTasks.filter((t) => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(t.status)) return false;
    if (filters.priorities.length > 0 && !filters.priorities.includes(t.priority)) return false;
    if (filters.departments.length > 0 && !filters.departments.includes(t.departmentId)) return false;
    if (filters.assignees.length > 0 && !t.assigneeIds.some((a) => filters.assignees.includes(a))) return false;
    return true;
  });
}

// =============================================================================
// Countdown Display Component
// =============================================================================

function CountdownDisplay() {
  const [countdown, setCountdown] = useState(getCountdown(ETEC_CONTRACT_DATE));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(ETEC_CONTRACT_DATE));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: 'Dias', value: countdown.days },
    { label: 'Horas', value: countdown.hours },
    { label: 'Min', value: countdown.minutes },
    { label: 'Seg', value: countdown.seconds },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center">
            <motion.span
              key={unit.value}
              initial={{ y: -5, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tabular-nums bg-gradient-to-b from-[#00B4D8] to-[#00E5A0] bg-clip-text text-transparent"
            >
              {String(unit.value).padStart(2, '0')}
            </motion.span>
            <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider mt-0.5">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-xl sm:text-2xl text-white/20 font-light -mt-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Year/Quarter Tabs
// =============================================================================

function YearTabs({
  selectedYear,
  onYearChange,
}: {
  selectedYear: number;
  onYearChange: (y: number) => void;
}) {
  const years = [2026, 2027, 2028];

  return (
    <div className="flex items-center gap-2">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onYearChange(year)}
          className={`
            relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold
            transition-all duration-300
            ${
              selectedYear === year
                ? 'text-white bg-[#00B4D8]/20 border border-[#00B4D8]/40'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
            }
          `}
        >
          {selectedYear === year && (
            <motion.div
              layoutId="yearIndicator"
              className="absolute inset-0 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/30"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{year}</span>
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// Phase Band Component
// =============================================================================

function PhaseBands({ selectedYear }: { selectedYear: number }) {
  const yearStart = `${selectedYear}-01-01`;
  const yearEnd = `${selectedYear}-12-31`;

  const visiblePhases = phases.filter((p) =>
    dateOverlapsRange(p.startDate, p.endDate, yearStart, yearEnd)
  );

  if (visiblePhases.length === 0) return null;

  return (
    <div className="relative h-10 sm:h-12 rounded-xl overflow-hidden bg-white/[0.02] border border-white/5">
      {visiblePhases.map((phase) => {
        const clampedStart =
          new Date(phase.startDate) < new Date(yearStart) ? yearStart : phase.startDate;
        const clampedEnd =
          new Date(phase.endDate) > new Date(yearEnd) ? yearEnd : phase.endDate;

        const leftPos = getYearPosition(clampedStart, selectedYear) * 100;
        const rightPos = getYearPosition(clampedEnd, selectedYear) * 100;
        const width = Math.max(rightPos - leftPos, 1);

        return (
          <motion.div
            key={phase.id}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: phase.number * 0.1 }}
            className="absolute top-0 bottom-0 flex items-center justify-center"
            style={{
              left: `${leftPos}%`,
              width: `${width}%`,
              backgroundColor: PHASE_BG_COLORS[phase.number],
              borderLeft: `2px solid ${PHASE_COLORS[phase.number]}`,
              borderRight: `2px solid ${PHASE_COLORS[phase.number]}`,
              transformOrigin: 'left center',
            }}
          >
            <span
              className="text-[10px] sm:text-xs font-bold truncate px-2 whitespace-nowrap"
              style={{ color: PHASE_COLORS[phase.number] }}
            >
              Fase {phase.number}: {phase.title}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

// =============================================================================
// Milestones Row
// =============================================================================

function MilestonesRow({ selectedYear }: { selectedYear: number }) {
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);

  const yearStart = `${selectedYear}-01-01`;
  const yearEnd = `${selectedYear}-12-31`;

  const visibleMilestones = milestones.filter((m) =>
    isDateInRange(m.targetDate, yearStart, yearEnd)
  );

  if (visibleMilestones.length === 0) {
    return (
      <div className="relative h-16 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
        <span className="text-xs text-white/20">Sem marcos neste ano</span>
      </div>
    );
  }

  return (
    <div className="relative h-16 sm:h-20 rounded-xl bg-white/[0.02] border border-white/5">
      {/* Horizontal connecting line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />

      {visibleMilestones.map((milestone, idx) => {
        const pos = getYearPosition(milestone.targetDate, selectedYear) * 100;
        const isHovered = hoveredMilestone === milestone.id;

        return (
          <div
            key={milestone.id}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
            style={{ left: `${Math.max(2, Math.min(98, pos))}%` }}
            onMouseEnter={() => setHoveredMilestone(milestone.id)}
            onMouseLeave={() => setHoveredMilestone(null)}
          >
            {/* Diamond marker */}
            <motion.div
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ delay: 0.3 + idx * 0.08, type: 'spring', stiffness: 300 }}
              className={`
                w-4 h-4 sm:w-5 sm:h-5 cursor-pointer transition-all duration-200
                ${
                  milestone.isCritical
                    ? 'bg-red-500/80 border-2 border-red-400 shadow-lg shadow-red-500/30'
                    : 'bg-[#00B4D8]/60 border-2 border-[#00B4D8] shadow-lg shadow-[#00B4D8]/20'
                }
                ${isHovered ? 'scale-125' : ''}
              `}
            />

            {/* Label below */}
            <div className="absolute top-7 sm:top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[8px] sm:text-[10px] text-white/50 font-medium">
                {getMonthLabel(milestone.targetDate)}
              </span>
            </div>

            {/* Tooltip on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: -8 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
                >
                  <div className="bg-[#061742] border border-white/10 rounded-lg px-3 py-2 shadow-xl min-w-[180px]">
                    <p className="text-xs font-semibold text-white">{milestone.title}</p>
                    <p className="text-[10px] text-white/50 mt-0.5">{formatDateBR(milestone.targetDate)}</p>
                    {milestone.isCritical && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle size={10} className="text-red-400" />
                        <span className="text-[10px] text-red-400 font-medium">Caminho Cr{'\u00ed'}tico</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// Quick Status Popover Component
// =============================================================================

function QuickStatusPopover({
  task,
  anchorRect,
  onStatusChange,
  onOpenEditModal,
  onClose,
}: {
  task: Task;
  anchorRect: { top: number; left: number; width: number; height: number };
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onOpenEditModal: (taskId: string) => void;
  onClose: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Delay adding the listener to avoid immediate close from the click that opened it
    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Calculate position: place it above the task bar, centered
  const popoverWidth = 280;
  const popoverLeft = Math.max(8, anchorRect.left + anchorRect.width / 2 - popoverWidth / 2);
  const popoverTop = anchorRect.top - 8; // above the bar

  return (
    <motion.div
      ref={popoverRef}
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="fixed z-[100]"
      style={{
        top: `${popoverTop}px`,
        left: `${popoverLeft}px`,
        width: `${popoverWidth}px`,
        transform: 'translateY(-100%)',
      }}
    >
      <div className="bg-[#0A1E3D] border border-white/10 rounded-xl shadow-2xl shadow-black/40 p-3">
        {/* Task title */}
        <p className="text-xs font-semibold text-white truncate mb-2 px-1">{task.title}</p>

        {/* Status grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          {STATUS_OPTIONS.map((opt) => {
            const isActive = task.status === opt.value;
            return (
              <button
                key={opt.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(task.id, opt.value);
                  onClose();
                }}
                className={`
                  flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium
                  transition-all duration-150
                  ${isActive ? '' : 'hover:bg-white/5'}
                `}
                style={{
                  backgroundColor: isActive ? opt.bg : 'transparent',
                  color: isActive ? opt.color : 'rgba(255,255,255,0.5)',
                  boxShadow: isActive ? `0 0 0 1px ${opt.color}` : undefined,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: opt.color }}
                />
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Edit button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenEditModal(task.id);
            onClose();
          }}
          className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium text-white/50 hover:text-white/80 hover:bg-white/5 border border-white/5 transition-all duration-150"
        >
          Editar tarefa completa
        </button>
      </div>
    </motion.div>
  );
}

// =============================================================================
// Filter Panel Component
// =============================================================================

function FilterPanel({
  filters,
  onFiltersChange,
  allTasks,
}: {
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  allTasks: Task[];
}) {
  // Get unique assignees from tasks
  const uniqueAssignees = useMemo(() => {
    const ids = new Set<string>();
    allTasks.forEach((t) => t.assigneeIds.forEach((a) => ids.add(a)));
    return Array.from(ids).map((id) => ({
      value: id,
      label: PEOPLE_MAP[id] ?? id,
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [allTasks]);

  function toggleStatus(s: TaskStatus) {
    const arr = filters.statuses.includes(s)
      ? filters.statuses.filter((v) => v !== s)
      : [...filters.statuses, s];
    onFiltersChange({ ...filters, statuses: arr });
  }

  function togglePriority(p: TaskPriority) {
    const arr = filters.priorities.includes(p)
      ? filters.priorities.filter((v) => v !== p)
      : [...filters.priorities, p];
    onFiltersChange({ ...filters, priorities: arr });
  }

  function toggleDepartment(d: DepartmentId) {
    const arr = filters.departments.includes(d)
      ? filters.departments.filter((v) => v !== d)
      : [...filters.departments, d];
    onFiltersChange({ ...filters, departments: arr });
  }

  function toggleAssignee(a: string) {
    const arr = filters.assignees.includes(a)
      ? filters.assignees.filter((v) => v !== a)
      : [...filters.assignees, a];
    onFiltersChange({ ...filters, assignees: arr });
  }

  function clearAll() {
    onFiltersChange(EMPTY_FILTERS);
  }

  const activeCount = countActiveFilters(filters);

  const chipBase =
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all duration-150 border';

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="rounded-xl bg-[#061742]/60 border border-white/5 p-4 space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Filtros
          </span>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-[11px] text-[#00B4D8] hover:text-[#00B4D8]/80 font-medium transition-colors"
            >
              Limpar todos ({activeCount})
            </button>
          )}
        </div>

        {/* Status row */}
        <div>
          <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 block">
            Status
          </span>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((opt) => {
              const active = filters.statuses.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleStatus(opt.value)}
                  className={chipBase}
                  style={{
                    backgroundColor: active ? opt.bg : 'transparent',
                    borderColor: active ? opt.color + '60' : 'rgba(255,255,255,0.08)',
                    color: active ? opt.color : 'rgba(255,255,255,0.4)',
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: opt.color }}
                  />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority row */}
        <div>
          <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 block">
            Prioridade
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRIORITY_OPTIONS.map((opt) => {
              const active = filters.priorities.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => togglePriority(opt.value)}
                  className={chipBase}
                  style={{
                    backgroundColor: active ? opt.color + '20' : 'transparent',
                    borderColor: active ? opt.color + '60' : 'rgba(255,255,255,0.08)',
                    color: active ? opt.color : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Department row */}
        <div>
          <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 block">
            Departamento
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DEPARTMENT_OPTIONS.map((opt) => {
              const active = filters.departments.includes(opt.value);
              const dept = departments.find((d) => d.id === opt.value);
              const color = dept?.color ?? '#00B4D8';
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleDepartment(opt.value)}
                  className={chipBase}
                  style={{
                    backgroundColor: active ? color + '20' : 'transparent',
                    borderColor: active ? color + '60' : 'rgba(255,255,255,0.08)',
                    color: active ? color : 'rgba(255,255,255,0.4)',
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assignee row (only if there are assignees) */}
        {uniqueAssignees.length > 0 && (
          <div>
            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 block">
              Respons{'\u00e1'}vel
            </span>
            <div className="flex flex-wrap gap-1.5">
              {uniqueAssignees.map((opt) => {
                const active = filters.assignees.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleAssignee(opt.value)}
                    className={chipBase}
                    style={{
                      backgroundColor: active ? 'rgba(0,180,216,0.15)' : 'transparent',
                      borderColor: active ? 'rgba(0,180,216,0.4)' : 'rgba(255,255,255,0.08)',
                      color: active ? '#00B4D8' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// =============================================================================
// Add Task Quick Form (inline in header)
// =============================================================================

function AddTaskForm({
  onAdd,
  onClose,
}: {
  onAdd: (data: { title: string; departmentId: DepartmentId; priority: TaskPriority; status: TaskStatus }) => string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [deptId, setDeptId] = useState<DepartmentId>('tecnologia');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      departmentId: deptId,
      priority,
      status: 'nao_iniciada',
    });
    onClose();
  }

  return (
    <motion.div
      ref={formRef}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-[#0A1E3D] border border-white/10 rounded-xl shadow-2xl shadow-black/40 p-4 space-y-3"
      >
        <p className="text-sm font-semibold text-white">Nova Tarefa</p>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="T\u00edtulo da tarefa..."
          autoFocus
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8]/30 transition"
        />

        {/* Department + Priority */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1">
              Departamento
            </label>
            <select
              value={deptId}
              onChange={(e) => setDeptId(e.target.value as DepartmentId)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white/80 focus:outline-none focus:ring-1 focus:ring-[#00B4D8]/50 transition appearance-none"
            >
              {DEPARTMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0A1E3D] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1">
              Prioridade
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white/80 focus:outline-none focus:ring-1 focus:ring-[#00B4D8]/50 transition appearance-none"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0A1E3D] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#00B4D8]/20 border border-[#00B4D8]/30 text-[#00B4D8] text-xs font-semibold hover:bg-[#00B4D8]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Plus size={14} />
            Criar Tarefa
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/60 hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// =============================================================================
// Timeline Grid Row (per department) -- Each task gets its own vertical line
// =============================================================================

function TimelineGridRow({
  department,
  selectedYear,
  index,
  allTasks,
  onTaskClick,
}: {
  department: Department;
  selectedYear: number;
  index: number;
  allTasks: Task[];
  onTaskClick: (taskId: string, rect: { top: number; left: number; width: number; height: number }) => void;
}) {
  const yearStart = `${selectedYear}-01-01`;
  const yearEnd = `${selectedYear}-12-31`;
  const quarters = YEAR_QUARTERS[selectedYear];

  const deptTasks = getTasksForDept(allTasks, department.id);
  const visibleTasks = deptTasks.filter((t) =>
    dateOverlapsRange(t.effectiveStart, t.effectiveEnd, yearStart, yearEnd)
  );

  // Calculate dynamic row height: each task gets its own horizontal line
  const taskCount = visibleTasks.length;
  const rowContentHeight = Math.max(1, taskCount) * TASK_ROW_HEIGHT;
  const totalRowHeight = rowContentHeight + DEPT_ROW_PADDING * 2;

  // Build a stable index map so that every task gets a unique vertical slot
  const taskIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    visibleTasks.forEach((t, i) => {
      map.set(t.id, i);
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleTasks.map((t) => t.id).join(',')]);

  return (
    <motion.div
      variants={itemVariants}
      className="flex items-stretch gap-0 group"
    >
      {/* Department label (left column) */}
      <div
        className="w-36 sm:w-44 lg:w-52 shrink-0 flex items-start gap-2 px-3 py-3 bg-white/[0.02] border-r border-white/5 rounded-l-lg"
        style={{ minHeight: `${totalRowHeight}px` }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
          style={{ backgroundColor: department.color }}
        />
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-medium text-white/70 truncate">
            {DEPT_SHORT_LABELS[department.id] ?? department.name}
          </span>
          <span className="text-[9px] text-white/30 mt-0.5">
            {taskCount} {taskCount === 1 ? 'tarefa' : 'tarefas'}
          </span>
        </div>
      </div>

      {/* Quarter grid cells -- full-year relative container for task bars */}
      <div className="flex-1 relative" style={{ minHeight: `${totalRowHeight}px` }}>
        {/* Quarter background stripes */}
        <div className="absolute inset-0 flex">
          {quarters.map((q, qi) => (
            <div
              key={q.label}
              className={`
                flex-1 border-r border-white/5 last:border-r-0
                ${qi % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'}
              `}
            />
          ))}
        </div>

        {/* Task bars rendered across the full year width */}
        {visibleTasks.map((task) => {
          const taskIdx = taskIndexMap.get(task.id) ?? 0;

          // Compute position across the full year (0..100%)
          const clampedStart =
            new Date(task.effectiveStart) < new Date(yearStart) ? yearStart : task.effectiveStart;
          const clampedEnd =
            new Date(task.effectiveEnd) > new Date(yearEnd) ? yearEnd : task.effectiveEnd;

          const leftPct = getYearPosition(clampedStart, selectedYear) * 100;
          const rightPct = getYearPosition(clampedEnd, selectedYear) * 100;
          const widthPct = Math.max(rightPct - leftPct, 3);

          const isCritical = task.priority === 'critica';
          const isOverdue =
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            task.status !== 'concluida';

          const topPx = DEPT_ROW_PADDING + taskIdx * TASK_ROW_HEIGHT;

          // Status indicator color
          const statusOpt = STATUS_OPTIONS.find((s) => s.value === task.status);
          const statusColor = statusOpt?.color ?? '#94A3B8';

          return (
            <motion.div
              key={task.id}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.05 + taskIdx * 0.03, duration: 0.4 }}
              className={`
                absolute rounded-md cursor-pointer z-10
                transition-all duration-200 hover:brightness-125 hover:z-20
                group/task
                ${isCritical ? 'ring-1 ring-red-500/60' : ''}
                ${isOverdue ? 'ring-1 ring-amber-500/60' : ''}
              `}
              style={{
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                minWidth: '40px',
                top: `${topPx}px`,
                height: `${TASK_ROW_HEIGHT - 4}px`,
                backgroundColor: department.color + '40',
                borderLeft: `3px solid ${department.color}`,
                transformOrigin: 'left center',
              }}
              title={`${task.title} - ${task.progress}%`}
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                onTaskClick(task.id, {
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                });
              }}
            >
              {/* Progress fill */}
              <div
                className="absolute inset-0 rounded-md opacity-30"
                style={{
                  width: `${task.progress}%`,
                  backgroundColor: department.color,
                }}
              />
              {/* Status dot */}
              <div
                className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusColor }}
              />
              {/* Task label -- always shown with ellipsis */}
              <span className="absolute inset-0 flex items-center px-1.5 pr-4 text-[9px] sm:text-[10px] text-white/90 font-medium truncate pointer-events-none">
                {task.title}
              </span>

              {/* Hover tooltip with full task name */}
              <div
                className="
                  absolute bottom-full left-0 mb-1 z-50
                  hidden group-hover/task:block
                  pointer-events-none
                "
              >
                <div className="bg-[#061742] border border-white/10 rounded-lg px-2.5 py-1.5 shadow-xl max-w-[260px]">
                  <p className="text-[10px] font-semibold text-white whitespace-normal">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-white/40">{task.progress}%</span>
                    {task.dueDate && (
                      <span className="text-[9px] text-white/40">{formatDateBR(task.dueDate)}</span>
                    )}
                    {isCritical && (
                      <span className="text-[9px] text-red-400 font-medium">Cr{'\u00ed'}tica</span>
                    )}
                    <span className="text-[9px] font-medium" style={{ color: statusColor }}>
                      {statusOpt?.label}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// =============================================================================
// Today Marker
// =============================================================================

function TodayMarker({ selectedYear }: { selectedYear: number }) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const year = today.getFullYear();

  if (year !== selectedYear) return null;

  const pos = getYearPosition(todayStr, selectedYear) * 100;

  return (
    <div
      className="absolute top-0 bottom-0 z-30 pointer-events-none"
      style={{ left: `${pos}%` }}
    >
      <div className="w-px h-full bg-[#00E5A0]/40 relative">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#00E5A0]/20 border border-[#00E5A0]/40 rounded text-[8px] sm:text-[9px] text-[#00E5A0] font-bold whitespace-nowrap">
          Hoje
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main Timeline Page
// =============================================================================

export default function TimelinePage() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [popoverTask, setPopoverTask] = useState<{ taskId: string; rect: { top: number; left: number; width: number; height: number } } | null>(null);
  const overallProgress = useMemo(() => computeOverallProgress(), []);

  // Use context for live task data instead of static import
  const { tasks, updateTask, addTask } = useProject();

  const activeFilterCount = countActiveFilters(filters);

  // Apply filters to tasks
  const filteredTasks = useMemo(() => {
    if (activeFilterCount === 0) return tasks;
    return applyFilters(tasks, filters);
  }, [tasks, filters, activeFilterCount]);

  // Resolve the popover task
  const popoverTaskData = useMemo(() => {
    if (!popoverTask) return null;
    return tasks.find((t) => t.id === popoverTask.taskId) ?? null;
  }, [popoverTask, tasks]);

  const quarters = YEAR_QUARTERS[selectedYear];

  const orderedDepartments = DEPT_ORDER.map((id) => departments.find((d) => d.id === id)!).filter(
    Boolean
  );

  // Handler for quick status change
  const handleQuickStatusChange = useCallback(
    (taskId: string, status: TaskStatus) => {
      updateTask(taskId, { status });
    },
    [updateTask]
  );

  // Handler for task bar click - show popover
  const handleTaskBarClick = useCallback(
    (taskId: string, rect: { top: number; left: number; width: number; height: number }) => {
      setPopoverTask({ taskId, rect });
    },
    []
  );

  // Handler for opening edit modal from popover
  const handleOpenEditModal = useCallback((taskId: string) => {
    setEditingTaskId(taskId);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ================================================================= */}
      {/* HEADER WITH COUNTDOWN                                             */}
      {/* ================================================================= */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Decorative glows */}
        <div className="absolute -top-20 left-1/4 w-96 h-64 bg-[#00B4D8]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-1/4 w-64 h-48 bg-[#00E5A0]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative rounded-2xl bg-[#061742]/60 border border-white/5 p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left side: Title and progress */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/10 flex items-center justify-center">
                  <Calendar size={20} className="text-[#00B4D8]" />
                </div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
                  >
                    Cronograma Master
                  </motion.h1>
                  <p className="text-xs sm:text-sm text-white/40">
                    Encomenda Tecnol{'\u00f3'}gica ETEC - Santa Catarina
                  </p>
                </div>
              </div>

              {/* Overall progress */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#00E5A0]" />
                  <span className="text-xs text-white/50">Progresso geral:</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 sm:w-48 h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${overallProgress}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-[#00B4D8] to-[#00E5A0]"
                    />
                  </div>
                  <span className="text-sm font-bold text-[#00E5A0] tabular-nums">
                    {overallProgress}%
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Countdown + Action Buttons */}
            <div className="lg:text-right space-y-2">
              <div className="flex items-center gap-2 lg:justify-end">
                <Target size={14} className="text-[#00B4D8]" />
                <span className="text-xs text-white/40">
                  Assinatura Contrato ETEC - {formatDateBR(ETEC_CONTRACT_DATE)}
                </span>
              </div>
              <CountdownDisplay />
            </div>
          </div>
        </div>
      </motion.header>

      {/* ================================================================= */}
      {/* ACTION BAR: Year selector, Filter toggle, Add Task                */}
      {/* ================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <YearTabs selectedYear={selectedYear} onYearChange={setSelectedYear} />

        <div className="flex items-center gap-2">
          {/* Filter toggle button */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`
              relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold
              transition-all duration-200 border
              ${
                filtersOpen || activeFilterCount > 0
                  ? 'bg-[#00B4D8]/10 border-[#00B4D8]/30 text-[#00B4D8]'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70 hover:bg-white/10'
              }
            `}
          >
            <Filter size={14} />
            Filtros
            {activeFilterCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#00B4D8] text-white text-[10px] font-bold"
              >
                {activeFilterCount}
              </motion.span>
            )}
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Add Task button */}
          <div className="relative">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`
                inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold
                transition-all duration-200 border
                ${
                  showAddForm
                    ? 'bg-[#00E5A0]/10 border-[#00E5A0]/30 text-[#00E5A0]'
                    : 'bg-[#00E5A0]/10 border-[#00E5A0]/20 text-[#00E5A0] hover:bg-[#00E5A0]/20 hover:border-[#00E5A0]/40'
                }
              `}
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Nova Tarefa</span>
            </button>

            <AnimatePresence>
              {showAddForm && (
                <AddTaskForm
                  onAdd={addTask}
                  onClose={() => setShowAddForm(false)}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Info hint */}
          <div className="hidden lg:flex items-center gap-1.5 ml-2">
            <Info size={12} className="text-white/30" />
            <span className="text-[10px] text-white/30">
              Clique nas barras para alterar status
            </span>
          </div>
        </div>
      </motion.section>

      {/* ================================================================= */}
      {/* FILTER PANEL (collapsible)                                        */}
      {/* ================================================================= */}
      <AnimatePresence>
        {filtersOpen && (
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            allTasks={tasks}
          />
        )}
      </AnimatePresence>

      {/* Active filter summary (when collapsed but filters active) */}
      <AnimatePresence>
        {!filtersOpen && activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-white/30 font-medium">Filtros ativos:</span>
              {filters.statuses.map((s) => {
                const opt = STATUS_OPTIONS.find((o) => o.value === s);
                return (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border"
                    style={{
                      backgroundColor: opt?.bg ?? 'transparent',
                      borderColor: (opt?.color ?? '#fff') + '40',
                      color: opt?.color ?? '#fff',
                    }}
                  >
                    {opt?.label}
                    <button
                      onClick={() => setFilters((f) => ({ ...f, statuses: f.statuses.filter((v) => v !== s) }))}
                      className="ml-0.5 hover:opacity-70"
                    >
                      <X size={10} />
                    </button>
                  </span>
                );
              })}
              {filters.priorities.map((p) => {
                const opt = PRIORITY_OPTIONS.find((o) => o.value === p);
                return (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border"
                    style={{
                      backgroundColor: (opt?.color ?? '#fff') + '20',
                      borderColor: (opt?.color ?? '#fff') + '40',
                      color: opt?.color ?? '#fff',
                    }}
                  >
                    {opt?.label}
                    <button
                      onClick={() => setFilters((f) => ({ ...f, priorities: f.priorities.filter((v) => v !== p) }))}
                      className="ml-0.5 hover:opacity-70"
                    >
                      <X size={10} />
                    </button>
                  </span>
                );
              })}
              {filters.departments.map((d) => {
                const opt = DEPARTMENT_OPTIONS.find((o) => o.value === d);
                const dept = departments.find((dep) => dep.id === d);
                return (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border"
                    style={{
                      backgroundColor: (dept?.color ?? '#fff') + '20',
                      borderColor: (dept?.color ?? '#fff') + '40',
                      color: dept?.color ?? '#fff',
                    }}
                  >
                    {opt?.label}
                    <button
                      onClick={() => setFilters((f) => ({ ...f, departments: f.departments.filter((v) => v !== d) }))}
                      className="ml-0.5 hover:opacity-70"
                    >
                      <X size={10} />
                    </button>
                  </span>
                );
              })}
              {filters.assignees.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border border-[#00B4D8]/30 bg-[#00B4D8]/10 text-[#00B4D8]"
                >
                  {PEOPLE_MAP[a] ?? a}
                  <button
                    onClick={() => setFilters((f) => ({ ...f, assignees: f.assignees.filter((v) => v !== a) }))}
                    className="ml-0.5 hover:opacity-70"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="text-[10px] text-red-400/70 hover:text-red-400 font-medium transition-colors ml-1"
              >
                Limpar todos
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* PHASE BANDS                                                       */}
      {/* ================================================================= */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Fases do Projeto
          </span>
        </div>

        {/* Quarter header labels */}
        <div className="flex">
          <div className="w-36 sm:w-44 lg:w-52 shrink-0" />
          <div className="flex-1 flex">
            {quarters.map((q) => (
              <div key={q.label} className="flex-1 text-center">
                <span className="text-xs sm:text-sm font-semibold text-white/50">
                  {q.label}
                </span>
                <div className="text-[9px] sm:text-[10px] text-white/25 mt-0.5">
                  {getMonthLabel(q.start)} - {getMonthLabel(q.end)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase bands with quarter grid overlay */}
        <div className="flex">
          <div className="w-36 sm:w-44 lg:w-52 shrink-0 flex items-center px-3">
            <span className="text-[10px] sm:text-xs text-white/30 font-medium">Fases</span>
          </div>
          <div className="flex-1 relative">
            <PhaseBands selectedYear={selectedYear} />
            {/* Quarter dividers */}
            <div className="absolute inset-0 flex pointer-events-none">
              {quarters.map((q, i) => (
                <div key={q.label} className={`flex-1 ${i < 3 ? 'border-r border-white/5' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ================================================================= */}
      {/* MILESTONES ROW                                                    */}
      {/* ================================================================= */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Diamond size={12} className="text-[#00B4D8]" />
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Marcos do Projeto
          </span>
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rotate-45 bg-red-500/80 border border-red-400" />
              <span className="text-[10px] text-white/30">Cr{'\u00ed'}tico</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rotate-45 bg-[#00B4D8]/60 border border-[#00B4D8]" />
              <span className="text-[10px] text-white/30">Regular</span>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-36 sm:w-44 lg:w-52 shrink-0 flex items-center px-3">
            <span className="text-[10px] sm:text-xs text-white/30 font-medium">Marcos</span>
          </div>
          <div className="flex-1 relative">
            <MilestonesRow selectedYear={selectedYear} />
            {/* Quarter dividers */}
            <div className="absolute inset-0 flex pointer-events-none">
              {quarters.map((q, i) => (
                <div key={q.label} className={`flex-1 ${i < 3 ? 'border-r border-white/5' : ''}`} />
              ))}
            </div>
            <TodayMarker selectedYear={selectedYear} />
          </div>
        </div>
      </motion.section>

      {/* ================================================================= */}
      {/* TIMELINE GRID                                                     */}
      {/* ================================================================= */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-[#00E5A0]" />
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Tarefas por Departamento
            </span>
            {activeFilterCount > 0 && (
              <span className="text-[10px] text-[#00B4D8] font-medium ml-2">
                ({filteredTasks.length} de {tasks.length} tarefas)
              </span>
            )}
          </div>
        </div>

        {/* Column headers */}
        <div className="flex">
          <div className="w-36 sm:w-44 lg:w-52 shrink-0 px-3">
            <span className="text-[10px] sm:text-xs text-white/30 font-medium">Departamento</span>
          </div>
          <div className="flex-1 flex">
            {quarters.map((q) => (
              <div key={q.label} className="flex-1 text-center">
                <span className="text-[10px] sm:text-xs font-medium text-white/30">{q.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department rows */}
        <div className="space-y-1 rounded-xl bg-white/[0.01] border border-white/5 p-2 relative">
          {orderedDepartments.map((dept, idx) => (
            <TimelineGridRow
              key={dept.id}
              department={dept}
              selectedYear={selectedYear}
              index={idx}
              allTasks={filteredTasks}
              onTaskClick={handleTaskBarClick}
            />
          ))}

          {/* Today marker overlaid on the grid */}
          <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: '0', right: '0' }}>
            <div className="flex h-full">
              <div className="w-36 sm:w-44 lg:w-52 shrink-0" />
              <div className="flex-1 relative">
                <TodayMarker selectedYear={selectedYear} />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ================================================================= */}
      {/* PHASE DETAIL SUMMARY                                              */}
      {/* ================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {phases.map((phase) => (
          <motion.div
            key={phase.id}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="rounded-xl border border-white/5 p-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${PHASE_BG_COLORS[phase.number]}, transparent)`,
            }}
          >
            {/* Phase color accent */}
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{ backgroundColor: PHASE_COLORS[phase.number] }}
            />

            <div className="pl-3">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: PHASE_COLORS[phase.number] }}
                >
                  Fase {phase.number}
                </span>
                <span
                  className={`
                    text-[9px] px-1.5 py-0.5 rounded-full font-medium
                    ${
                      phase.status === 'em_andamento'
                        ? 'bg-[#00B4D8]/20 text-[#00B4D8]'
                        : phase.status === 'concluida'
                        ? 'bg-[#00E5A0]/20 text-[#00E5A0]'
                        : 'bg-white/10 text-white/40'
                    }
                  `}
                >
                  {phase.status === 'em_andamento'
                    ? 'Em andamento'
                    : phase.status === 'concluida'
                    ? 'Conclu\u00edda'
                    : phase.status === 'atrasada'
                    ? 'Atrasada'
                    : 'Planejada'}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white mb-1">{phase.title}</h3>

              <div className="flex items-center gap-2 text-[10px] text-white/40 mb-3">
                <span>{formatDateBR(phase.startDate)}</span>
                <ChevronRight size={10} />
                <span>{formatDateBR(phase.endDate)}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.progress}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: PHASE_COLORS[phase.number] }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-white/30">Progresso</span>
                <span
                  className="text-[10px] font-bold tabular-nums"
                  style={{ color: PHASE_COLORS[phase.number] }}
                >
                  {phase.progress}%
                </span>
              </div>

              {phase.budgetBRL != null && (
                <div className="mt-2 text-[10px] text-white/25">
                  Or{'\u00e7'}amento: R$ {(phase.budgetBRL / 1000).toFixed(0)}k
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* ================================================================= */}
      {/* LEGEND                                                            */}
      {/* ================================================================= */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="rounded-xl bg-[#061742]/40 border border-white/5 p-4"
      >
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-3">
          Legenda
        </span>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {orderedDepartments.map((dept) => (
            <div key={dept.id} className="flex items-center gap-2">
              <div
                className="w-3 h-2 rounded-sm"
                style={{ backgroundColor: dept.color }}
              />
              <span className="text-[10px] sm:text-xs text-white/50">
                {DEPT_SHORT_LABELS[dept.id] ?? dept.name}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 rounded-sm ring-1 ring-red-500/60 bg-white/10" />
            <span className="text-[10px] sm:text-xs text-white/50">Prioridade Cr{'\u00ed'}tica</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-px h-4 bg-[#00E5A0]/40" />
            <span className="text-[10px] sm:text-xs text-white/50">Hoje</span>
          </div>
          {/* Status legend */}
          {STATUS_OPTIONS.map((opt) => (
            <div key={opt.value} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: opt.color }}
              />
              <span className="text-[10px] sm:text-xs text-white/50">{opt.label}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Bottom spacer */}
      <div className="h-4" />

      {/* ================================================================= */}
      {/* QUICK STATUS POPOVER                                              */}
      {/* ================================================================= */}
      <AnimatePresence>
        {popoverTask && popoverTaskData && (
          <QuickStatusPopover
            task={popoverTaskData}
            anchorRect={popoverTask.rect}
            onStatusChange={handleQuickStatusChange}
            onOpenEditModal={handleOpenEditModal}
            onClose={() => setPopoverTask(null)}
          />
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* TASK EDIT MODAL                                                   */}
      {/* ================================================================= */}
      <TaskEditModal
        taskId={editingTaskId}
        onClose={() => setEditingTaskId(null)}
      />
    </div>
  );
}
