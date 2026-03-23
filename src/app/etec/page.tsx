'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  FileText,
  Scale,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  Shield,
  Database,
  Layers,
  Brain,
  ArrowRightLeft,
  Settings,
  Building2,
} from 'lucide-react';
import { daysUntil, tasks as projectTasks, milestones } from '@/data/projectData';
import { useProject } from '@/contexts/ProjectContext';
import TaskEditModal from '@/components/TaskEditModal';

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

interface CommissionPhase {
  id: string;
  label: string;
  title: string;
  dayRange: string;
  description: string;
  taskId: string | null;
  status: 'pendente' | 'em_andamento' | 'concluida';
}

const commissionPhases: CommissionPhase[] = [
  {
    id: 'fase-a',
    label: 'A',
    title: 'Validacao do Diagnostico',
    dayRange: 'Dias 1-10',
    description: 'Validar diagnostico PD-SED-2025/001. 5 sistemas legados, IDEB 4.2, dropout 5.2%.',
    taskId: 'task-diagnostico-validacao',
    status: 'pendente',
  },
  {
    id: 'fase-b',
    label: 'B',
    title: 'Estudo Tecnico Preliminar (ETP)',
    dayRange: 'Dias 5-30',
    description: 'Mapa de riscos, avaliacao TRL, analise make-or-buy, 34 deliverables tecnicos.',
    taskId: 'task-etp-estudo-preliminar',
    status: 'pendente',
  },
  {
    id: 'fase-c',
    label: 'C',
    title: 'Pesquisa de Mercado e Precificacao',
    dayRange: 'Dias 15-35',
    description: 'RFI/consulta publica, precificacao Fase 1, benchmarking ETECs brasileiras.',
    taskId: 'task-pesquisa-mercado',
    status: 'pendente',
  },
  {
    id: 'fase-d',
    label: 'D',
    title: 'Minuta de Contrato ETEC',
    dayRange: 'Dias 30-45',
    description: 'Edital, Minuta de Contrato com Matriz de Risco, modelo de remuneracao Art. 29 \u00A71\u00BA Decreto 9.283.',
    taskId: 'task-minuta-contrato',
    status: 'pendente',
  },
];

const deliverableLayers = [
  {
    id: 'l1',
    label: 'L1',
    title: 'Acesso Unificado',
    icon: Shield,
    color: '#00B4D8',
    items: ['S01 \u2014 Portal de Acesso Unificado', 'S02 \u2014 Conectores de Sistemas Legados', 'S03 \u2014 Gestao de Identidade e Acesso'],
  },
  {
    id: 'l2',
    label: 'L2',
    title: 'Integridade de Dados',
    icon: Database,
    color: '#00E5A0',
    items: ['S04 \u2014 Data Lake Educacional', 'S05 \u2014 ETL e Qualidade de Dados', 'S06 \u2014 Governanca de Dados'],
  },
  {
    id: 'l3',
    label: 'L3',
    title: 'Integracao Ped-Adm',
    icon: Layers,
    color: '#F5A623',
    items: ['S07 \u2014 Gestao Academica Unificada', 'S08 \u2014 Diario de Classe Digital', 'S09 \u2014 Matricula Inteligente', 'S10 \u2014 Gestao de Frequencia', 'S11 \u2014 Comunicacao Escola-Familia', 'S12 \u2014 Gestao de Transporte Escolar', 'S13 \u2014 Gestao de Alimentacao Escolar', 'S14 \u2014 Infraestrutura e Patrimonio'],
  },
  {
    id: 'l4',
    label: 'L4',
    title: 'Analise e Experimentacao IA',
    icon: Brain,
    color: '#8B5CF6',
    items: ['S15 \u2014 Dashboard Analitico Multinivel', 'S16 \u2014 Indicadores Preditivos de Evasao', 'S17 \u2014 Trilhas Adaptativas de Aprendizagem', 'S18 \u2014 Avaliacao Diagnostica Continua', 'S19 \u2014 Assistente de Planejamento Docente', 'S20 \u2014 Tutoria IA para Alunos', 'S21 \u2014 Analise de Competencias BNCC', 'S22 \u2014 Otimizacao de Alocacao de Recursos', 'S23 \u2014 Simulacao e Cenarios'],
  },
  {
    id: 'l5',
    label: 'L5',
    title: 'Transferencia Institucional',
    icon: ArrowRightLeft,
    color: '#EC4899',
    items: ['S24 \u2014 Documentacao Tecnica Completa', 'S25 \u2014 Programa de Capacitacao TI SED', 'S26 \u2014 Codigo-Fonte e Repositorios', 'S27 \u2014 Playbook de Operacao', 'S28 \u2014 SLA e Monitoramento', 'S29 \u2014 Plano de Continuidade'],
  },
  {
    id: 'transversal',
    label: 'T',
    title: 'Componentes Transversais',
    icon: Settings,
    color: '#14B8A6',
    items: ['S30 \u2014 Rede de Multiplicadores Regionais', 'S31 \u2014 Programa de Formacao de Professores', 'S32 \u2014 Seguranca e Auditoria', 'S33 \u2014 Capacidade Offline', 'S34 \u2014 Modulo Universidade Gratuita'],
  },
];

const legalFramework = [
  { law: 'Lei 13.243/2016', name: 'Marco Legal da CT&I', desc: 'Dispoe sobre estimulos ao desenvolvimento cientifico e tecnologico' },
  { law: 'Decreto 9.283/2018', name: 'Regulamenta ETEC', desc: 'Regulamenta a Lei 13.243 \u2014 define instrumentos de encomenda tecnologica' },
  { law: 'Lei 14.133/2021', name: 'Nova Lei de Licitacoes', desc: 'Nova lei de licitacoes e contratos administrativos' },
];

