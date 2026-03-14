'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  DollarSign,
  Flame,
  GraduationCap,
  Layers,
  Lightbulb,
  Rocket,
  Shield,
  Target,
  Users,
  Zap,
  AlertTriangle,
  Ban,
} from 'lucide-react';

import { useProject } from '@/contexts/ProjectContext';
import TaskEditModal from '@/components/TaskEditModal';
import {
  departments,
  people,
  milestones,
  daysUntil,
} from '@/data/projectData';
import type { Task } from '@/data/types';

/* ============================================
   Constantes
   ============================================ */

const CONTRACT_DATE = new Date('2026-07-15T00:00:00');

const phases = [
  {
    id: 0,
    title: 'Alinhamento e Imers\u00e3o',
    period: 'Abr - Mai 2026',
    budget: 'R$ 465.000',
    status: 'Pr\u00f3xima',
    statusColor: 'text-[#90E0EF]',
    borderColor: 'border-[#90E0EF]/30',
    bgColor: 'bg-[#90E0EF]/5',
    progress: 0,
    description:
      'Defini\u00e7\u00e3o da governan\u00e7a, alinhamento de expectativas com SED/SC e imers\u00e3o completa no ambiente educacional catarinense.',
    icon: Target,
  },
  {
    id: 1,
    title: 'Prova de Conceito',
    period: 'Mai - Set 2026',
    budget: 'R$ 930.000',
    status: 'Planejada',
    statusColor: 'text-[#00B4D8]',
    borderColor: 'border-[#00B4D8]/30',
    bgColor: 'bg-[#00B4D8]/5',
    progress: 0,
    description:
      'Desenvolvimento do MVP da plataforma educacional com IA, testada em escolas selecionadas de Santa Catarina.',
    icon: Lightbulb,
  },
  {
    id: 2,
    title: 'Piloto Controlado',
    period: 'Out 2026 - Jun 2027',
    budget: 'R$ 1.860.000',
    status: 'Planejada',
    statusColor: 'text-[#00E5A0]',
    borderColor: 'border-[#00E5A0]/30',
    bgColor: 'bg-[#00E5A0]/5',
    progress: 0,
    description:
      'Expans\u00e3o do piloto para m\u00faltiplas escolas, coleta de dados e refinamento cont\u00ednuo dos algoritmos de IA.',
    icon: Rocket,
  },
  {
    id: 3,
    title: 'Valida\u00e7\u00e3o e Transfer\u00eancia',
    period: 'Jul 2027 - Mar 2028',
    budget: 'R$ 1.395.000',
    status: 'Planejada',
    statusColor: 'text-[#CAF0F8]',
    borderColor: 'border-[#CAF0F8]/30',
    bgColor: 'bg-[#CAF0F8]/5',
    progress: 0,
    description:
      'Valida\u00e7\u00e3o final dos resultados, documenta\u00e7\u00e3o completa e transfer\u00eancia de tecnologia ao estado de Santa Catarina.',
    icon: Shield,
  },
];

const teamMembers = [
  { name: 'Raphael Ruiz', role: 'Project Leader', initials: 'RR', color: 'from-[#00B4D8] to-[#0A2463]' },
  { name: 'Bruno Almeida', role: 'Tecnologia', initials: 'BA', color: 'from-[#00E5A0] to-[#00B4D8]' },
  { name: 'Bruno Quick', role: 'Rela\u00e7\u00f5es P\u00fablicas', initials: 'BQ', color: 'from-[#90E0EF] to-[#0A2463]' },
  { name: 'Mercia', role: 'Jur\u00eddico', initials: 'ME', color: 'from-[#00B4D8] to-[#00E5A0]' },
  { name: 'Emerson', role: 'Jur\u00eddico', initials: 'EM', color: 'from-[#0A2463] to-[#00B4D8]' },
  { name: 'Gustavo', role: 'Opera\u00e7\u00f5es', initials: 'GU', color: 'from-[#00E5A0] to-[#0A2463]' },
  { name: 'Enio', role: 'Admin / Financeiro', initials: 'EN', color: 'from-[#90E0EF] to-[#00E5A0]' },
];

const partners = [
  { name: 'Jinso', description: 'Desenvolvimento de Software' },
  { name: 'Sprix', description: 'Tecnologia Educacional' },
  { name: 'MadeinWEB', description: 'Desenvolvimento Web' },
  { name: 'Gestorial', description: 'Gest\u00e3o e Consultoria' },
];

