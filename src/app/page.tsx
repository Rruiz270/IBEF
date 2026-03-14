'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  Flame,
  CalendarDays,
  TrendingUp,
} from 'lucide-react';

import {
  phases,
  departments,
  tasks,
  people,
  countdowns,
  getDashboardSummary,
  daysUntil,
  computeOverallProgress,
} from '../data/projectData';

import type { UrgencyLevel } from '../data/types';

import CountdownCard from '../components/CountdownCard';
import PhaseTracker from '../components/PhaseTracker';
import DepartmentProgress from '../components/DepartmentProgress';

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
// Summary Card Component
// ---------------------------------------------------------------------------

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  index: number;
}

function SummaryCard({ title, value, icon: Icon, gradient, index }: SummaryCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`
        relative overflow-hidden rounded-2xl p-5 sm:p-6
        bg-gradient-to-br ${gradient}
        border border-white/5 shadow-xl
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
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const summary = useMemo(() => getDashboardSummary(), []);
  const overallProgress = useMemo(() => computeOverallProgress(), []);
  const today = useMemo(() => new Date(), []);

  const summaryCards: SummaryCardProps[] = [
    {
      title: 'Total Tarefas',
      value: summary.totalTasks,
      icon: ListChecks,
      gradient: 'from-[#0A2463] to-[#0A2463]/70',
      index: 0,
    },
    {
      title: 'Concluidas',
      value: summary.completedTasks,
      icon: CheckCircle2,
      gradient: 'from-[#0A2463] via-[#0A2463] to-[#00E5A0]/20',
      index: 1,
    },
    {
      title: 'Atrasadas',
      value: summary.overdueTasks,
      icon: AlertTriangle,
      gradient: 'from-[#0A2463] via-[#0A2463] to-amber-900/30',
      index: 2,
    },
    {
      title: 'Tarefas Criticas',
      value: summary.criticalTasks,
      icon: Flame,
      gradient: 'from-[#0A2463] via-[#0A2463] to-red-900/30',
      index: 3,
    },
  ];

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
              IBEF Project Control
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-sm sm:text-base text-white/50 mt-1"
            >
              Instituto Brasileiro pela Educacao do Futuro — Encomenda Tecnologica SC
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
      {/* SUMMARY CARDS                                                     */}
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
              Datas criticas do projeto ETEC
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
              Acompanhamento das areas do projeto
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
              Ponderado pelo orcamento de cada fase
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
            {/* Shine effect */}
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

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
}