export default function ETECPage() {
  const { tasks } = useProject();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const etecSigningDays = useMemo(() => daysUntil('2026-04-30'), []);
  const isUrgent = etecSigningDays < 14;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#F5A623]/10 flex items-center justify-center">
                <FileText size={20} className="text-[#F5A623]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Documentos ETEC
                </h1>
                <p className="text-xs text-white/40">
                  Encomenda Tecnologica — SED/SC — Santa Catarina
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </motion.header>

      {/* CONTRACT STATUS + COUNTDOWN */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className={`relative overflow-hidden rounded-2xl p-6 border-2 ${isUrgent ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'border-[#F5A623]/30'} bg-gradient-to-br from-[#061742] via-[#0A2463] to-[#061742]`}>
          {isUrgent && (
            <div className="absolute inset-0 rounded-2xl animate-pulse" style={{ boxShadow: '0 0 20px rgba(239,68,68,0.1) inset' }} />
          )}
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-[#F5A623]">
                Status do Contrato
              </p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                Em negociacao
              </p>
              <p className="text-sm text-white/40 mt-1">
                Meta: 30 de abril de 2026
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className={`w-2 h-2 rounded-full ${isUrgent ? 'bg-red-400 animate-pulse' : 'bg-[#F5A623] animate-pulse'}`} />
                <span className={`text-xs font-medium ${isUrgent ? 'text-red-400' : 'text-[#F5A623]'}`}>
                  {etecSigningDays > 0 ? `${etecSigningDays} dias restantes` : 'Prazo atingido'}
                </span>
              </div>
            </div>
            <div className="text-center">
              <motion.p
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className={`text-6xl sm:text-7xl font-black tabular-nums ${isUrgent ? 'text-red-400' : 'bg-gradient-to-r from-[#F5A623] to-[#00E5A0] bg-clip-text text-transparent'}`}
              >
                {etecSigningDays}
              </motion.p>
              <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${isUrgent ? 'text-red-400/70' : 'text-white/40'}`}>
                dias para assinatura
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* LEGAL FRAMEWORK */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 flex items-center justify-center">
            <Scale size={16} className="text-[#6366F1]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Marco Legal</h2>
            <p className="text-xs text-white/40">Base juridica da Encomenda Tecnologica</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {legalFramework.map((item) => (
            <motion.div
              key={item.law}
              variants={itemVariants}
              className="rounded-xl bg-[#061742]/60 border border-white/5 p-4"
            >
              <p className="text-xs font-bold text-[#00B4D8]">{item.law}</p>
              <p className="text-sm font-semibold text-white/80 mt-1">{item.name}</p>
              <p className="text-xs text-white/40 mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* COMMISSION PHASES A-D */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#00B4D8]/10 flex items-center justify-center">
            <Clock size={16} className="text-[#00B4D8]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Fases da Comissao SED/SC</h2>
            <p className="text-xs text-white/40">45 dias uteis a partir da Portaria</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {commissionPhases.map((phase) => {
            const task = tasks.find((t) => t.id === phase.taskId);
            const status = task?.status ?? 'nao_iniciada';
            const StatusIcon = status === 'concluida' ? CheckCircle2 : status === 'em_andamento' ? Loader2 : Circle;
            const statusColor = status === 'concluida' ? 'text-[#00E5A0]' : status === 'em_andamento' ? 'text-[#00B4D8]' : 'text-white/30';

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-[#061742]/60 border border-white/5 p-4 hover:border-white/10 transition-colors cursor-pointer"
                onClick={() => phase.taskId && setEditingTaskId(phase.taskId)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-[#00B4D8]/15 flex items-center justify-center text-xs font-bold text-[#00B4D8]">
                    {phase.label}
                  </span>
                  <div className={`flex items-center gap-1 ${statusColor}`}>
                    <StatusIcon size={12} className={status === 'em_andamento' ? 'animate-spin' : ''} />
                    <span className="text-[10px] capitalize">{status.replace('_', ' ')}</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white/80">{phase.title}</h3>
                <p className="text-[10px] text-[#F5A623] font-medium mt-1">{phase.dayRange}</p>
                <p className="text-xs text-white/40 mt-1 line-clamp-2">{phase.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* 34 DELIVERABLES */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#00E5A0]/10 flex items-center justify-center">
            <Layers size={16} className="text-[#00E5A0]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">34 Entregas Tecnicas</h2>
            <p className="text-xs text-white/40">Organizadas em 5 camadas arquiteturais + componentes transversais</p>
          </div>
        </div>

        <div className="space-y-4">
          {deliverableLayers.map((layer) => {
            const LayerIcon = layer.icon;
            return (
              <div key={layer.id} className="rounded-xl bg-[#061742]/60 border border-white/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${layer.color}15` }}>
                    <LayerIcon size={14} style={{ color: layer.color }} />
                  </div>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${layer.color}15`, color: layer.color }}>
                    {layer.label}
                  </span>
                  <h3 className="text-sm font-semibold text-white/80">{layer.title}</h3>
                  <span className="text-[10px] text-white/30 ml-auto">{layer.items.length} itens</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {layer.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.02]">
                      <Circle size={6} className="text-white/20 shrink-0" />
                      <span className="text-xs text-white/50">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Bottom spacer */}
      <div className="h-4" />

      {/* Task Edit Modal */}
      <TaskEditModal taskId={editingTaskId} onClose={() => setEditingTaskId(null)} />
    </div>
  );
}
