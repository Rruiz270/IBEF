'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Building,
  Crown,
  UserPlus,
  Globe,
  Briefcase,
  Code,
  Calculator,
  Plus,
  Pencil,
  Trash2,
  X,
  Mail,
  Check,
} from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { departments } from '../../data/projectData';
import type {
  Person,
  PersonRole,
  DepartmentId,
  AssociateCompany,
  CompanyType,
} from '../../data/types';

// ---------------------------------------------------------------------------
// Constants & label maps
// ---------------------------------------------------------------------------

const roleLabels: Record<PersonRole, string> = {
  fundador: 'Fundador',
  convidado: 'Convidado',
  contratacao: 'Contratacao',
  parceiro: 'Parceiro',
  lider: 'Lider',
};

const roleOptions: { value: PersonRole; label: string }[] = [
  { value: 'fundador', label: 'Fundador' },
  { value: 'convidado', label: 'Convidado' },
  { value: 'contratacao', label: 'Contratacao' },
  { value: 'parceiro', label: 'Parceiro' },
  { value: 'lider', label: 'Lider' },
];

const departmentLabels: Record<DepartmentId, string> = {
  juridico: 'Juridico',
  tecnologia: 'Tecnologia',
  relacoes_publicas: 'Relacoes Publicas',
  operacoes_locais: 'Operacoes Locais',
  santa_catarina: 'Santa Catarina',
  pedagogico: 'Pedagogico',
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

const companyTypeOptions: { value: CompanyType; label: string }[] = [
  { value: 'tech', label: 'Tecnologia' },
  { value: 'administrative', label: 'Administrativo' },
  { value: 'accounting', label: 'Contabilidade' },
  { value: 'consulting', label: 'Consultoria' },
  { value: 'educational', label: 'Educacional' },
];

const departmentColorMap: Record<DepartmentId, string> = {
  juridico: '#8B5CF6',
  tecnologia: '#00E5A0',
  relacoes_publicas: '#F59E0B',
  operacoes_locais: '#EF4444',
  santa_catarina: '#06B6D4',
  pedagogico: '#EC4899',
  administrativo_financeiro: '#3B82F6',
};

const roleConfig: Record<
  PersonRole,
  { label: string; color: string; bg: string; border: string }
> = {
  lider: {
    label: 'Lider',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
  },
  fundador: {
    label: 'Fundador',
    color: 'text-[#00B4D8]',
    bg: 'bg-[#00B4D8]/15',
    border: 'border-[#00B4D8]/30',
  },
  convidado: {
    label: 'Convidado',
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/30',
  },
  contratacao: {
    label: 'Contratacao',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-500/30',
  },
  parceiro: {
    label: 'Parceiro',
    color: 'text-[#00E5A0]',
    bg: 'bg-[#00E5A0]/15',
    border: 'border-[#00E5A0]/30',
  },
};

const companyTypeConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  tech: {
    label: 'Tecnologia',
    color: 'text-[#00E5A0]',
    bg: 'bg-[#00E5A0]/15',
    icon: Code,
  },
  administrative: {
    label: 'Administrativo',
    color: 'text-[#3B82F6]',
    bg: 'bg-[#3B82F6]/15',
    icon: Calculator,
  },
  accounting: {
    label: 'Contabilidade',
    color: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/15',
    icon: Calculator,
  },
  consulting: {
    label: 'Consultoria',
    color: 'text-[#8B5CF6]',
    bg: 'bg-[#8B5CF6]/15',
    icon: Briefcase,
  },
  educational: {
    label: 'Educacional',
    color: 'text-[#EC4899]',
    bg: 'bg-[#EC4899]/15',
    icon: Users,
  },
};

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .join('')
    .toUpperCase();
}

function getDeptColor(deptIds: DepartmentId[]): string {
  if (deptIds.length === 0) return '#6B7280';
  return departmentColorMap[deptIds[0]] ?? '#6B7280';
}

