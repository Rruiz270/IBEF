'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  Flame,
  CalendarDays,
  TrendingUp,
  Download,
  History,
} from 'lucide-react';

import {
  phases,
  departments,
  countdowns,
  getDashboardSummary,
  daysUntil,
  computeOverallProgress,
  people as projectPeople,
} from '@/data/projectData';

import { useProject } from '@/contexts/ProjectContext';
import TaskEditModal from '@/components/TaskEditModal';

import type { UrgencyLevel } from '@/data/types';

import CountdownCard from '@/components/CountdownCard';
import PhaseTracker from '@/components/PhaseTracker';
import DepartmentProgress from '@/components/DepartmentProgress';

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDatePtBR(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getUrgencyForDays(days: number): UrgencyLevel {
  if (days <= 3) return 'critical';
  if (days <= 7) return 'high';
  if (days <= 14) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// Summary Card Component (now clickable)
// ---------------------------------------------------------------------------

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  index: number;
  onClick?: () => void;
}

function SummaryCard({ title, value, icon: Icon, gradient, index, onClick }: SummaryCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-5 sm:p-6
        bg-gradient-to-br ${gradient}
        border border-white/5 shadow-xl
        ${onClick ? 'cursor-pointer hover:border-white/15 transition-colors' : ''}
      `}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-white/60 uppercase tracking-wider">
            {title}
          </p>
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
            className="text-3xl sm:text-4xl font-bold text-white mt-2 tabular-nums"
          >
            {value}
          </motion.p>
        </div>
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon size={22} className="text-white/80" />
        </div>
      </div>
      {onClick && (
        <p className="text-[10px] text-white/30 mt-2">Clique para filtrar</p>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { tasks, activityLog, teamPeople: people } = useProject();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const router = useRouter();

  const summary = useMemo(() => getDashboardSummary(), []);
  const overallProgress = useMemo(() => computeOverallProgress(), []);
  const today = useMemo(() => new Date(), []);

  // Dynamic counts from live task data
  const liveSummary = useMemo(() => {
    const now = new Date();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'concluida').length;
    const overdue = tasks.filter((t) => {
      if (!t.dueDate || t.status === 'concluida' || t.status === 'cancelada') return false;
      return new Date(t.dueDate + 'T23:59:59') < now;
    }).length;
    const critical = tasks.filter(
      (t) => t.priority === 'critica' && t.status !== 'concluida' && t.status !== 'cancelada'
    ).length;
    return { total, completed, overdue, critical };
  }, [tasks]);

  const summaryCards: SummaryCardProps[] = [
    {
      title: 'Total Tarefas',
      value: liveSummary.total,
      icon: ListChecks,
      gradient: 'from-[#0A2463] to-[#0A2463]/70',
      index: 0,
      onClick: () => router.push('/workstreams?filter=todas'),
    },
    {
      title: 'Concluídas',
      value: liveSummary.completed,
      icon: CheckCircle2,
      gradient: 'from-[#0A2463] via-[#0A2463] to-[#00E5A0]/20',
      index: 1,
      onClick: () => router.push('/workstreams?filter=concluida'),
    },
    {
      title: 'Atrasadas',
      value: liveSummary.overdue,
      icon: AlertTriangle,
      gradient: 'from-[#0A2463] via-[#0A2463] to-amber-900/30',
      index: 2,
      onClick: () => router.push('/workstreams?filter=atrasada'),
    },
    {
      title: 'Tarefas Críticas',
      value: liveSummary.critical,
      icon: Flame,
      gradient: 'from-[#0A2463] via-[#0A2463] to-red-900/30',
      index: 3,
      onClick: () => router.push('/workstreams?filter=critica'),
    },
  ];

  // Build people lookup map
  const peopleMap = useMemo(() =>
    Object.fromEntries(projectPeople.map((p) => [p.id, p.name])),
    []
  );

  // Attention required: overdue + critical tasks (max 8)
  const attentionTasks = useMemo(() => {
    const now = new Date();
    const items: { taskId: string; title: string; assigneeNames: string[]; type: 'overdue' | 'critical'; daysOverdue: number; dueDate: string | null; departmentId: string }[] = [];

    tasks.forEach((t) => {
      if (t.status === 'concluida' || t.status === 'cancelada') return;
      const names = t.assigneeIds.map((id) => peopleMap[id] ?? id);
      const isOverdue = t.dueDate && new Date(t.dueDate + 'T23:59:59') < now;
      const isCritical = t.priority === 'critica';

      if (isOverdue) {
        const daysOver = Math.floor((now.getTime() - new Date(t.dueDate! + 'T23:59:59').getTime()) / 86400000);
        items.push({ taskId: t.id, title: t.title, assigneeNames: names, type: 'overdue', daysOverdue: daysOver, dueDate: t.dueDate, departmentId: t.departmentId });
      } else if (isCritical) {
        items.push({ taskId: t.id, title: t.title, assigneeNames: names, type: 'critical', daysOverdue: 0, dueDate: t.dueDate, departmentId: t.departmentId });
      }
    });

    // Sort: overdue first (by days overdue desc), then critical
    items.sort((a, b) => {
      if (a.type === 'overdue' && b.type !== 'overdue') return -1;
      if (a.type !== 'overdue' && b.type === 'overdue') return 1;
      return b.daysOverdue - a.daysOverdue;
    });

    return items.slice(0, 8);
  }, [tasks, peopleMap]);

  // Recent activity (last 10)
  const recentActivity = activityLog.slice(0, 10);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* ================================================================= */}
      {/* HEADER                                                            */}
      {/* ================================================================= */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Decorative background glow */}
        <div className="absolute -top-20 left-1/4 w-96 h-64 bg-[#00B4D8]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-1/4 w-64 h-48 bg-[#00E5A0]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
            >
              i10 Project Control
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-sm sm:text-base text-white/50 mt-1"
            >
              Instituto i10 — Educação do Futuro — Encomenda Tecnológica SC
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 text-white/40"
          >
            <CalendarDays size={16} />
            <span className="text-sm capitalize">{formatDatePtBR(today)}</span>
          </motion.div>
        </div>

        {/* Separator */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </motion.header>

      {/* ================================================================= */}
      {/* SUMMARY CARDS (now clickable)                                     */}
      {/* ================================================================= */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </motion.section>

      {/* ================================================================= */}
      {/* ATENÇÃO REQUERIDA                                                 */}
      {/* ================================================================= */}
      {attentionTasks.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle size={16} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Atenção Requerida
              </h2>
              <p className="text-xs text-white/40">
                Tarefas atrasadas e críticas que precisam de ação imediata
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#061742]/60 border border-white/5 overflow-hidden divide-y divide-white/[0.04]">
            {attentionTasks.map((item) => (
              <button
                key={item.taskId}
                onClick={() => setEditingTaskId(item.taskId)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left"
              >
                {/* Urgency badge */}
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  item.type === 'overdue'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    : 'bg-red-500/15 text-red-400 border border-red-500/20'
                }`}>
                  {item.type === 'overdue' ? 'Atrasada' : 'Crítica'}
                </span>

                {/* Task title */}
                <span className="flex-1 min-w-0 text-sm text-white/80 truncate font-medium">
                  {item.title}
                </span>

                {/* Assignee pills */}
                {item.assigneeNames.length > 0 && (
                  <div className="hidden sm:flex items-center gap-1 shrink-0">
                    {item.assigneeNames.slice(0, 2).map((name) => (
                      <span
                        key={name}
                        className="px-2 py-0.5 rounded-full bg-[#00B4D8]/10 text-[10px] text-[#00B4D8] font-medium whitespace-nowrap"
                      >
                        {name.split(' ')[0]}
                      </span>
                    ))}
                    {item.assigneeNames.length > 2 && (
                      <span className="text-[10px] text-white/30">
                        +{item.assigneeNames.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Days info */}
                <span className="shrink-0 text-[11px] text-white/30 whitespace-nowrap">
                  {item.type === 'overdue'
                    ? `${item.daysOverdue}d atrasada`
                    : item.dueDate
                      ? new Date(item.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                      : 'Sem prazo'
                  }
                </span>
              </button>
            ))}
          </div>
        </motion.section>
      )}

      {/* ================================================================= */}
      {/* COUNTDOWN SECTION                                                 */}
      {/* ================================================================= */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#00B4D8]/10 flex items-center justify-center">
            <Flame size={16} className="text-[#00B4D8]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Prazos e Contagens Regressivas
            </h2>
            <p className="text-xs text-white/40">
              Datas críticas do projeto ETEC
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {countdowns.map((cd) => {
            const days = daysUntil(cd.targetDate);
            const urgency: UrgencyLevel = getUrgencyForDays(days);
            return (
              <CountdownCard
                key={cd.id}
                targetDate={cd.targetDate}
                title={cd.label}
                subtitle={cd.context}
                urgency={urgency}
              />
            );
          })}
        </div>
      </motion.section>

      {/* ================================================================= */}
      {/* PHASE TRACKER                                                     */}
      {/* ================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="rounded-2xl bg-[#061742]/60 border border-white/5 p-5 sm:p-6 lg:p-8"
      >
        <PhaseTracker phases={phases} />
      </motion.section>

      {/* ================================================================= */}
      {/* DEPARTMENT PROGRESS                                               */}
      {/* ================================================================= */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#00E5A0]/10 flex items-center justify-center">
            <TrendingUp size={16} className="text-[#00E5A0]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Progresso por Departamento
            </h2>
            <p className="text-xs text-white/40">
              Acompanhamento das áreas do projeto
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {departments.map((dept, idx) => (
            <DepartmentProgress
              key={dept.id}
              department={dept}
              tasks={tasks}
              people={people}
              index={idx}
            />
          ))}
        </div>
      </motion.section>

      {/* ================================================================= */}
      {/* OVERALL PROGRESS BAR                                              */}
      {/* ================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="rounded-2xl bg-[#061742]/60 border border-white/5 p-5 sm:p-6 lg:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Progresso Geral do Projeto
            </h2>
            <p className="text-xs text-white/40">
              Ponderado pelo orçamento de cada fase
            </p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
            className="text-right"
          >
            <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#00B4D8] to-[#00E5A0] bg-clip-text text-transparent tabular-nums">
              {overallProgress}%
            </span>
          </motion.div>
        </div>

        {/* Large progress bar */}
        <div className="w-full h-4 sm:h-5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-[#00B4D8] via-[#00B4D8] to-[#00E5A0] relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        {/* Phase breakdown below the bar */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4">
          {phases.map((phase) => (
            <div key={phase.id} className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  phase.status === 'concluida'
                    ? 'bg-[#00E5A0]'
                    : phase.status === 'em_andamento'
                      ? 'bg-[#00B4D8]'
                      : 'bg-white/20'
                }`}
              />
              <span className="text-xs text-white/50">
                Fase {phase.number}: {phase.progress}%
              </span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ================================================================= */}
      {/* RECENT ACTIVITY LOG                                               */}
      {/* ================================================================= */}
      {recentActivity.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="rounded-2xl bg-[#061742]/60 border border-white/5 p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <History size={16} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Atividade Recente</h2>
              <p className="text-xs text-white/40">Últimas alterações no projeto</p>
            </div>
          </div>

          <div className="space-y-2">
            {recentActivity.map((entry) => {
              const actionLabels: Record<string, string> = {
                created: 'criou',
                updated: 'atualizou',
                deleted: 'excluiu',
                status_changed: 'alterou status de',
              };
              const actionColors: Record<string, string> = {
                created: 'text-emerald-400',
                updated: 'text-cyan-400',
                deleted: 'text-red-400',
                status_changed: 'text-amber-400',
              };
              const timeAgo = getTimeAgo(entry.timestamp);

              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className={`text-xs font-medium mt-0.5 ${actionColors[entry.action] ?? 'text-white/50'}`}>
                    {actionLabels[entry.action] ?? entry.action}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70 truncate">
                      <span className="font-semibold">{entry.entityTitle}</span>
                      {entry.field && entry.action === 'status_changed' && (
                        <span className="text-white/40">
                          {' '}{entry.oldValue} → {entry.newValue}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-[10px] text-white/30 shrink-0">{timeAgo}</span>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Bottom spacer */}
      <div className="h-4" />

      {/* Task Edit Modal */}
      <TaskEditModal taskId={editingTaskId} onClose={() => setEditingTaskId(null)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Time ago helper
// ---------------------------------------------------------------------------

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `${diffMin}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  return then.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}
