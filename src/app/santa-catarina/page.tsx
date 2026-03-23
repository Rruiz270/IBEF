'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertTriangle,
  FileText,
  Gavel,
  Scale,
  Search,
  Handshake,
  PenTool,
  TrendingUp,
} from 'lucide-react';
import { departments, milestones, people } from '../../data/projectData';
import { useProject } from '../../contexts/ProjectContext';
import TaskEditModal from '../../components/TaskEditModal';
import type { Person } from '../../data/types';
import TaskCard from '../../components/TaskCard';
import CountdownCard from '../../components/CountdownCard';

// ---------------------------------------------------------------------------
// ETEC Process Steps
// ---------------------------------------------------------------------------

const etecSteps = [
  {
    number: 1,
    title: 'Planejamento e Diagnóstico',
    description:
      'Documento que justifica a necessidade da ETEC conforme diretrizes do TCU e Guia InovaGovSC.',
    icon: FileText,
    taskId: 'task-sc-01',
  },
  {
    number: 2,
    title: 'ETP (Estudo Técnico Preliminar)',
    description:
      'Detalhamento da viabilidade técnica e econômica da Encomenda Tecnológica.',
    icon: Search,
    taskId: 'task-sc-02',
  },
  {
    number: 3,
    title: 'Portaria da Comissão ETEC',
    description:
      'Publicação de Portaria oficial criando a comissão responsável pela condução do processo.',
    icon: Gavel,
    taskId: 'task-sc-03',
  },
  {
    number: 4,
    title: 'Termo de Referência',
    description:
      'Especificações técnicas, critérios de seleção da ICT e métricas de avaliação.',
    icon: PenTool,
    taskId: 'task-sc-04',
  },
  {
    number: 5,
    title: 'Parecer PGE/SC',
    description:
      'Submissão à Procuradoria Geral do Estado para parecer jurídico de conformidade.',
    icon: Scale,
    taskId: 'task-sc-05',
  },
  {
    number: 6,
    title: 'Chamamento/Seleção ICT',
    description:
      'Publicação do edital de chamamento público para seleção da Instituição Científica e Tecnológica.',
    icon: Handshake,
    taskId: 'task-sc-06',
  },
  {
    number: 7,
    title: 'Assinatura do Contrato',
    description:
      'Assinatura formal do contrato ETEC entre o Estado de SC e a ICT selecionada.',
    icon: CheckCircle2,
    taskId: 'task-sc-07',
  },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusLabel(status: string): string {
  switch (status) {
    case 'em_andamento':
      return 'Em Andamento';
    case 'concluida':
      return 'Concluída';
    case 'nao_iniciada':
      return 'Não Iniciada';
    default:
      return status;
  }
}

function statusColor(status: string): string {
  switch (status) {
    case 'em_andamento':
      return 'text-[#00B4D8]';
    case 'concluida':
      return 'text-[#00E5A0]';
    case 'nao_iniciada':
      return 'text-white/40';
    default:
      return 'text-white/40';
  }
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function SantaCatarinaPage() {
  const { tasks } = useProject();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Build people map
  const peopleMap = useMemo<Record<string, Person>>(() => {
    const map: Record<string, Person> = {};
    for (const p of people) {
      map[p.id] = p;
    }
    return map;
  }, []);

  // Filter SC tasks
  const scTasks = useMemo(
    () => tasks.filter((t) => t.departmentId === 'santa_catarina'),
    [tasks],
  );

  // Filter SC milestones
  const scMilestones = useMemo(
    () => milestones.filter((m) => m.departmentIds.includes('santa_catarina')),
    [],
  );

  // SC department data
  const scDept = useMemo(
    () => departments.find((d) => d.id === 'santa_catarina'),
    [],
  );

  // Progress stats
  const stats = useMemo(() => {
    const total = scTasks.length;
    const completed = scTasks.filter((t) => t.status === 'concluida').length;
    const inProgress = scTasks.filter((t) => t.status === 'em_andamento').length;
    const percentage =
      total > 0
        ? Math.round(
            scTasks.reduce((sum, t) => sum + t.progress, 0) / total,
          )
        : 0;
    return { total, completed, inProgress, percentage };
  }, [scTasks]);

  // Map task IDs to task status for timeline
  const taskMap = useMemo(() => {
    const map: Record<string, (typeof scTasks)[0]> = {};
    for (const t of scTasks) {
      map[t.id] = t;
    }
    return map;
  }, [scTasks]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center">
            <Building2 size={20} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Santa Catarina (SED/SC)
            </h1>
            <p className="text-sm text-white/50 mt-0.5">
              Acompanhamento das ações da Secretaria de Educação de SC para
              viabilizar a Encomenda Tecnológica — 37 CREs, 1.038 escolas, 550 mil alunos
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-2xl bg-gradient-to-br from-[#0A2463] to-[#8B5CF6]/20 border border-white/5 p-5 sm:p-6"
      >
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
          Visão Geral do Progresso
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total */}
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-[11px] text-white/40 mt-1">Total de Tarefas</p>
          </div>
          {/* Completed */}
          <div className="bg-[#00E5A0]/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#00E5A0]">
              {stats.completed}
            </p>
            <p className="text-[11px] text-white/40 mt-1">Concluídas</p>
          </div>
          {/* In Progress */}
          <div className="bg-[#00B4D8]/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#00B4D8]">
              {stats.inProgress}
            </p>
            <p className="text-[11px] text-white/40 mt-1">Em Andamento</p>
          </div>
          {/* Percentage */}
          <div className="bg-[#8B5CF6]/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#8B5CF6]">
              {stats.percentage}%
            </p>
            <p className="text-[11px] text-white/40 mt-1">Progresso Médio</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#00B4D8]"
            />
          </div>
        </div>
      </motion.div>

      {/* Key Milestones */}
      {scMilestones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
            Marcos Importantes de SC
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scMilestones.map((milestone) => (
              <CountdownCard
                key={milestone.id}
                targetDate={milestone.targetDate}
                title={milestone.title}
                subtitle={milestone.description}
                urgency={
                  milestone.isCritical
                    ? 'critical'
                    : milestone.status === 'em_andamento'
                      ? 'high'
                      : 'medium'
                }
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ETEC Process Steps Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
          Etapas do Processo ETEC
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {etecSteps.map((step) => {
              const task = taskMap[step.taskId];
              const StepIcon = step.icon;
              const isActive = task?.status === 'em_andamento';
              const isComplete = task?.status === 'concluida';
              const progress = task?.progress ?? 0;

              return (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="relative flex items-start gap-4 pl-0 cursor-pointer"
                  onClick={() => {
                    if (task) setEditingTaskId(task.id);
                  }}
                >
                  {/* Step circle */}
                  <div
                    className={`
                      relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0
                      border-2 transition-all duration-300
                      ${
                        isComplete
                          ? 'bg-[#00E5A0]/20 border-[#00E5A0]/40'
                          : isActive
                            ? 'bg-[#00B4D8]/20 border-[#00B4D8]/40'
                            : 'bg-white/5 border-white/10'
                      }
                    `}
                  >
                    {isComplete ? (
                      <CheckCircle2 size={18} className="text-[#00E5A0]" />
                    ) : isActive ? (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <PlayCircle size={18} className="text-[#00B4D8]" />
                      </motion.div>
                    ) : (
                      <StepIcon size={18} className="text-white/30" />
                    )}
                  </div>

                  {/* Step content */}
                  <div
                    className={`
                      flex-1 rounded-xl p-4 border transition-all duration-300
                      ${
                        isActive
                          ? 'bg-[#00B4D8]/5 border-[#00B4D8]/20'
                          : isComplete
                            ? 'bg-[#00E5A0]/5 border-[#00E5A0]/10'
                            : 'bg-[#0A2463]/40 border-white/5'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                              text-[10px] font-bold px-2 py-0.5 rounded-full
                              ${
                                isComplete
                                  ? 'bg-[#00E5A0]/20 text-[#00E5A0]'
                                  : isActive
                                    ? 'bg-[#00B4D8]/20 text-[#00B4D8]'
                                    : 'bg-white/10 text-white/40'
                              }
                            `}
                          >
                            Etapa {step.number}
                          </span>
                          {task && (
                            <span
                              className={`text-[10px] font-medium ${statusColor(task.status)}`}
                            >
                              {statusLabel(task.status)}
                            </span>
                          )}
                        </div>
                        <h3
                          className={`text-sm font-semibold mt-1 ${
                            isComplete
                              ? 'text-[#00E5A0]'
                              : isActive
                                ? 'text-white'
                                : 'text-white/60'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p className="text-xs text-white/40 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                      {task?.dueDate && (
                        <span className="text-[10px] text-white/30 shrink-0 mt-1">
                          {task.dueDate}
                        </span>
                      )}
                    </div>

                    {/* Progress bar for active steps */}
                    {isActive && progress > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full bg-[#00B4D8]/60"
                          />
                        </div>
                        <span className="text-[10px] text-[#00B4D8] font-medium">
                          {progress}%
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* All SC Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
          Todas as Tarefas de Santa Catarina
        </h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {scTasks.map((task) => (
            <motion.div key={task.id} variants={itemVariants}>
              <TaskCard
                task={task}
                people={peopleMap}
                onEdit={(taskId) => setEditingTaskId(taskId)}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Task Edit Modal */}
      <TaskEditModal taskId={editingTaskId} onClose={() => setEditingTaskId(null)} />
    </div>
  );
}
