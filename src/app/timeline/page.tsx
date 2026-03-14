'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Clock,
  Diamond,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Target,
  TrendingUp,
  Info,
} from 'lucide-react';

import { phases, milestones, departments } from '../../data/projectData';
import type { Task, Department, Phase, Milestone } from '../../data/types';
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
  onTaskClick: (taskId: string) => void;
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
              onClick={() => onTaskClick(task.id)}
            >
              {/* Progress fill */}
              <div
                className="absolute inset-0 rounded-md opacity-30"
                style={{
                  width: `${task.progress}%`,
                  backgroundColor: department.color,
                }}
              />
              {/* Task label -- always shown with ellipsis */}
              <span className="absolute inset-0 flex items-center px-1.5 text-[9px] sm:text-[10px] text-white/90 font-medium truncate pointer-events-none">
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
  const overallProgress = useMemo(() => computeOverallProgress(), []);

  // Use context for live task data instead of static import
  const { tasks } = useProject();

  const quarters = YEAR_QUARTERS[selectedYear];

  const orderedDepartments = DEPT_ORDER.map((id) => departments.find((d) => d.id === id)!).filter(
    Boolean
  );

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

            {/* Right side: Countdown */}
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
      {/* YEAR SELECTOR                                                     */}
      {/* ================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <YearTabs selectedYear={selectedYear} onYearChange={setSelectedYear} />

        {/* Quarter legend */}
        <div className="flex items-center gap-1.5">
          <Info size={12} className="text-white/30" />
          <span className="text-[10px] sm:text-xs text-white/30">
            Clique nos anos para navegar | Clique nas barras para editar tarefas
          </span>
        </div>
      </motion.section>

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
        <div className="flex items-center gap-2 mb-1">
          <Clock size={12} className="text-[#00E5A0]" />
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Tarefas por Departamento
          </span>
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
              allTasks={tasks}
              onTaskClick={(taskId) => setEditingTaskId(taskId)}
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
        </div>
      </motion.section>

      {/* Bottom spacer */}
      <div className="h-4" />

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
