'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  FlaskConical,
  ShieldCheck,
  Rocket,
  ChevronDown,
  CheckCircle2,
  Circle,
  Loader2,
} from 'lucide-react';
import type { Phase, PhaseStatus } from '../data/types';

interface PhaseTrackerProps {
  phases?: Phase[];
  currentPhaseId?: string;
}

const defaultPhases: Phase[] = [
  {
    id: 'phase-0',
    number: 0,
    title: 'Alinhamento e Imersao',
    description:
      'Definicao do escopo, alinhamento estrategico, levantamento de requisitos e imersao no contexto institucional do IBEF.',
    status: 'em_andamento',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    progress: 75,
    deliverables: [
      'Kick-off institucional',
      'Mapeamento de stakeholders',
      'Definicao de objetivos estrategicos',
      'Aprovacao do plano de projeto',
    ],
    budgetBRL: null,
  },
  {
    id: 'phase-1',
    number: 1,
    title: 'Prova de Conceito (PoC)',
    description:
      'Desenvolvimento da prova de conceito tecnica, validacao de viabilidade e testes iniciais com dados reais.',
    status: 'planejada',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    progress: 0,
    deliverables: [
      'Prototipo funcional',
      'Validacao tecnica',
      'Teste com dados reais',
      'Relatorio de viabilidade',
    ],
    budgetBRL: null,
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Piloto Controlado',
    description:
      'Implementacao piloto em ambiente controlado, testes com usuarios reais e refinamento baseado em feedback.',
    status: 'planejada',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    progress: 0,
    deliverables: [
      'Deploy em ambiente de teste',
      'Onboarding de usuarios piloto',
      'Coleta de metricas',
      'Iteracao baseada em feedback',
    ],
    budgetBRL: null,
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Validacao e Transferencia',
    description:
      'Validacao final, documentacao completa, treinamento e transferencia operacional para a equipe IBEF.',
    status: 'planejada',
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    progress: 0,
    deliverables: [
      'Validacao com diretoria',
      'Documentacao completa',
      'Treinamento da equipe',
      'Go-live e transferencia',
    ],
    budgetBRL: null,
  },
];

const phaseIcons = [Compass, FlaskConical, ShieldCheck, Rocket];

/** Map TRL ranges to each phase number */
const phaseTRL: Record<number, [number, number]> = {
  0: [1, 2],
  1: [3, 4],
  2: [5, 7],
  3: [8, 9],
};

const statusConfig: Record<
  PhaseStatus,
  { color: string; bg: string; icon: React.ElementType; label: string }
> = {
  planejada: {
    color: 'text-white/40',
    bg: 'bg-white/5',
    icon: Circle,
    label: 'Planejada',
  },
  em_andamento: {
    color: 'text-[#00B4D8]',
    bg: 'bg-[#00B4D8]/10',
    icon: Loader2,
    label: 'Em andamento',
  },
  concluida: {
    color: 'text-[#00E5A0]',
    bg: 'bg-[#00E5A0]/10',
    icon: CheckCircle2,
    label: 'Concluida',
  },
  atrasada: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    icon: Circle,
    label: 'Atrasada',
  },
};

