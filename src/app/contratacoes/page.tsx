'use client';

import { useState, useMemo, useCallback, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Paperclip,
} from 'lucide-react';
import { departments, daysUntil } from '../../data/projectData';
import { useProject } from '../../contexts/ProjectContext';
import type {
  HiringPosition,
  HiringStatus,
  TaskPriority,
  DepartmentId,
  AssociateCompany,
  CompanyType,
} from '../../data/types';
import FileUpload from '../../components/FileUpload';

// ---------------------------------------------------------------------------
// Constantes de configuração
// ---------------------------------------------------------------------------

const statusConfig: Record<
  HiringStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  aberta: { label: 'Aberta', bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  em_selecao: { label: 'Em Seleção', bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400' },
  oferta_enviada: { label: 'Oferta Enviada', bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400' },
  contratado: { label: 'Contratado', bg: 'bg-teal-500/15', text: 'text-teal-400', dot: 'bg-teal-400' },
  cancelada: { label: 'Cancelada', bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
};

const priorityConfig: Record<
  TaskPriority,
  { label: string; color: string; icon: React.ElementType }
> = {
  critica: { label: 'Crítica', color: 'text-red-400', icon: AlertTriangle },
  alta: { label: 'Alta', color: 'text-amber-400', icon: ArrowUpCircle },
  media: { label: 'Média', color: 'text-blue-400', icon: ArrowRightCircle },
  baixa: { label: 'Baixa', color: 'text-white/40', icon: ArrowDownCircle },
};

const companyTypeLabels: Record<CompanyType, { label: string; bg: string; text: string }> = {
  tech: { label: 'Tecnologia', bg: 'bg-[#00E5A0]/15', text: 'text-[#00E5A0]' },
  administrative: { label: 'Administrativo', bg: 'bg-blue-500/15', text: 'text-blue-400' },
  accounting: { label: 'Contabilidade', bg: 'bg-amber-500/15', text: 'text-amber-400' },
  consulting: { label: 'Consultoria', bg: 'bg-purple-500/15', text: 'text-purple-400' },
  educational: { label: 'Educacional', bg: 'bg-pink-500/15', text: 'text-pink-400' },
};

const departmentLabels: Record<DepartmentId, string> = {
  juridico: 'Jurídico',
  tecnologia: 'Tecnologia',
  relacoes_publicas: 'Relações Públicas',
  operacoes_locais: 'Operações Locais',
  santa_catarina: 'Santa Catarina',
  pedagogico: 'Pedagógico',
  administrativo_financeiro: 'Admin/Financeiro',
};

const allDepartmentIds: DepartmentId[] = [
  'juridico',
  'tecnologia',
  'relacoes_publicas',
  'operacoes_locais',
  'santa_catarina',
  'pedagogico',
  'administrativo_financeiro',
];

const allStatuses: HiringStatus[] = ['aberta', 'em_selecao', 'oferta_enviada', 'contratado', 'cancelada'];
const allPriorities: TaskPriority[] = ['critica', 'alta', 'media', 'baixa'];
const allCompanyTypes: CompanyType[] = ['tech', 'administrative', 'accounting', 'consulting', 'educational'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDepartmentName(deptId: DepartmentId): string {
  const dept = departments.find((d) => d.id === deptId);
  return dept?.name ?? departmentLabels[deptId] ?? deptId;
}

function getDepartmentColor(deptId: DepartmentId): string {
  const dept = departments.find((d) => d.id === deptId);
  return dept?.color ?? '#6B7280';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getUrgencyClasses(days: number): { text: string; bg: string; dot: string } {
  if (days < 7) return { text: 'text-red-400', bg: 'bg-red-500/15', dot: 'bg-red-400' };
  if (days < 14) return { text: 'text-amber-400', bg: 'bg-amber-500/15', dot: 'bg-amber-400' };
  return { text: 'text-emerald-400', bg: 'bg-emerald-500/15', dot: 'bg-emerald-400' };
}

// ---------------------------------------------------------------------------
// Variantes de animação
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

// ---------------------------------------------------------------------------
// Tipos de formulário
// ---------------------------------------------------------------------------

interface HiringFormData {
  title: string;
  departmentId: DepartmentId;
  description: string;
  status: HiringStatus;
  priority: TaskPriority;
  deadlineDate: string;
}

interface CompanyFormData {
  name: string;
  type: CompanyType;
  description: string;
  contactPerson: string;
  website: string;
  departmentIds: DepartmentId[];
}

const defaultHiringForm: HiringFormData = {
  title: '',
  departmentId: 'tecnologia',
  description: '',
  status: 'aberta',
  priority: 'media',
  deadlineDate: '',
};

const defaultCompanyForm: CompanyFormData = {
  name: '',
  type: 'tech',
  description: '',
  contactPerson: '',
  website: '',
  departmentIds: [],
};

// ---------------------------------------------------------------------------
// Estilos compartilhados de campo de formulário
// ---------------------------------------------------------------------------

const inputClasses =
  'w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8]/50 transition-colors';
const labelClasses = 'block text-xs font-semibold text-white/60 mb-1';
const selectClasses =
  'w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8]/50 transition-colors appearance-none';

// ---------------------------------------------------------------------------
// Componente de Modal Genérico
// ---------------------------------------------------------------------------

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-[#0D1B45] border border-white/10 shadow-2xl"
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0D1B45]">
              <h3 className="text-base font-bold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-white/50" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Componente de Diálogo de Confirmação
// ---------------------------------------------------------------------------

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-sm rounded-2xl bg-[#0D1B45] border border-white/10 shadow-2xl p-6 space-y-4"
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-sm text-white/60">{message}</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white/60 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-red-500/80 hover:bg-red-500 transition-colors"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Componente da Página
// ---------------------------------------------------------------------------

export default function ContratacoesPage() {
  const {
    hiringPositions,
    updateHiring,
    addHiring,
    deleteHiring,
    associateCompanies,
    updateCompany,
    addCompany,
    deleteCompany,
  } = useProject();

  // ---- Modal state: Hiring ----
  const [hiringModalOpen, setHiringModalOpen] = useState(false);
  const [hiringEditingId, setHiringEditingId] = useState<string | null>(null);
  const [hiringForm, setHiringForm] = useState<HiringFormData>(defaultHiringForm);

  // ---- Modal state: Company ----
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [companyEditingId, setCompanyEditingId] = useState<string | null>(null);
  const [companyForm, setCompanyForm] = useState<CompanyFormData>(defaultCompanyForm);

  // ---- Confirm delete ----
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'hiring' | 'company'; id: string; name: string } | null>(null);

  // ---- Computed summary ----
  const summaryCards = useMemo(() => {
    const total = hiringPositions.length;
    const abertas = hiringPositions.filter((p) => p.status === 'aberta').length;
    const preenchidas = hiringPositions.filter((p) => p.status === 'contratado').length;
    const urgentes = hiringPositions.filter((p) => {
      if (!p.deadlineDate) return false;
      const days = daysUntil(p.deadlineDate);
      return days >= 0 && days < 30;
    }).length;

    return [
      { label: 'Total de Vagas', value: total, icon: Users, color: 'text-[#00B4D8]', bg: 'bg-[#00B4D8]/15' },
      { label: 'Vagas Abertas', value: abertas, icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
      { label: 'Vagas Urgentes', value: urgentes, icon: Timer, color: 'text-amber-400', bg: 'bg-amber-500/15' },
      { label: 'Vagas Preenchidas', value: preenchidas, icon: CheckCircle2, color: 'text-teal-400', bg: 'bg-teal-500/15' },
    ];
  }, [hiringPositions]);

  // ---- Hiring modal handlers ----
  const openAddHiring = useCallback(() => {
    setHiringForm(defaultHiringForm);
    setHiringEditingId(null);
    setHiringModalOpen(true);
  }, []);

  const openEditHiring = useCallback((pos: HiringPosition) => {
    setHiringForm({
      title: pos.title,
      departmentId: pos.departmentId,
      description: pos.description,
      status: pos.status,
      priority: pos.priority,
      deadlineDate: pos.deadlineDate ?? '',
    });
    setHiringEditingId(pos.id);
    setHiringModalOpen(true);
  }, []);

  const handleSaveHiring = useCallback(() => {
    if (!hiringForm.title.trim()) return;

    if (hiringEditingId) {
      updateHiring(hiringEditingId, {
        title: hiringForm.title.trim(),
        departmentId: hiringForm.departmentId,
        description: hiringForm.description.trim(),
        status: hiringForm.status,
        priority: hiringForm.priority,
        deadlineDate: hiringForm.deadlineDate || undefined,
      });
    } else {
      addHiring({
        title: hiringForm.title.trim(),
        departmentId: hiringForm.departmentId,
        description: hiringForm.description.trim(),
        status: hiringForm.status,
        priority: hiringForm.priority,
        deadlineDate: hiringForm.deadlineDate || undefined,
        attachmentIds: [],
      });
    }

    setHiringModalOpen(false);
    setHiringEditingId(null);
  }, [hiringForm, hiringEditingId, updateHiring, addHiring]);

  // ---- Company modal handlers ----
  const openAddCompany = useCallback(() => {
    setCompanyForm(defaultCompanyForm);
    setCompanyEditingId(null);
    setCompanyModalOpen(true);
  }, []);

  const openEditCompany = useCallback((co: AssociateCompany) => {
    setCompanyForm({
      name: co.name,
      type: co.type,
      description: co.description,
      contactPerson: co.contactPerson ?? '',
      website: co.website ?? '',
      departmentIds: [...co.departmentIds],
    });
    setCompanyEditingId(co.id);
    setCompanyModalOpen(true);
  }, []);

  const handleSaveCompany = useCallback(() => {
    if (!companyForm.name.trim()) return;

    const data = {
      name: companyForm.name.trim(),
      type: companyForm.type,
      description: companyForm.description.trim(),
      contactPerson: companyForm.contactPerson.trim() || null,
      website: companyForm.website.trim() || null,
      departmentIds: companyForm.departmentIds,
    };

    if (companyEditingId) {
      updateCompany(companyEditingId, data);
    } else {
      addCompany(data);
    }

    setCompanyModalOpen(false);
    setCompanyEditingId(null);
  }, [companyForm, companyEditingId, updateCompany, addCompany]);

  // ---- Delete handler ----
  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'hiring') {
      deleteHiring(deleteTarget.id);
    } else {
      deleteCompany(deleteTarget.id);
    }
    setDeleteTarget(null);
  }, [deleteTarget, deleteHiring, deleteCompany]);

  // ---- Department toggle for company form ----
  const toggleDept = useCallback((deptId: DepartmentId) => {
    setCompanyForm((prev) => ({
      ...prev,
      departmentIds: prev.departmentIds.includes(deptId)
        ? prev.departmentIds.filter((d) => d !== deptId)
        : [...prev.departmentIds, deptId],
    }));
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
              Vagas abertas, prazos de contratação e empresas parceiras do Instituto i10
            </p>
          </div>
        </div>
      </motion.div>

      {/* =================================================================
          SEÇÃO 0: Resumo Estatístico
          ================================================================= */}
      <motion.section variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={itemVariants}
                className="rounded-xl bg-[#0A2463]/60 border border-white/5 p-4 sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <Icon size={18} className={card.color} />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40 font-medium">{card.label}</p>
                    <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
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
      <motion.section variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Briefcase size={16} className="text-[#00E5A0]" />
          </div>
          <h2 className="text-lg font-bold text-white">Vagas e Prazos de Contratação</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">
            {hiringPositions.length}
          </span>
          <button
            onClick={openAddHiring}
            className="ml-auto w-8 h-8 rounded-lg bg-[#00E5A0]/15 hover:bg-[#00E5A0]/25 flex items-center justify-center transition-colors group"
            title="Adicionar vaga"
          >
            <Plus size={16} className="text-[#00E5A0] group-hover:scale-110 transition-transform" />
          </button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {hiringPositions.map((position) => {
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
                className="relative group rounded-xl overflow-hidden bg-[#0A2463]/60 border border-white/5 hover:border-white/10 hover:shadow-lg transition-all duration-200"
              >
                {/* Barra de acento superior com cor do departamento */}
                <div className="h-1" style={{ backgroundColor: deptColor }} />

                {/* Botões de ação (visíveis no hover) */}
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => openEditHiring(position)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#00B4D8]/30 flex items-center justify-center transition-colors"
                    title="Editar vaga"
                  >
                    <Pencil size={13} className="text-white/70" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'hiring', id: position.id, name: position.title })}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    title="Excluir vaga"
                  >
                    <Trash2 size={13} className="text-white/70" />
                  </button>
                </div>

                <div className="p-4 sm:p-5 space-y-3">
                  {/* Título e prioridade */}
                  <div className="flex items-start justify-between gap-2 pr-16 group-hover:pr-0">
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {position.title}
                    </h3>
                    <div className={`flex items-center gap-1 shrink-0 ${pCfg.color}`}>
                      <PriorityIcon size={14} />
                      <span className="text-[10px] font-semibold">{pCfg.label}</span>
                    </div>
                  </div>

                  {/* Departamento */}
                  <p className="text-[11px] font-medium" style={{ color: deptColor }}>
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
                        <span className="text-[10px] text-white/30 italic">Sem prazo definido</span>
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
      <motion.section variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Building2 size={16} className="text-[#00B4D8]" />
          </div>
          <h2 className="text-lg font-bold text-white">Empresas Associadas</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">
            {associateCompanies.length}
          </span>
          <button
            onClick={openAddCompany}
            className="ml-auto w-8 h-8 rounded-lg bg-[#00B4D8]/15 hover:bg-[#00B4D8]/25 flex items-center justify-center transition-colors group"
            title="Adicionar empresa"
          >
            <Plus size={16} className="text-[#00B4D8] group-hover:scale-110 transition-transform" />
          </button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {associateCompanies.map((company) => {
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
                className="relative group rounded-xl overflow-hidden bg-[#0A2463]/60 border border-white/5 hover:border-white/10 hover:shadow-lg transition-all duration-200"
              >
                {/* Botões de ação (visíveis no hover) */}
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => openEditCompany(company)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#00B4D8]/30 flex items-center justify-center transition-colors"
                    title="Editar empresa"
                  >
                    <Pencil size={13} className="text-white/70" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'company', id: company.id, name: company.name })}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    title="Excluir empresa"
                  >
                    <Trash2 size={13} className="text-white/70" />
                  </button>
                </div>

                <div className="p-4 sm:p-5 space-y-3">
                  {/* Nome e tipo */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white">{company.name}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${typeCfg.bg} ${typeCfg.text}`}
                    >
                      {typeCfg.label}
                    </span>
                  </div>

                  {/* Contato e website */}
                  {(company.contactPerson || company.website) && (
                    <div className="space-y-1">
                      {company.contactPerson && (
                        <p className="text-[11px] text-white/50">
                          <span className="text-white/30">Contato:</span> {company.contactPerson}
                        </p>
                      )}
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#00B4D8] hover:text-[#00B4D8]/80 transition-colors"
                        >
                          <ExternalLink size={10} />
                          Website
                        </a>
                      )}
                    </div>
                  )}

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

      {/* =================================================================
          MODAL: Adicionar/Editar Vaga
          ================================================================= */}
      <Modal
        open={hiringModalOpen}
        onClose={() => { setHiringModalOpen(false); setHiringEditingId(null); }}
        title={hiringEditingId ? 'Editar Vaga' : 'Nova Vaga'}
      >
        <div className="space-y-4">
          {/* Título */}
          <div>
            <label className={labelClasses}>Título da Vaga *</label>
            <input
              type="text"
              value={hiringForm.title}
              onChange={(e) => setHiringForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Desenvolvedor Full Stack"
              className={inputClasses}
              autoFocus
            />
          </div>

          {/* Departamento e Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClasses}>Departamento</label>
              <select
                value={hiringForm.departmentId}
                onChange={(e) => setHiringForm((f) => ({ ...f, departmentId: e.target.value as DepartmentId }))}
                className={selectClasses}
              >
                {allDepartmentIds.map((id) => (
                  <option key={id} value={id} className="bg-[#0D1B45] text-white">
                    {departmentLabels[id]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Status</label>
              <select
                value={hiringForm.status}
                onChange={(e) => setHiringForm((f) => ({ ...f, status: e.target.value as HiringStatus }))}
                className={selectClasses}
              >
                {allStatuses.map((s) => (
                  <option key={s} value={s} className="bg-[#0D1B45] text-white">
                    {statusConfig[s].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prioridade e Prazo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClasses}>Prioridade</label>
              <select
                value={hiringForm.priority}
                onChange={(e) => setHiringForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
                className={selectClasses}
              >
                {allPriorities.map((p) => (
                  <option key={p} value={p} className="bg-[#0D1B45] text-white">
                    {priorityConfig[p].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Prazo para Contratar</label>
              <input
                type="date"
                value={hiringForm.deadlineDate}
                onChange={(e) => setHiringForm((f) => ({ ...f, deadlineDate: e.target.value }))}
                className={`${inputClasses} [color-scheme:dark]`}
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className={labelClasses}>Descrição</label>
            <textarea
              value={hiringForm.description}
              onChange={(e) => setHiringForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Descreva os requisitos e responsabilidades da vaga..."
              rows={4}
              className={`${inputClasses} resize-none`}
            />
          </div>

          {/* Documentos - only when editing existing position */}
          {hiringEditingId && (
            <div>
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <Paperclip size={12} />
                  Documentos (CVs, etc.)
                </span>
              </label>
              <FileUpload
                entityType="hiring"
                entityId={hiringEditingId}
                departmentId={hiringForm.departmentId}
              />
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <button
              onClick={() => { setHiringModalOpen(false); setHiringEditingId(null); }}
              className="px-4 py-2 text-sm font-medium text-white/60 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveHiring}
              disabled={!hiringForm.title.trim()}
              className="px-5 py-2 text-sm font-medium text-white rounded-lg bg-[#00E5A0]/80 hover:bg-[#00E5A0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {hiringEditingId ? 'Salvar Alterações' : 'Criar Vaga'}
            </button>
          </div>
        </div>
      </Modal>

      {/* =================================================================
          MODAL: Adicionar/Editar Empresa
          ================================================================= */}
      <Modal
        open={companyModalOpen}
        onClose={() => { setCompanyModalOpen(false); setCompanyEditingId(null); }}
        title={companyEditingId ? 'Editar Empresa' : 'Nova Empresa'}
      >
        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label className={labelClasses}>Nome da Empresa *</label>
            <input
              type="text"
              value={companyForm.name}
              onChange={(e) => setCompanyForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Tech Solutions Ltda."
              className={inputClasses}
              autoFocus
            />
          </div>

          {/* Tipo */}
          <div>
            <label className={labelClasses}>Tipo</label>
            <select
              value={companyForm.type}
              onChange={(e) => setCompanyForm((f) => ({ ...f, type: e.target.value as CompanyType }))}
              className={selectClasses}
            >
              {allCompanyTypes.map((t) => (
                <option key={t} value={t} className="bg-[#0D1B45] text-white">
                  {companyTypeLabels[t].label}
                </option>
              ))}
            </select>
          </div>

          {/* Contato e Website */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClasses}>Pessoa de Contato</label>
              <input
                type="text"
                value={companyForm.contactPerson}
                onChange={(e) => setCompanyForm((f) => ({ ...f, contactPerson: e.target.value }))}
                placeholder="Nome do contato"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Website</label>
              <input
                type="url"
                value={companyForm.website}
                onChange={(e) => setCompanyForm((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://..."
                className={inputClasses}
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className={labelClasses}>Descrição</label>
            <textarea
              value={companyForm.description}
              onChange={(e) => setCompanyForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Descreva os serviços e a relação com o instituto..."
              rows={3}
              className={`${inputClasses} resize-none`}
            />
          </div>

          {/* Departamentos vinculados (multi-select checkboxes) */}
          <div>
            <label className={labelClasses}>Departamentos Vinculados</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {allDepartmentIds.map((deptId) => {
                const checked = companyForm.departmentIds.includes(deptId);
                return (
                  <label
                    key={deptId}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                      checked
                        ? 'border-[#00B4D8]/40 bg-[#00B4D8]/10'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDept(deptId)}
                      className="sr-only"
                    />
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                        checked ? 'border-[#00B4D8] bg-[#00B4D8]' : 'border-white/20 bg-transparent'
                      }`}
                    >
                      {checked && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getDepartmentColor(deptId) }}
                    />
                    <span className={`text-xs ${checked ? 'text-white/80' : 'text-white/40'}`}>
                      {departmentLabels[deptId]}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <button
              onClick={() => { setCompanyModalOpen(false); setCompanyEditingId(null); }}
              className="px-4 py-2 text-sm font-medium text-white/60 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveCompany}
              disabled={!companyForm.name.trim()}
              className="px-5 py-2 text-sm font-medium text-white rounded-lg bg-[#00B4D8]/80 hover:bg-[#00B4D8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {companyEditingId ? 'Salvar Alterações' : 'Criar Empresa'}
            </button>
          </div>
        </div>
      </Modal>

      {/* =================================================================
          DIÁLOGO DE CONFIRMAÇÃO DE EXCLUSÃO
          ================================================================= */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={
          deleteTarget
            ? `Tem certeza que deseja excluir "${deleteTarget.name}"? Esta ação não pode ser desfeita.`
            : ''
        }
      />
    </div>
  );
}
