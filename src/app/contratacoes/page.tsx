'use client';

import { motion } from 'framer-motion';
import {
  UserPlus,
  Building2,
  Briefcase,
  CalendarDays,
  AlertTriangle,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  Clock,
  CheckCircle2,
  Users,
  Timer,
} from 'lucide-react';
import { hiring, companies, departments, daysUntil } from '../../data/projectData';
import type { HiringStatus, TaskPriority, DepartmentId } from '../../data/types';

// ---------------------------------------------------------------------------
// Configuração de badges de status
// ---------------------------------------------------------------------------

const statusConfig: Record<
  HiringStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  aberta: {
    label: 'Aberta',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  em_selecao: {
    label: 'Em Seleção',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    dot: 'bg-blue-400',
  },
  oferta_enviada: {
    label: 'Oferta Enviada',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
  },
  contratado: {
    label: 'Contratado',
    bg: 'bg-teal-500/15',
    text: 'text-teal-400',
    dot: 'bg-teal-400',
  },
  cancelada: {
    label: 'Cancelada',
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
};

// ---------------------------------------------------------------------------
// Configuração de prioridade
// ---------------------------------------------------------------------------

const priorityConfig: Record<
  TaskPriority,
  { label: string; color: string; icon: React.ElementType }
> = {
  critica: { label: 'Crítica', color: 'text-red-400', icon: AlertTriangle },
  alta: { label: 'Alta', color: 'text-amber-400', icon: ArrowUpCircle },
  media: { label: 'Média', color: 'text-blue-400', icon: ArrowRightCircle },
  baixa: { label: 'Baixa', color: 'text-white/40', icon: ArrowDownCircle },
};

// ---------------------------------------------------------------------------
// Configuração de tipo de empresa
// ---------------------------------------------------------------------------

const companyTypeLabels: Record<string, { label: string; bg: string; text: string }> = {
  tech: {
    label: 'Tecnologia',
    bg: 'bg-[#00E5A0]/15',
    text: 'text-[#00E5A0]',
  },
  administrative: {
    label: 'Administrativo',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
  },
  accounting: {
    label: 'Contabilidade',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
  },
  consulting: {
    label: 'Consultoria',
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
  },
  educational: {
    label: 'Educacional',
    bg: 'bg-pink-500/15',
    text: 'text-pink-400',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDepartmentName(deptId: DepartmentId): string {
  const dept = departments.find((d) => d.id === deptId);
  return dept?.name ?? deptId;
}

function getDepartmentColor(deptId: DepartmentId): string {
  const dept = departments.find((d) => d.id === deptId);
  return dept?.color ?? '#6B7280';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Retorna as classes de cor de urgência baseadas nos dias restantes.
 * Vermelho se < 7 dias, âmbar se < 14 dias, verde caso contrário.
 */
function getUrgencyClasses(days: number): { text: string; bg: string; dot: string } {
  if (days < 7) {
    return { text: 'text-red-400', bg: 'bg-red-500/15', dot: 'bg-red-400' };
  }
  if (days < 14) {
    return { text: 'text-amber-400', bg: 'bg-amber-500/15', dot: 'bg-amber-400' };
  }
  return { text: 'text-emerald-400', bg: 'bg-emerald-500/15', dot: 'bg-emerald-400' };
}

// ---------------------------------------------------------------------------
// Estatísticas resumidas
// ---------------------------------------------------------------------------

const totalVagas = hiring.length;
const vagasAbertas = hiring.filter((p) => p.status === 'aberta').length;
const vagasPreenchidas = hiring.filter((p) => p.status === 'contratado').length;
const vagasUrgentes = hiring.filter((p) => {
  if (!p.deadlineDate) return false;
  const days = daysUntil(p.deadlineDate);
  return days >= 0 && days < 30;
}).length;

const summaryCards = [
  {
    label: 'Total de Vagas',
    value: totalVagas,
    icon: Users,
    color: 'text-[#00B4D8]',
    bg: 'bg-[#00B4D8]/15',
  },
  {
    label: 'Vagas Abertas',
    value: vagasAbertas,
    icon: Briefcase,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
  },
  {
    label: 'Vagas Urgentes',
    value: vagasUrgentes,
    icon: Timer,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
  },
  {
    label: 'Vagas Preenchidas',
    value: vagasPreenchidas,
    icon: CheckCircle2,
    color: 'text-teal-400',
    bg: 'bg-teal-500/15',
  },
];

// ---------------------------------------------------------------------------
// Variantes de animação
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

// ---------------------------------------------------------------------------
// Componente da Página
// ---------------------------------------------------------------------------

export default function ContratacoesPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Cabeçalho da página */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/15 flex items-center justify-center">
            <UserPlus size={20} className="text-[#00B4D8]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Contratações e Associados
            </h1>
            <p className="text-sm text-white/50">
              Vagas abertas, prazos de contratação e empresas parceiras do IBEF
            </p>
          </div>
        </div>
      </motion.div>

      {/* =================================================================
          SEÇÃO 0: Resumo Estatístico
          ================================================================= */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={itemVariants}
                className="rounded-xl bg-[#0A2463]/60 border border-white/5 p-4 sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}
                  >
                    <Icon size={18} className={card.color} />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40 font-medium">
                      {card.label}
                    </p>
                    <p className={`text-xl font-bold ${card.color}`}>
                      {card.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* =================================================================
          SEÇÃO 1: Vagas e Prazos de Contratação
          ================================================================= */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Briefcase size={16} className="text-[#00E5A0]" />
          </div>
          <h2 className="text-lg font-bold text-white">Vagas e Prazos de Contratação</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">
            {hiring.length}
          </span>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {hiring.map((position) => {
            const sCfg = statusConfig[position.status];
            const pCfg = priorityConfig[position.priority];
            const PriorityIcon = pCfg.icon;
            const deptColor = getDepartmentColor(position.departmentId);
            const deptName = getDepartmentName(position.departmentId);

            const hasDeadline = !!position.deadlineDate;
            const deadlineDays = hasDeadline ? daysUntil(position.deadlineDate!) : null;
            const urgency = deadlineDays !== null ? getUrgencyClasses(deadlineDays) : null;

            return (
              <motion.div
                key={position.id}
                variants={itemVariants}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="relative rounded-xl overflow-hidden bg-[#0A2463]/60 border border-white/5 hover:border-white/10 hover:shadow-lg transition-all duration-200"
              >
                {/* Barra de acento superior com cor do departamento */}
                <div className="h-1" style={{ backgroundColor: deptColor }} />

                <div className="p-4 sm:p-5 space-y-3">
                  {/* Título e prioridade */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {position.title}
                    </h3>
                    <div className={`flex items-center gap-1 shrink-0 ${pCfg.color}`}>
                      <PriorityIcon size={14} />
                      <span className="text-[10px] font-semibold">
                        {pCfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Departamento */}
                  <p
                    className="text-[11px] font-medium"
                    style={{ color: deptColor }}
                  >
                    {deptName}
                  </p>

                  {/* Badges: status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sCfg.bg} ${sCfg.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                      {sCfg.label}
                    </span>
                  </div>

                  {/* Descrição */}
                  <p className="text-[11px] text-white/40 leading-relaxed line-clamp-3">
                    {position.description}
                  </p>

                  {/* Prazo para Contratar e Contagem Regressiva */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    {/* Data de abertura */}
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={12} className="text-white/25" />
                      <span className="text-[10px] text-white/35">
                        Aberta em {formatDate(position.openedAt)}
                      </span>
                    </div>

                    {/* Prazo para contratar */}
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className={hasDeadline && urgency ? urgency.text : 'text-white/25'} />
                      {hasDeadline ? (
                        <span className="text-[10px] text-white/50">
                          Prazo para Contratar:{' '}
                          <span className="font-semibold text-white/70">
                            {formatDate(position.deadlineDate!)}
                          </span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/30 italic">
                          Sem prazo definido
                        </span>
                      )}
                    </div>

                    {/* Contagem regressiva com indicador de urgência */}
                    {hasDeadline && deadlineDays !== null && urgency && (
                      <div
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold ${urgency.bg} ${urgency.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot}`} />
                        {deadlineDays > 0
                          ? `${deadlineDays} dia${deadlineDays !== 1 ? 's' : ''} restante${deadlineDays !== 1 ? 's' : ''}`
                          : deadlineDays === 0
                            ? 'Prazo vence hoje!'
                            : `Atrasado por ${Math.abs(deadlineDays)} dia${Math.abs(deadlineDays) !== 1 ? 's' : ''}`}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* =================================================================
          SEÇÃO 2: Empresas Associadas
          ================================================================= */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Building2 size={16} className="text-[#00B4D8]" />
          </div>
          <h2 className="text-lg font-bold text-white">Empresas Associadas</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">
            {companies.length}
          </span>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {companies.map((company) => {
            const typeCfg = companyTypeLabels[company.type] ?? {
              label: company.type,
              bg: 'bg-white/10',
              text: 'text-white/60',
            };

            return (
              <motion.div
                key={company.id}
                variants={itemVariants}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="relative rounded-xl overflow-hidden bg-[#0A2463]/60 border border-white/5 hover:border-white/10 hover:shadow-lg transition-all duration-200"
              >
                <div className="p-4 sm:p-5 space-y-3">
                  {/* Nome e tipo */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {company.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${typeCfg.bg} ${typeCfg.text}`}
                    >
                      {typeCfg.label}
                    </span>
                  </div>

                  {/* Descrição */}
                  <p className="text-[11px] text-white/40 leading-relaxed line-clamp-3">
                    {company.description}
                  </p>

                  {/* Departamentos vinculados */}
                  {company.departmentIds.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/5">
                      {company.departmentIds.map((deptId) => (
                        <span
                          key={deptId}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 text-white/50"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: getDepartmentColor(deptId) }}
                          />
                          {getDepartmentName(deptId)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>
    </div>
  );
}