function getDeptLabel(deptIds: DepartmentId[]): string {
  if (deptIds.length === 0) return '';
  return deptIds.map((id) => departmentLabels[id] ?? id).join(', ');
}

function getStatusDot(role: PersonRole): string {
  switch (role) {
    case 'lider':
      return 'bg-amber-400';
    case 'fundador':
      return 'bg-[#00E5A0]';
    case 'convidado':
      return 'bg-purple-400';
    case 'contratacao':
      return 'bg-[#00B4D8]';
    case 'parceiro':
      return 'bg-[#00E5A0]';
    default:
      return 'bg-white/30';
  }
}

function getStatusLabel(role: PersonRole): string {
  switch (role) {
    case 'lider':
      return 'Ativo';
    case 'fundador':
      return 'Ativo';
    case 'convidado':
      return 'A Convidar';
    case 'contratacao':
      return 'A Contratar';
    case 'parceiro':
      return 'Parceiro';
    default:
      return '';
  }
}

// ---------------------------------------------------------------------------
// Default data for new entries
// ---------------------------------------------------------------------------

function emptyPersonForm(): Omit<Person, 'id'> {
  return {
    name: '',
    role: 'fundador',
    title: '',
    departmentIds: [],
    email: null,
    notes: '',
    avatarUrl: null,
    assembleiaConfirmed: false,
  };
}

function emptyCompanyForm(): Omit<AssociateCompany, 'id'> {
  return {
    name: '',
    type: 'tech',
    description: '',
    contactPerson: null,
    website: null,
    departmentIds: [],
  };
}

// ---------------------------------------------------------------------------
// Confirm Dialog Component
// ---------------------------------------------------------------------------