function TRLBadge({ level }: { level: number }) {
  const getColor = (trl: number) => {
    if (trl <= 2) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (trl <= 4) return 'bg-[#00B4D8]/20 text-[#90E0EF] border-[#00B4D8]/30';
    if (trl <= 7) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-[#00E5A0]/20 text-[#00E5A0] border-[#00E5A0]/30';
  };

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${getColor(level)}`}
    >
      TRL {level}
    </span>
  );
}

function PhaseCard({
  phase,
  index,
  isActive,
}: {
  phase: Phase;
  index: number;
  isActive: boolean;
}) {
  const [expanded, setExpanded] = useState(isActive);
  const Icon = phaseIcons[index] ?? Compass;
  const status = statusConfig[phase.status];
  const StatusIcon = status.icon;
  const trl = phaseTRL[phase.number] ?? [1, 9];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`
        relative rounded-xl border transition-all duration-300
        ${
          isActive
            ? 'bg-gradient-to-r from-[#0A2463] to-[#0A2463]/80 border-[#00B4D8]/40 shadow-lg shadow-[#00B4D8]/10'
            : phase.status === 'concluida'
              ? 'bg-[#0A2463]/40 border-[#00E5A0]/20'
              : 'bg-[#0A2463]/20 border-white/5'
        }
      `}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 sm:p-5"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Phase icon */}
          <div
            className={`
            shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
            ${
              isActive
                ? 'bg-[#00B4D8]/20 text-[#00B4D8]'
                : phase.status === 'concluida'
                  ? 'bg-[#00E5A0]/15 text-[#00E5A0]'
                  : 'bg-white/5 text-white/30'
            }
          `}
          >
            <Icon size={20} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-mono font-bold ${isActive ? 'text-[#00B4D8]' : 'text-white/40'}`}
              >
                FASE {phase.number}
              </span>
              <div className="flex gap-1">
                <TRLBadge level={trl[0]} />
                <span className="text-white/20 text-[10px]">-</span>
                <TRLBadge level={trl[1]} />
              </div>
            </div>

            {/* Title */}
            <h3
              className={`text-sm sm:text-base font-semibold mt-1 ${
                isActive
                  ? 'text-white'
                  : phase.status === 'concluida'
                    ? 'text-white/80'
                    : 'text-white/50'
              }`}
            >
              {phase.title}
            </h3>

            {/* Status and progress */}
            <div className="flex items-center gap-3 mt-2">
              <div className={`flex items-center gap-1 ${status.color}`}>
                <StatusIcon
                  size={12}
                  className={
                    phase.status === 'em_andamento' ? 'animate-spin' : ''
                  }
                />
                <span className="text-xs">{status.label}</span>
              </div>
              <span
                className={`text-xs font-mono ${isActive ? 'text-[#00B4D8]' : 'text-white/30'}`}
              >
                {phase.progress}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-2.5 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${phase.progress}%` }}
                transition={{
                  duration: 1.2,
                  ease: 'easeOut',
                  delay: index * 0.15,
                }}
                className={`h-full rounded-full ${
                  phase.status === 'concluida'
                    ? 'bg-gradient-to-r from-[#00E5A0]/80 to-[#00E5A0]'
                    : phase.status === 'atrasada'
                      ? 'bg-gradient-to-r from-red-400/80 to-red-400'
                      : 'bg-gradient-to-r from-[#00B4D8]/80 to-[#00B4D8]'
                }`}
              />
            </div>
          </div>

          {/* Expand chevron */}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 mt-1"
          >
            <ChevronDown size={16} className="text-white/30" />
          </motion.div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
              <div className="border-t border-white/5 pt-3">
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
                  {phase.description}
                </p>

                {/* Deliverables */}
                {phase.deliverables.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                      Entregas
                    </p>
                    {phase.deliverables.map((deliverable, i) => {
                      const deliverableCompleted =
                        phase.status === 'concluida' ||
                        (phase.status === 'em_andamento' &&
                          i <
                            Math.floor(
                              (phase.progress / 100) *
                                phase.deliverables.length,
                            ));
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              deliverableCompleted
                                ? 'bg-[#00E5A0]'
                                : 'bg-white/20'
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              deliverableCompleted
                                ? 'text-white/70 line-through'
                                : 'text-white/40'
                            }`}
                          >
                            {deliverable}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Dates and budget */}
                <div className="mt-3 flex gap-4 text-[10px] text-white/30 flex-wrap">
                  <span>Inicio: {phase.startDate}</span>
                  <span>Fim: {phase.endDate}</span>
                  {phase.budgetBRL != null && (
                    <span>
                      Orcamento: R${' '}
                      {phase.budgetBRL.toLocaleString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PhaseTracker({
  phases = defaultPhases,
  currentPhaseId,
}: PhaseTrackerProps) {
  const activeIndex =
    currentPhaseId != null
      ? phases.findIndex((p) => p.id === currentPhaseId)
      : phases.findIndex((p) => p.status === 'em_andamento');

  // Overall progress
  const overallProgress = Math.round(
    phases.reduce((sum, p) => sum + p.progress, 0) / phases.length,
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Fases ETEC
          </h2>
          <p className="text-xs sm:text-sm text-white/40 mt-0.5">
            Technology Readiness Level 1-9
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#00B4D8]">
            {overallProgress}%
          </p>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">
            Progresso geral
          </p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mb-6">
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#00B4D8] via-[#00E5A0] to-[#00E5A0]"
          />
        </div>
        {/* TRL scale */}
        <div className="flex justify-between mt-1.5">
          {Array.from({ length: 9 }, (_, i) => (
            <span
              key={i}
              className={`text-[9px] font-mono ${i < 2 ? 'text-[#00B4D8]/60' : 'text-white/20'}`}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline connector + Phase cards */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[27px] sm:left-[29px] top-6 bottom-6 w-px bg-white/10" />

        <div className="space-y-3">
          {phases.map((phase, index) => (
            <div key={phase.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-[22px] sm:left-[24px] top-7 z-10">
                <div
                  className={`w-[11px] h-[11px] rounded-full border-2 ${
                    phase.status === 'concluida'
                      ? 'bg-[#00E5A0] border-[#00E5A0]/50'
                      : phase.status === 'em_andamento'
                        ? 'bg-[#00B4D8] border-[#00B4D8]/50'
                        : phase.status === 'atrasada'
                          ? 'bg-red-400 border-red-400/50'
                          : 'bg-white/10 border-white/20'
                  }`}
                />
                {phase.status === 'em_andamento' && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-[#00B4D8]/50"
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Card with left margin for timeline */}
              <div className="ml-12 sm:ml-14">
                <PhaseCard
                  phase={phase}
                  index={index}
                  isActive={index === activeIndex}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