/* ============================================
   Status helpers
   ============================================ */

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  nao_iniciada: { label: 'N\u00e3o Iniciada', color: 'text-gray-400', bg: 'bg-gray-500/20', icon: Circle },
  em_andamento: { label: 'Em Andamento', color: 'text-cyan-400', bg: 'bg-cyan-500/20', icon: Clock },
  concluida: { label: 'Conclu\u00edda', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: CheckCircle2 },
  bloqueada: { label: 'Bloqueada', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: Ban },
  atrasada: { label: 'Atrasada', color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle },
};

const PRIORITY_COLORS: Record<string, string> = {
  critica: 'bg-red-500',
  alta: 'bg-amber-500',
  media: 'bg-blue-500',
  baixa: 'bg-gray-500',
};

function getPersonName(id: string): string {
  return people.find((p) => p.id === id)?.name ?? id;
}

function getDeptName(id: string): string {
  return departments.find((d) => d.id === id)?.name ?? id;
}

function getDeptColor(id: string): string {
  return departments.find((d) => d.id === id)?.color ?? '#6B7280';
}

function formatDateBR(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function daysRemaining(dueDate: string | null): number | null {
  if (!dueDate) return null;
  const target = new Date(dueDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/* ============================================
   Anima\u00e7\u00f5es reutiliz\u00e1veis
   ============================================ */

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

/* ============================================
   Componente de Countdown
   ============================================ */

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculate() {
      const now = new Date();
      const diff = CONTRACT_DATE.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, []);

  const blocks = [
    { value: timeLeft.days, label: 'Dias' },
    { value: timeLeft.hours, label: 'Horas' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Seg' },
  ];

  return (
    <div className="flex gap-3 sm:gap-4">
      {blocks.map((b) => (
        <div key={b.label} className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-b from-[#00B4D8]/20 to-[#00E5A0]/10 rounded-xl blur-sm" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl bg-[#0A1E3D] border border-[#142D5C]">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent tabular-nums">
                {String(b.value).padStart(2, '0')}
              </span>
            </div>
          </div>
          <span className="mt-2 text-xs sm:text-sm text-[#8BA3C7] font-medium">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================
   Task Card for Landing Page (clickable)
   ============================================ */

function LandingTaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const status = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.nao_iniciada;
  const StatusIcon = status.icon;
  const days = daysRemaining(task.dueDate);
  const priorityColor = PRIORITY_COLORS[task.priority] ?? 'bg-gray-500';
  const deptColor = getDeptColor(task.departmentId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className="relative rounded-xl border border-[#142D5C] bg-[#0A1E3D]/80 p-5 hover:border-[#1E3F73] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-pointer"
    >
      {/* Department color accent */}
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ backgroundColor: deptColor }} />

      {/* Header: title + status */}
      <div className="flex items-start justify-between gap-3 mb-3 pl-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white">{task.title}</h4>
          <p className="text-xs text-[#8BA3C7] mt-0.5">{getDeptName(task.departmentId)}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${status.bg} ${status.color}`}>
          <StatusIcon size={12} />
          {status.label}
        </span>
      </div>

      {/* Row: Assignees + Due date */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8BA3C7] mb-3 pl-3">
        {task.assigneeIds.length > 0 && (
          <span className="flex items-center gap-1">
            <Users size={12} />
            {task.assigneeIds.map(getPersonName).join(', ')}
          </span>
        )}
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDateBR(task.dueDate)}
            {days !== null && (
              <span className={`ml-1 font-medium ${days < 0 ? 'text-red-400' : days <= 7 ? 'text-amber-400' : 'text-[#8BA3C7]'}`}>
                ({days < 0 ? `${Math.abs(days)}d atrasada` : days === 0 ? 'Hoje' : `${days}d`})
              </span>
            )}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="pl-3">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5A7499]">Progresso</span>
            {/* Priority indicator */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: task.priority === 'critica' ? 4 : task.priority === 'alta' ? 3 : task.priority === 'media' ? 2 : 1 }).map((_, i) => (
                <span key={i} className={`w-1.5 h-1.5 rounded-full ${priorityColor}`} />
              ))}
            </div>
          </div>
          <span className="text-xs font-medium text-white/70">{task.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#142D5C] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: task.progress === 100
                ? '#10B981'
                : task.progress > 0
                  ? `linear-gradient(90deg, ${deptColor}, ${deptColor}80)`
                  : '#374151',
            }}
            initial={{ width: 0 }}
            whileInView={{ width: `${task.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Dependencies */}
      {task.dependencies.length > 0 && (
        <div className="mt-2 pl-3">
          <span className="text-[10px] text-[#5A7499]">
            Depende de: {task.dependencies.join('; ')}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/* ============================================
   Milestone Timeline Component
   ============================================ */

function MilestoneTimeline() {
  const upcomingMilestones = milestones
    .filter((m) => m.status !== 'concluido')
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 6);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#00B4D8]/40 via-[#00E5A0]/30 to-[#142D5C]" />

      <div className="space-y-4">
        {upcomingMilestones.map((milestone, i) => {
          const days = daysUntil(milestone.targetDate);
          const isPast = days < 0;
          const isUrgent = days >= 0 && days <= 7;

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative pl-10 sm:pl-14"
            >
              {/* Dot */}
              <div className={`absolute left-2.5 sm:left-4.5 top-2 w-3 h-3 rounded-full border-2 ${
                milestone.isCritical
                  ? 'border-red-400 bg-red-500/30'
                  : isPast
                    ? 'border-amber-400 bg-amber-500/30'
                    : 'border-[#00B4D8] bg-[#00B4D8]/30'
              }`} />

              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white truncate">{milestone.title}</h4>
                    {milestone.isCritical && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium shrink-0">
                        Cr&iacute;tico
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-[#8BA3C7]">{formatDateBR(milestone.targetDate)}</p>
                  <p className={`text-[10px] font-medium ${
                    isPast ? 'text-red-400' : isUrgent ? 'text-amber-400' : 'text-[#5A7499]'
                  }`}>
                    {isPast ? `${Math.abs(days)}d atrasado` : days === 0 ? 'Hoje' : `${days}d restantes`}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================
   Department Progress Cards
   ============================================ */

function DepartmentProgressGrid({ tasks }: { tasks: Task[] }) {
  const deptProgress = departments.map((dept) => {
    const deptTasks = tasks.filter((t) => t.departmentId === dept.id);
    const total = deptTasks.length;
    const completed = deptTasks.filter((t) => t.status === 'concluida').length;
    const inProgress = deptTasks.filter((t) => t.status === 'em_andamento').length;
    const progress = total > 0 ? Math.round(deptTasks.reduce((s, t) => s + t.progress, 0) / total) : 0;
    return { dept, total, completed, inProgress, progress };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {deptProgress.map(({ dept, total, completed, inProgress, progress }, i) => (
        <motion.div
          key={dept.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="relative rounded-xl border border-[#142D5C] bg-[#0A1E3D]/80 p-5 hover:border-[#1E3F73] transition-all duration-300 overflow-hidden"
        >
          {/* Color accent */}
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: dept.color }} />

          <h4 className="text-sm font-semibold text-white mb-2">{dept.name}</h4>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 text-xs text-[#8BA3C7]">
              <span>{completed}/{total} tarefas</span>
              {inProgress > 0 && (
                <span className="text-cyan-400">{inProgress} em andamento</span>
              )}
            </div>
            <span className="text-sm font-bold tabular-nums" style={{ color: dept.color }}>
              {progress}%
            </span>
          </div>

          <div className="h-1.5 rounded-full bg-[#142D5C] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: dept.color }}
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================
   Componente Principal - Landing Page
   ============================================ */

export default function LandingPage() {
  const { tasks } = useProject();

  // Task edit modal state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Get critical and upcoming tasks sorted by priority then due date
  const keyTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== 'concluida' && t.status !== 'cancelada')
      .sort((a, b) => {
        const priorityOrder: Record<string, number> = { critica: 0, alta: 1, media: 2, baixa: 3 };
        const pDiff = (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9);
        if (pDiff !== 0) return pDiff;
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      });
  }, [tasks]);

  // Summary stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'concluida').length;
    const inProgress = tasks.filter((t) => t.status === 'em_andamento').length;
    const critical = tasks.filter((t) => t.priority === 'critica' && t.status !== 'concluida' && t.status !== 'cancelada').length;
    const overdue = tasks.filter((t) => {
      if (!t.dueDate || t.status === 'concluida' || t.status === 'cancelada') return false;
      return new Date(t.dueDate + 'T23:59:59') < new Date();
    }).length;
    return { total, completed, inProgress, critical, overdue };
  }, [tasks]);

  return (
    <div className="relative overflow-x-hidden">
      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
        {/* Background decorative orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#00B4D8]/[0.04] blur-[100px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#00E5A0]/[0.03] blur-[120px]" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#0A2463]/30 blur-[80px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,180,216,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' as const }}
        >
          {/* Badge */}
          <motion.div
            className="mb-8 px-4 py-1.5 rounded-full border border-[#00B4D8]/20 bg-[#00B4D8]/5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-xs sm:text-sm text-[#90E0EF] font-medium tracking-wide">
              {'Encomenda Tecnol\u00f3gica \u2014 Santa Catarina'}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <span className="bg-gradient-to-r from-[#00B4D8] via-[#00E5A0] to-[#00B4D8] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
              IBEF
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-4 text-lg sm:text-xl md:text-2xl text-[#90E0EF] font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Instituto Brasileiro pela Educa\u00e7\u00e3o do Futuro
          </motion.p>

          {/* Tagline */}
          <motion.p
            className="mt-6 text-sm sm:text-base md:text-lg text-[#8BA3C7] max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Transformando a educa\u00e7\u00e3o p\u00fablica brasileira atrav\u00e9s da tecnologia e inova\u00e7\u00e3o
          </motion.p>

          {/* Countdown */}
          <motion.div
            className="mt-12 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-sm text-[#8BA3C7] font-medium uppercase tracking-widest">
              Dias at\u00e9 a assinatura do contrato ETEC
            </p>
            <CountdownTimer />
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base
                         bg-gradient-to-r from-[#00B4D8] to-[#00E5A0] text-[#030B1A]
                         hover:shadow-[0_0_30px_rgba(0,180,216,0.3)] transition-shadow duration-300"
            >
              Acessar Painel de Controle
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
          >
            <ChevronRight size={24} className="rotate-90 text-[#5A7499]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========== SOBRE O PROJETO ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00E5A0]/20 bg-[#00E5A0]/5 mb-6">
              <BookOpen size={14} className="text-[#00E5A0]" />
              <span className="text-xs text-[#00E5A0] font-medium uppercase tracking-wider">Sobre o Projeto</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              Encomenda Tecnol\u00f3gica
              <br />
              <span className="bg-gradient-to-r from-[#00B4D8] to-[#00E5A0] bg-clip-text text-transparent">
                Santa Catarina
              </span>
            </h2>
            <p className="mt-6 text-[#8BA3C7] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Parceria estrat\u00e9gica com a Secretaria de Estado da Educa\u00e7\u00e3o de Santa Catarina (SED/SC)
              para o desenvolvimento de uma plataforma educacional potencializada por Intelig\u00eancia Artificial,
              com o objetivo de personalizar a aprendizagem e elevar os indicadores educacionais do estado.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            {...staggerContainer}
          >
            {[
              { icon: Layers, value: '4 Fases', label: 'de desenvolvimento', color: '#00B4D8' },
              { icon: DollarSign, value: 'R$ 4.65M', label: 'Investimento', color: '#00E5A0' },
              { icon: Calendar, value: '24 Meses', label: 'de Projeto', color: '#90E0EF' },
              { icon: Building2, value: '7', label: 'Departamentos', color: '#CAF0F8' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                {...staggerItem}
                className="group relative rounded-2xl border border-[#142D5C] bg-[#0A1E3D]/80 p-6 sm:p-8 text-center
                           hover:border-[#1E3F73] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300"
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                  style={{ backgroundColor: `${stat.color}10` }}
                >
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-[#8BA3C7]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== ATIVIDADES CHAVE - KEY ACTIVITIES ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#142D5C] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#0A2463]/40 blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00B4D8]/20 bg-[#00B4D8]/5 mb-6">
              <Flame size={14} className="text-[#00B4D8]" />
              <span className="text-xs text-[#00B4D8] font-medium uppercase tracking-wider">Atividades do Projeto</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Atividades Chave
            </h2>
            <p className="mt-4 text-[#8BA3C7] text-base sm:text-lg max-w-2xl mx-auto">
              Tarefas cr\u00edticas e de alta prioridade com prazos, respons\u00e1veis e progresso atualizado.
            </p>
          </motion.div>

          {/* Task Summary Stats */}
          <motion.div
            {...fadeInUp}
            className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10"
          >
            {[
              { label: 'Total', value: stats.total, color: '#90E0EF' },
              { label: 'Em Andamento', value: stats.inProgress, color: '#00B4D8' },
              { label: 'Conclu\u00eddas', value: stats.completed, color: '#00E5A0' },
              { label: 'Cr\u00edticas', value: stats.critical, color: '#EF4444' },
              { label: 'Atrasadas', value: stats.overdue, color: '#F59E0B' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[#142D5C] bg-[#0A1E3D]/80 p-4 text-center"
              >
                <p className="text-[10px] uppercase tracking-wider text-[#5A7499] mb-1">{item.label}</p>
                <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Task list and Milestones side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Cards - 2/3 width */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-semibold text-[#8BA3C7] uppercase tracking-wider mb-4">
                Tarefas Pendentes (por prioridade)
              </h3>
              {keyTasks.map((task) => (
                <LandingTaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setEditingTaskId(task.id)}
                />
              ))}
            </div>

            {/* Milestones Timeline - 1/3 width */}
            <div>
              <h3 className="text-sm font-semibold text-[#8BA3C7] uppercase tracking-wider mb-4">
                Pr\u00f3ximos Marcos
              </h3>
              <div className="rounded-xl border border-[#142D5C] bg-[#0A1E3D]/80 p-5">
                <MilestoneTimeline />
              </div>

              {/* CTA to full workstreams */}
              <Link
                href="/workstreams"
                className="mt-4 group flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/5
                           text-sm font-medium text-[#00B4D8] hover:bg-[#00B4D8]/10 transition-colors"
              >
                Ver Todas as Atividades
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/timeline"
                className="mt-3 group flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#00E5A0]/20 bg-[#00E5A0]/5
                           text-sm font-medium text-[#00E5A0] hover:bg-[#00E5A0]/10 transition-colors"
              >
                Ver Cronograma Master
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROGRESSO POR DEPARTAMENTO ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#142D5C] to-transparent" />

        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00E5A0]/20 bg-[#00E5A0]/5 mb-6">
              <Target size={14} className="text-[#00E5A0]" />
              <span className="text-xs text-[#00E5A0] font-medium uppercase tracking-wider">Departamentos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              {'Progresso por \u00c1rea'}
            </h2>
            <p className="mt-4 text-[#8BA3C7] text-base sm:text-lg max-w-2xl mx-auto">
              Acompanhamento da evolu\u00e7\u00e3o de cada departamento do projeto.
            </p>
          </motion.div>

          <DepartmentProgressGrid tasks={tasks} />
        </div>
      </section>

      {/* ========== FASES DO PROJETO ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#0A2463]/40 blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00B4D8]/20 bg-[#00B4D8]/5 mb-6">
              <Clock size={14} className="text-[#00B4D8]" />
              <span className="text-xs text-[#00B4D8] font-medium uppercase tracking-wider">Cronograma</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Fases do Projeto
            </h2>
            <p className="mt-4 text-[#8BA3C7] text-base sm:text-lg max-w-2xl mx-auto">
              Execu\u00e7\u00e3o planejada em quatro fases progressivas, cada uma com marcos e entregas definidos.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#00B4D8]/40 via-[#00E5A0]/30 to-[#142D5C]" />

            <div className="space-y-8 sm:space-y-12">
              {phases.map((phase, i) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative pl-12 sm:pl-20"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2 sm:left-6 top-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#142D5C] bg-[#0A1E3D] flex items-center justify-center z-10">
                    <div
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          phase.id === 0 ? '#90E0EF' : phase.id === 1 ? '#00B4D8' : phase.id === 2 ? '#00E5A0' : '#CAF0F8',
                      }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className={`rounded-2xl border ${phase.borderColor} ${phase.bgColor} p-6 sm:p-8
                                hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0A1E3D] border border-[#142D5C]">
                            <phase.icon size={20} className={phase.statusColor} />
                          </div>
                          <div>
                            <span className="text-xs text-[#5A7499] font-medium uppercase tracking-wider">
                              Fase {phase.id}
                            </span>
                            <h3 className="text-lg sm:text-xl font-bold text-white">{phase.title}</h3>
                          </div>
                        </div>
                        <p className="text-sm text-[#8BA3C7] leading-relaxed">{phase.description}</p>
                      </div>

                      <div className="flex flex-row sm:flex-col gap-4 sm:gap-2 sm:text-right sm:min-w-[160px]">
                        <div>
                          <p className="text-xs text-[#5A7499] uppercase tracking-wider">Per\u00edodo</p>
                          <p className="text-sm font-semibold text-white">{phase.period}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5A7499] uppercase tracking-wider">Or\u00e7amento</p>
                          <p className="text-sm font-semibold text-[#00E5A0]">{phase.budget}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5A7499] uppercase tracking-wider">Status</p>
                          <p className={`text-sm font-semibold ${phase.statusColor}`}>{phase.status}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[#5A7499]">Progresso</span>
                        <span className="text-xs text-[#5A7499]">{phase.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#142D5C] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#00B4D8] to-[#00E5A0]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${phase.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== EQUIPE ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00E5A0]/20 bg-[#00E5A0]/5 mb-6">
              <Users size={14} className="text-[#00E5A0]" />
              <span className="text-xs text-[#00E5A0] font-medium uppercase tracking-wider">Lideran\u00e7a</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Nossa Equipe
            </h2>
            <p className="mt-4 text-[#8BA3C7] text-base sm:text-lg max-w-2xl mx-auto">
              Profissionais dedicados a transformar o futuro da educa\u00e7\u00e3o brasileira.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            {...staggerContainer}
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                {...staggerItem}
                className="group relative rounded-2xl border border-[#142D5C] bg-[#0A1E3D]/80 p-6
                           hover:border-[#1E3F73] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300
                           flex flex-col items-center text-center"
              >
                {/* Avatar */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${member.color}
                                 flex items-center justify-center mb-4 shadow-lg
                                 group-hover:scale-105 transition-transform duration-300`}>
                  <span className="text-lg sm:text-xl font-bold text-white">{member.initials}</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white">{member.name}</h3>
                <p className="mt-1 text-xs sm:text-sm text-[#8BA3C7]">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== PARCEIROS ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#142D5C] to-transparent" />

        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00B4D8]/20 bg-[#00B4D8]/5 mb-6">
              <Zap size={14} className="text-[#00B4D8]" />
              <span className="text-xs text-[#00B4D8] font-medium uppercase tracking-wider">Parceiros</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Empresas Associadas
            </h2>
            <p className="mt-4 text-[#8BA3C7] text-base sm:text-lg max-w-2xl mx-auto">
              Empresas parceiras que contribuem com expertise e tecnologia para o sucesso do projeto.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            {...staggerContainer}
          >
            {partners.map((partner) => (
              <motion.div
                key={partner.name}
                {...staggerItem}
                className="group relative rounded-2xl border border-[#142D5C] bg-[#0A1E3D]/80 p-8
                           hover:border-[#00B4D8]/30 hover:shadow-[0_0_20px_rgba(0,180,216,0.08)]
                           transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0A2463] to-[#061742] border border-[#142D5C]
                                flex items-center justify-center mb-4 group-hover:border-[#00B4D8]/30 transition-colors">
                  <Building2 size={24} className="text-[#00B4D8] group-hover:text-[#00E5A0] transition-colors" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">{partner.name}</h3>
                <p className="mt-1 text-xs sm:text-sm text-[#8BA3C7]">{partner.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="relative py-16 px-4 sm:px-6 border-t border-[#142D5C]">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#00E5A0] flex items-center justify-center">
              <GraduationCap size={22} className="text-[#030B1A]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">IBEF</p>
              <p className="text-xs text-[#8BA3C7]">Project Control</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-[#8BA3C7]">
              {'IBEF \u2014 Instituto Brasileiro pela Educa\u00e7\u00e3o do Futuro'}
            </p>
            <p className="mt-1 text-xs text-[#5A7499]">
              Estabelecido em Santa Catarina
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[#00B4D8] hover:text-[#00E5A0] transition-colors font-medium"
          >
            Acessar Painel de Controle
            <ArrowRight size={16} />
          </Link>

          <p className="text-xs text-[#5A7499] mt-4">
            {`\u00A9 ${new Date().getFullYear()} IBEF. Todos os direitos reservados.`}
          </p>
        </div>
      </footer>

      {/* ========== TASK EDIT MODAL ========== */}
      <TaskEditModal
        taskId={editingTaskId}
        onClose={() => setEditingTaskId(null)}
      />
    </div>
  );
}