function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onCancel}
        >
          <motion.div
            className="bg-[#0D1B45] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
            variants={modalContentVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-white/60 mb-6">{message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
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
// Person Edit/Create Modal
// ---------------------------------------------------------------------------

function PersonModal({
  open,
  person,
  onSave,
  onClose,
}: {
  open: boolean;
  person: Omit<Person, 'id'> & { id?: string };
  onSave: (data: Omit<Person, 'id'> & { id?: string }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(person);
  const isEditing = !!person.id;

  // Reset form when person prop changes
  const personId = person.id;
  const personName = person.name;
  useMemo(() => {
    setForm(person);
  }, [personId, personName, open]);

  const handleDeptToggle = (deptId: DepartmentId) => {
    setForm((prev) => ({
      ...prev,
      departmentIds: prev.departmentIds.includes(deptId)
        ? prev.departmentIds.filter((d) => d !== deptId)
        : [...prev.departmentIds, deptId],
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-[#0D1B45] border border-white/10 rounded-2xl w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            variants={modalContentVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">
                {isEditing ? 'Editar Pessoa' : 'Nova Pessoa'}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form body */}
            <div className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00B4D8]/50 transition-colors"
                  placeholder="Nome completo"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">
                  Papel
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      role: e.target.value as PersonRole,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#00B4D8]/50 transition-colors"
                >
                  {roleOptions.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-[#0D1B45] text-white"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">
                  Cargo / Titulo
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00B4D8]/50 transition-colors"
                  placeholder="Ex: Diretor Executivo"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      email: e.target.value || null,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00B4D8]/50 transition-colors"
                  placeholder="email@exemplo.com"
                />
              </div>

              {/* Departments multi-select */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2">
                  Departamentos
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {allDepartmentIds.map((deptId) => (
                    <label
                      key={deptId}
                      className="flex items-center gap-2 text-xs text-white/70 cursor-pointer hover:text-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={form.departmentIds.includes(deptId)}
                        onChange={() => handleDeptToggle(deptId)}
                        className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#00B4D8]"
                      />
                      {departmentLabels[deptId]}
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">
                  Notas
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00B4D8]/50 transition-colors resize-none"
                  placeholder="Observacoes sobre a pessoa..."
                />
              </div>

              {/* Assembleia Confirmed */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.assembleiaConfirmed}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      assembleiaConfirmed: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#00E5A0]"
                />
                <span className="text-xs text-white/70">
                  Confirmado para Assembleia
                </span>
              </label>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-5 border-t border-white/5">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.name.trim()}
                className="px-4 py-2 text-sm text-white bg-[#00B4D8] hover:bg-[#00B4D8]/80 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                <Check size={14} />
                {isEditing ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Company Edit/Create Modal
// ---------------------------------------------------------------------------

function CompanyModal({
  open,
  company,
  onSave,
  onClose,
}: {
  open: boolean;
  company: Omit<AssociateCompany, 'id'> & { id?: string };
  onSave: (data: Omit<AssociateCompany, 'id'> & { id?: string }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(company);
  const isEditing = !!company.id;

  const companyId = company.id;
  const companyName = company.name;
  useMemo(() => {
    setForm(company);
  }, [companyId, companyName, open]);

  const handleDeptToggle = (deptId: DepartmentId) => {
    setForm((prev) => ({
      ...prev,
      departmentIds: prev.departmentIds.includes(deptId)
        ? prev.departmentIds.filter((d) => d !== deptId)
        : [...prev.departmentIds, deptId],
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-[#0D1B45] border border-white/10 rounded-2xl w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            variants={modalContentVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">
                {isEditing ? 'Editar Empresa' : 'Nova Empresa'}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form body */}
            <div className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00B4D8]/50 transition-colors"
                  placeholder="Nome da empresa"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">
                  Tipo
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      type: e.target.value as CompanyType,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#00B4D8]/50 transition-colors"
                >
                  {companyTypeOptions.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-[#0D1B45] text-white"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">
                  Descricao
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00B4D8]/50 transition-colors resize-none"
                  placeholder="Descricao da empresa..."
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">
                  Pessoa de Contato
                </label>
                <input
                  type="text"
                  value={form.contactPerson ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      contactPerson: e.target.value || null,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00B4D8]/50 transition-colors"
                  placeholder="Nome do contato"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={form.website ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      website: e.target.value || null,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00B4D8]/50 transition-colors"
                  placeholder="https://exemplo.com"
                />
              </div>

              {/* Departments multi-select */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2">
                  Departamentos
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {allDepartmentIds.map((deptId) => (
                    <label
                      key={deptId}
                      className="flex items-center gap-2 text-xs text-white/70 cursor-pointer hover:text-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={form.departmentIds.includes(deptId)}
                        onChange={() => handleDeptToggle(deptId)}
                        className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#00B4D8]"
                      />
                      {departmentLabels[deptId]}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-5 border-t border-white/5">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.name.trim()}
                className="px-4 py-2 text-sm text-white bg-[#00B4D8] hover:bg-[#00B4D8]/80 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                <Check size={14} />
                {isEditing ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Inline Person Card (with edit/delete overlay)
// ---------------------------------------------------------------------------

function PersonCardWithActions({
  person,
  index,
  onEdit,
  onDelete,
}: {
  person: Person;
  index: number;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
}) {
  const roleCfg = roleConfig[person.role];
  const deptColor = getDeptColor(person.departmentIds);
  const deptLabel = getDeptLabel(person.departmentIds);
  const initials = getInitials(person.name);
  const statusDot = getStatusDot(person.role);
  const statusLabel = getStatusLabel(person.role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group relative rounded-xl overflow-hidden bg-[#0A2463]/60 border border-white/5 hover:border-white/10 hover:shadow-lg transition-all duration-200"
    >
      {/* Top accent */}
      <div className="h-1" style={{ backgroundColor: deptColor }} />

      {/* Edit/Delete overlay buttons */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(person);
          }}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#00B4D8]/30 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          title="Editar"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(person);
          }}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-500/30 flex items-center justify-center text-white/50 hover:text-red-400 transition-colors"
          title="Excluir"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        {/* Header: Avatar + Info */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold text-white"
              style={{ backgroundColor: `${deptColor}25` }}
            >
              {initials}
            </div>
            {/* Status indicator */}
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A2463] ${statusDot}`}
            >
              {(person.role === 'fundador' || person.role === 'lider') && (
                <motion.div
                  className={`absolute inset-0 rounded-full ${person.role === 'lider' ? 'bg-amber-400' : 'bg-[#00E5A0]'}`}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 pr-14">
            <h3 className="text-sm font-bold text-white truncate">
              {person.name}
            </h3>
            <p className="text-xs text-white/50 mt-0.5 truncate">
              {person.title}
            </p>
            {deptLabel && (
              <p
                className="text-[10px] mt-1 font-medium"
                style={{ color: deptColor }}
              >
                {deptLabel}
              </p>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleCfg.bg} ${roleCfg.color} ${roleCfg.border}`}
          >
            {roleCfg.label}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/50">
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
            {statusLabel}
          </span>
          {person.assembleiaConfirmed && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#00E5A0]/10 text-[#00E5A0]">
              Assembleia OK
            </span>
          )}
        </div>

        {/* Contact info + notes */}
        {(person.email || person.notes) && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
            {person.email && (
              <div className="flex items-center gap-2">
                <Mail size={11} className="text-white/20 shrink-0" />
                <span className="text-[10px] text-white/40 truncate">
                  {person.email}
                </span>
              </div>
            )}
            {person.notes && (
              <p className="text-[10px] text-white/30 leading-relaxed line-clamp-2">
                {person.notes}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Company Card (with edit/delete overlay)
// ---------------------------------------------------------------------------

function CompanyCardWithActions({
  company,
  index,
  onEdit,
  onDelete,
}: {
  company: AssociateCompany;
  index: number;
  onEdit: (company: AssociateCompany) => void;
  onDelete: (company: AssociateCompany) => void;
}) {
  const typeCfg = companyTypeConfig[company.type] ?? {
    label: company.type,
    color: 'text-white/50',
    bg: 'bg-white/10',
    icon: Building,
  };
  const TypeIcon = typeCfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group relative rounded-xl overflow-hidden bg-[#0A2463]/60 border border-white/5 hover:border-white/10 hover:shadow-lg transition-all duration-200"
    >
      {/* Top accent */}
      <div
        className="h-1"
        style={{
          backgroundColor:
            company.type === 'tech'
              ? '#00E5A0'
              : company.type === 'administrative'
                ? '#3B82F6'
                : '#F59E0B',
        }}
      />

      {/* Edit/Delete overlay buttons */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(company);
          }}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#00B4D8]/30 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          title="Editar"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(company);
          }}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-500/30 flex items-center justify-center text-white/50 hover:text-red-400 transition-colors"
          title="Excluir"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${typeCfg.bg}`}
          >
            <TypeIcon size={20} className={typeCfg.color} />
          </div>

          <div className="flex-1 min-w-0 pr-14">
            <h3 className="text-sm font-bold text-white">{company.name}</h3>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${typeCfg.bg} ${typeCfg.color}`}
            >
              {typeCfg.label}
            </span>
          </div>
        </div>

        {company.description && (
          <p className="text-xs text-white/40 mt-3 leading-relaxed">
            {company.description}
          </p>
        )}

        {/* Meta info */}
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
          {company.contactPerson && (
            <span className="inline-flex items-center gap-1 text-[10px] text-white/30">
              <Users size={10} />
              {company.contactPerson}
            </span>
          )}
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-[#00B4D8] hover:text-[#90E0EF] transition-colors"
            >
              <Globe size={10} />
              Website
            </a>
          )}
          {company.departmentIds.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-white/30">
              <Building size={10} />
              {company.departmentIds.length} departamento(s)
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Add Button Component
// ---------------------------------------------------------------------------

function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00B4D8]/15 hover:bg-[#00B4D8]/25 border border-[#00B4D8]/20 hover:border-[#00B4D8]/40 text-[#00B4D8] text-xs font-medium transition-all"
    >
      <Plus size={14} />
      {label}
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function AssociadosPage() {
  const {
    teamPeople,
    updatePerson,
    addPerson,
    deletePerson,
    associateCompanies,
    updateCompany,
    addCompany,
    deleteCompany,
  } = useProject();

  // Filter people by role
  const fundadores = useMemo(
    () => teamPeople.filter((p) => p.role === 'fundador'),
    [teamPeople],
  );

  const convidados = useMemo(
    () => teamPeople.filter((p) => p.role === 'convidado'),
    [teamPeople],
  );

  // ----- Person modal state -----
  const [personModalOpen, setPersonModalOpen] = useState(false);
  const [personModalData, setPersonModalData] = useState<
    Omit<Person, 'id'> & { id?: string }
  >(emptyPersonForm());

  const openNewPersonModal = useCallback((defaultRole: PersonRole = 'fundador') => {
    setPersonModalData({ ...emptyPersonForm(), role: defaultRole });
    setPersonModalOpen(true);
  }, []);

  const openEditPersonModal = useCallback((person: Person) => {
    setPersonModalData({ ...person });
    setPersonModalOpen(true);
  }, []);

  const handlePersonSave = useCallback(
    (data: Omit<Person, 'id'> & { id?: string }) => {
      if (data.id) {
        const { id, ...updates } = data;
        updatePerson(id, updates);
      } else {
        const { id: _unused, ...partial } = data as Omit<Person, 'id'> & { id?: string };
        addPerson({
          name: partial.name,
          role: partial.role,
          title: partial.title,
          departmentIds: partial.departmentIds,
          email: partial.email,
          notes: partial.notes,
          avatarUrl: partial.avatarUrl ?? null,
          assembleiaConfirmed: partial.assembleiaConfirmed,
        });
      }
      setPersonModalOpen(false);
    },
    [addPerson, updatePerson],
  );

  // ----- Person delete confirm -----
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
  const handlePersonDelete = useCallback(() => {
    if (personToDelete) {
      deletePerson(personToDelete.id);
      setPersonToDelete(null);
    }
  }, [deletePerson, personToDelete]);

  // ----- Company modal state -----
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [companyModalData, setCompanyModalData] = useState<
    Omit<AssociateCompany, 'id'> & { id?: string }
  >(emptyCompanyForm());

  const openNewCompanyModal = useCallback(() => {
    setCompanyModalData(emptyCompanyForm());
    setCompanyModalOpen(true);
  }, []);

  const openEditCompanyModal = useCallback((company: AssociateCompany) => {
    setCompanyModalData({ ...company });
    setCompanyModalOpen(true);
  }, []);

  const handleCompanySave = useCallback(
    (data: Omit<AssociateCompany, 'id'> & { id?: string }) => {
      if (data.id) {
        const { id, ...updates } = data;
        updateCompany(id, updates);
      } else {
        const { id: _unused, ...partial } = data as Omit<AssociateCompany, 'id'> & { id?: string };
        addCompany({
          name: partial.name,
          type: partial.type,
          description: partial.description,
          contactPerson: partial.contactPerson ?? null,
          website: partial.website ?? null,
          departmentIds: partial.departmentIds,
        });
      }
      setCompanyModalOpen(false);
    },
    [addCompany, updateCompany],
  );

  // ----- Company delete confirm -----
  const [companyToDelete, setCompanyToDelete] = useState<AssociateCompany | null>(null);
  const handleCompanyDelete = useCallback(() => {
    if (companyToDelete) {
      deleteCompany(companyToDelete.id);
      setCompanyToDelete(null);
    }
  }, [deleteCompany, companyToDelete]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/20 flex items-center justify-center">
            <Users size={20} className="text-[#00B4D8]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Associados
            </h1>
            <p className="text-sm text-white/50 mt-0.5">
              Empresas e pessoas associadas ao Instituto i10
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="rounded-xl bg-[#0A2463]/60 border border-white/5 p-4 text-center">
          <p className="text-2xl font-bold text-[#00B4D8]">
            {fundadores.length}
          </p>
          <p className="text-[11px] text-white/40 mt-1">Fundadores</p>
        </div>
        <div className="rounded-xl bg-[#0A2463]/60 border border-white/5 p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">
            {convidados.length}
          </p>
          <p className="text-[11px] text-white/40 mt-1">Convidados</p>
        </div>
        <div className="rounded-xl bg-[#0A2463]/60 border border-white/5 p-4 text-center">
          <p className="text-2xl font-bold text-[#00E5A0]">
            {associateCompanies.length}
          </p>
          <p className="text-[11px] text-white/40 mt-1">Empresas</p>
        </div>
      </motion.div>

      {/* Section: Fundadores */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Crown size={16} className="text-[#00B4D8]" />
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
            Fundadores
          </h2>
          <span className="text-xs text-white/30 ml-auto mr-2">
            {fundadores.length} membro(s)
          </span>
          <AddButton
            label="Adicionar"
            onClick={() => openNewPersonModal('fundador')}
          />
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {fundadores.map((person, idx) => (
            <motion.div key={person.id} variants={itemVariants}>
              <PersonCardWithActions
                person={person}
                index={idx}
                onEdit={openEditPersonModal}
                onDelete={setPersonToDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Section: Convidados (Conselho) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <UserPlus size={16} className="text-purple-400" />
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
            Convidados (Conselho)
          </h2>
          <span className="text-xs text-white/30 ml-auto mr-2">
            {convidados.length} membro(s)
          </span>
          <AddButton
            label="Adicionar"
            onClick={() => openNewPersonModal('convidado')}
          />
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {convidados.map((person, idx) => (
            <motion.div key={person.id} variants={itemVariants}>
              <PersonCardWithActions
                person={person}
                index={idx}
                onEdit={openEditPersonModal}
                onDelete={setPersonToDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Section: Empresas Associadas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Building size={16} className="text-[#00E5A0]" />
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
            Empresas Associadas
          </h2>
          <span className="text-xs text-white/30 ml-auto mr-2">
            {associateCompanies.length} empresa(s)
          </span>
          <AddButton label="Adicionar" onClick={openNewCompanyModal} />
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {associateCompanies.map((company, idx) => (
            <motion.div key={company.id} variants={itemVariants}>
              <CompanyCardWithActions
                company={company}
                index={idx}
                onEdit={openEditCompanyModal}
                onDelete={setCompanyToDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Modals */}
      <PersonModal
        open={personModalOpen}
        person={personModalData}
        onSave={handlePersonSave}
        onClose={() => setPersonModalOpen(false)}
      />

      <CompanyModal
        open={companyModalOpen}
        company={companyModalData}
        onSave={handleCompanySave}
        onClose={() => setCompanyModalOpen(false)}
      />

      {/* Delete Confirmations */}
      <ConfirmDialog
        open={!!personToDelete}
        title="Excluir Pessoa"
        message={`Tem certeza que deseja excluir "${personToDelete?.name}"? Esta acao nao pode ser desfeita.`}
        onConfirm={handlePersonDelete}
        onCancel={() => setPersonToDelete(null)}
      />

      <ConfirmDialog
        open={!!companyToDelete}
        title="Excluir Empresa"
        message={`Tem certeza que deseja excluir "${companyToDelete?.name}"? Esta acao nao pode ser desfeita.`}
        onConfirm={handleCompanyDelete}
        onCancel={() => setCompanyToDelete(null)}
      />
    </div>
  );
}
