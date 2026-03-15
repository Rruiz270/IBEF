'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Users,
  HelpCircle,
  Scale,
  Code,
  Handshake,
  MapPin,
  GraduationCap,
  Wallet,
  Pencil,
  Plus,
  X,
  Trash2,
  Check,
} from 'lucide-react';
import { departments } from '../data/projectData';
import { useProject } from '../contexts/ProjectContext';
import type { Person, PersonRole, DepartmentId } from '../data/types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface OrgChartProps {
  onPersonClick?: (person: Person) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROLE_LABELS: Record<PersonRole, string> = {
  fundador: 'Fundador',
  convidado: 'Convidado',
  contratacao: 'Contratacao',
  parceiro: 'Parceiro',
  lider: 'Lider',
};

const ALL_DEPARTMENT_IDS: DepartmentId[] = [
  'juridico',
  'tecnologia',
  'relacoes_publicas',
  'operacoes_locais',
  'santa_catarina',
  'pedagogico',
  'administrativo_financeiro',
];

const DEPT_LABELS: Record<DepartmentId, string> = {
  juridico: 'Juridico',
  tecnologia: 'Tecnologia',
  relacoes_publicas: 'Relacoes Publicas',
  operacoes_locais: 'Operacoes Locais',
  santa_catarina: 'Santa Catarina',
  pedagogico: 'Pedagogico',
  administrativo_financeiro: 'Admin/Financeiro',
};

// ---------------------------------------------------------------------------
// Department display config
// ---------------------------------------------------------------------------

interface DeptDisplayConfig {
  id: DepartmentId;
  label: string;
  color: string;
  icon: React.ElementType;
}

const deptDisplayConfigs: DeptDisplayConfig[] = [
  { id: 'juridico', label: 'Juridico', color: '#8B5CF6', icon: Scale },
  { id: 'tecnologia', label: 'Tecnologia', color: '#00E5A0', icon: Code },
  { id: 'relacoes_publicas', label: 'Relacoes Publicas', color: '#F59E0B', icon: Handshake },
  { id: 'operacoes_locais', label: 'Operacoes', color: '#EF4444', icon: MapPin },
  { id: 'administrativo_financeiro', label: 'Admin/Financeiro', color: '#14B8A6', icon: Wallet },
  { id: 'pedagogico', label: 'Pedagogico', color: '#EC4899', icon: GraduationCap },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .join('')
    .toUpperCase();
}

function emptyPerson(): Omit<Person, 'id'> {
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

// ---------------------------------------------------------------------------
// EditPersonModal
// ---------------------------------------------------------------------------

function EditPersonModal({
  person,
  isNew,
  onSave,
  onDelete,
  onClose,
}: {
  person: Person | Omit<Person, 'id'>;
  isNew: boolean;
  onSave: (data: Omit<Person, 'id'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Person, 'id'>>({
    name: person.name,
    role: person.role,
    title: person.title,
    departmentIds: [...person.departmentIds],
    email: person.email,
    notes: person.notes,
    avatarUrl: person.avatarUrl,
    assembleiaConfirmed: person.assembleiaConfirmed,
  });

  const handleDeptToggle = (deptId: DepartmentId) => {
    setForm((prev) => {
      const has = prev.departmentIds.includes(deptId);
      return {
        ...prev,
        departmentIds: has
          ? prev.departmentIds.filter((d) => d !== deptId)
          : [...prev.departmentIds, deptId],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0A2463] border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h3 className="text-base font-bold text-white">
              {isNew ? 'Adicionar Pessoa' : 'Editar Pessoa'}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Nome
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                placeholder="Nome completo"
                autoFocus
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Funcao
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as PersonRole }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
              >
                {(Object.entries(ROLE_LABELS) as [PersonRole, string][]).map(([val, label]) => (
                  <option key={val} value={val} className="bg-[#0A2463] text-white">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Titulo / Cargo
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                placeholder="Ex: Diretor de Tecnologia"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email ?? ''}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value || null }))
                }
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                placeholder="email@exemplo.com"
              />
            </div>

            {/* Departments (checkboxes) */}
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">
                Departamentos
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_DEPARTMENT_IDS.map((deptId) => {
                  const checked = form.departmentIds.includes(deptId);
                  return (
                    <label
                      key={deptId}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs
                        ${checked ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300' : 'bg-white/[0.03] border border-white/5 text-white/50 hover:bg-white/[0.06]'}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleDeptToggle(deptId)}
                        className="sr-only"
                      />
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          checked
                            ? 'bg-amber-500 border-amber-500'
                            : 'border-white/20 bg-transparent'
                        }`}
                      >
                        {checked && <Check size={10} className="text-white" />}
                      </div>
                      {DEPT_LABELS[deptId]}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Observacoes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors resize-none"
                placeholder="Notas adicionais..."
              />
            </div>

            {/* Assembleia toggle */}
            <label className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.06] transition-colors">
              <input
                type="checkbox"
                checked={form.assembleiaConfirmed}
                onChange={(e) =>
                  setForm((p) => ({ ...p, assembleiaConfirmed: e.target.checked }))
                }
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  form.assembleiaConfirmed
                    ? 'bg-[#00E5A0] border-[#00E5A0]'
                    : 'border-white/20 bg-transparent'
                }`}
              >
                {form.assembleiaConfirmed && <Check size={11} className="text-white" />}
              </div>
              <span className="text-xs text-white/70">Assembleia Confirmada</span>
            </label>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              {!isNew && onDelete ? (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={13} />
                  Excluir
                </button>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-white/50 hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!form.name.trim()}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isNew ? 'Adicionar' : 'Salvar'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// LeaderCard
// ---------------------------------------------------------------------------

function LeaderCard({
  person,
  onClick,
  onEdit,
}: {
  person: Person;
  onClick?: (person: Person) => void;
  onEdit: (person: Person) => void;
}) {
  const initials = getInitials(person.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative mx-auto max-w-sm w-full rounded-2xl overflow-hidden group
        bg-gradient-to-br from-amber-500/20 via-[#0A2463]/80 to-[#061742]/90
        border border-amber-500/30
        shadow-[0_0_40px_rgba(245,158,11,0.15)]
        cursor-pointer"
      onClick={() => onClick?.(person)}
    >
      {/* Edit icon on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(person);
        }}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/10 text-white/50 opacity-0 group-hover:opacity-100 hover:bg-white/20 hover:text-white transition-all"
      >
        <Pencil size={13} />
      </button>

      {/* Top golden accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-4">
          {/* Avatar with golden ring */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-xl font-bold text-amber-300 ring-2 ring-amber-500/40 ring-offset-2 ring-offset-[#0A2463]">
              {initials}
            </div>
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#0A2463]"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Crown size={14} className="text-amber-400 shrink-0" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                Lider do Projeto
              </span>
            </div>
            <h3 className="text-lg font-bold text-white truncate">
              {person.name}
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              {person.title || 'Visao estrategica e coordenacao geral'}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Lider
          </span>
          {person.assembleiaConfirmed && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#00E5A0]/10 text-[#00E5A0]">
              Assembleia OK
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// PersonRow - a person row inside a department card
// ---------------------------------------------------------------------------

function PersonRow({
  person,
  color,
  onClick,
  onEdit,
}: {
  person: Person;
  color: string;
  onClick?: (person: Person) => void;
  onEdit: (person: Person) => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-2.5 p-2 rounded-lg group/row
        bg-white/[0.03] hover:bg-white/[0.06]
        transition-colors duration-150 cursor-pointer"
      onClick={() => onClick?.(person)}
    >
      <div className="relative shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ backgroundColor: `${color}30` }}
        >
          {getInitials(person.name)}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00E5A0] border-[1.5px] border-[#0A2463]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-white truncate">
          {person.name}
        </p>
        <p className="text-[9px] text-white/35 truncate">{person.title}</p>
      </div>
      {/* Edit button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(person);
        }}
        className="p-1 rounded text-white/30 opacity-0 group-hover/row:opacity-100 hover:text-white hover:bg-white/10 transition-all shrink-0"
      >
        <Pencil size={11} />
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// DepartmentCard
// ---------------------------------------------------------------------------

function DepartmentCard({
  config,
  people,
  index,
  onClick,
  onEdit,
}: {
  config: DeptDisplayConfig;
  people: Person[];
  index: number;
  onClick?: (person: Person) => void;
  onEdit: (person: Person) => void;
}) {
  const Icon = config.icon;
  const isEmpty = people.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      className="relative rounded-xl overflow-hidden bg-[#0A2463]/60 border border-white/5 hover:border-white/10 transition-all duration-200"
    >
      {/* Department color accent */}
      <div className="h-1" style={{ backgroundColor: config.color }} />

      <div className="p-4">
        {/* Department header */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icon size={15} style={{ color: config.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">
              {config.label}
            </h4>
            <p className="text-[10px] text-white/30">
              {people.length > 1
                ? `${people.length} membros`
                : people.length === 1
                ? '1 membro'
                : 'A Contratar'}
            </p>
          </div>
        </div>

        {/* People in department */}
        <div className="space-y-2">
          {people.map((person) => (
            <PersonRow
              key={person.id}
              person={person}
              color={config.color}
              onClick={onClick}
              onEdit={onEdit}
            />
          ))}

          {/* Hiring placeholder when empty */}
          {isEmpty && (
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-dashed border-white/10">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5">
                <HelpCircle size={14} className="text-white/20" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-white/30">A Contratar</p>
                <p className="text-[9px] text-white/15">Nenhum membro atribuido</p>
              </div>
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 shrink-0">
                Vaga
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// AdvisoryCard
// ---------------------------------------------------------------------------

function AdvisoryCard({
  person,
  index,
  onClick,
  onEdit,
}: {
  person: Person;
  index: number;
  onClick?: (person: Person) => void;
  onEdit: (person: Person) => void;
}) {
  const initials = getInitials(person.name);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.06, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-3 p-3 rounded-xl group/adv
        bg-[#0A2463]/40 border border-white/5
        hover:border-purple-500/20 transition-all duration-200 cursor-pointer"
      onClick={() => onClick?.(person)}
    >
      <div className="relative shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-purple-300 bg-purple-500/15">
          {initials}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-purple-400 border-[1.5px] border-[#0A2463]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate">{person.name}</p>
        <p className="text-[10px] text-white/35 truncate">{person.title}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(person);
        }}
        className="p-1 rounded text-white/30 opacity-0 group-hover/adv:opacity-100 hover:text-white hover:bg-white/10 transition-all shrink-0"
      >
        <Pencil size={11} />
      </button>
      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 shrink-0">
        Convidado
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ConnectingLine / HorizontalBranch (visual elements)
// ---------------------------------------------------------------------------

function ConnectingLine({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="w-px h-8 bg-gradient-to-b from-amber-500/40 to-white/10" />
    </div>
  );
}

function ConnectingLineThin({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="w-px h-6 bg-gradient-to-b from-white/15 to-white/5" />
    </div>
  );
}

function HorizontalBranch() {
  return (
    <div className="hidden sm:flex justify-center px-8">
      <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main OrgChart Component
// ---------------------------------------------------------------------------

export default function OrgChart({ onPersonClick }: OrgChartProps) {
  const { teamPeople, updatePerson, addPerson, deletePerson } = useProject();

  // Modal state
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Derived data
  const leader = useMemo(
    () => teamPeople.find((p) => p.role === 'lider') ?? null,
    [teamPeople],
  );

  const advisoryBoard = useMemo(
    () => teamPeople.filter((p) => p.role === 'convidado'),
    [teamPeople],
  );

  // For each display department, find all people whose departmentIds includes it
  const deptPeopleMap = useMemo(() => {
    const map: Record<DepartmentId, Person[]> = {} as any;
    for (const cfg of deptDisplayConfigs) {
      map[cfg.id] = teamPeople.filter((p) => p.departmentIds.includes(cfg.id));
    }
    return map;
  }, [teamPeople]);

  // Handlers
  const handleOpenEdit = useCallback((person: Person) => {
    setEditingPerson(person);
    setIsAddingNew(false);
  }, []);

  const handleOpenAdd = useCallback(() => {
    setEditingPerson(null);
    setIsAddingNew(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingPerson(null);
    setIsAddingNew(false);
  }, []);

  const handleSave = useCallback(
    (data: Omit<Person, 'id'>) => {
      if (editingPerson) {
        updatePerson(editingPerson.id, data);
      } else {
        addPerson(data);
      }
      handleCloseModal();
    },
    [editingPerson, updatePerson, addPerson, handleCloseModal],
  );

  const handleDelete = useCallback(() => {
    if (editingPerson) {
      deletePerson(editingPerson.id);
      handleCloseModal();
    }
  }, [editingPerson, deletePerson, handleCloseModal]);

  // Click on person: fire the external callback AND open edit
  const handlePersonClick = useCallback(
    (person: Person) => {
      onPersonClick?.(person);
    },
    [onPersonClick],
  );

  return (
    <div className="w-full space-y-8">
      {/* Title & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Organograma i10
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-[10px] text-white/30">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Lider
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00E5A0]" /> Fundador
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" /> Convidado
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00B4D8]" /> Contratacao
            </span>
          </div>
          {/* Add Person button */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
          >
            <Plus size={13} />
            Adicionar Pessoa
          </button>
        </div>
      </div>

      {/* ====== HIERARCHY VISUALIZATION ====== */}
      <section className="p-4 sm:p-8 rounded-2xl bg-[#061742]/50 border border-white/5">
        {/* Level 1: Leader */}
        {leader ? (
          <LeaderCard
            person={leader}
            onClick={handlePersonClick}
            onEdit={handleOpenEdit}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-sm w-full p-6 rounded-2xl bg-white/[0.02] border border-dashed border-amber-500/20 text-center"
          >
            <Crown size={24} className="text-amber-400/40 mx-auto mb-2" />
            <p className="text-xs text-white/30">Nenhum lider definido</p>
            <p className="text-[10px] text-white/15 mt-1">
              Adicione uma pessoa com a funcao &quot;Lider&quot;
            </p>
          </motion.div>
        )}

        {/* Connecting line from leader to departments */}
        <ConnectingLine />

        {/* Horizontal branch line */}
        <HorizontalBranch />

        {/* Level 2: Departments - responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {deptDisplayConfigs.map((config, i) => (
            <DepartmentCard
              key={config.id}
              config={config}
              people={deptPeopleMap[config.id]}
              index={i}
              onClick={handlePersonClick}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      </section>

      {/* ====== CONSELHO CONSULTIVO ====== */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Users size={16} className="text-purple-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Conselho Consultivo</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/40">
            {advisoryBoard.length}
          </span>
        </div>

        <ConnectingLineThin className="mb-2" />

        {advisoryBoard.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {advisoryBoard.map((person, i) => (
              <AdvisoryCard
                key={person.id}
                person={person}
                index={i}
                onClick={handlePersonClick}
                onEdit={handleOpenEdit}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5">
              <HelpCircle size={16} className="text-white/20" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/30">Nenhum convidado</p>
              <p className="text-[10px] text-white/15">
                Adicione pessoas com a funcao &quot;Convidado&quot; para popular o conselho consultivo
              </p>
            </div>
          </motion.div>
        )}
      </section>

      {/* ====== CONSELHO FISCAL ====== */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Users size={16} className="text-[#00B4D8]" />
          </div>
          <h3 className="text-sm font-bold text-white">Conselho Fiscal</h3>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5">
            <HelpCircle size={16} className="text-white/20" />
          </div>
          <div>
            <p className="text-xs font-medium text-white/30">A Definir</p>
            <p className="text-[10px] text-white/15">
              Membros do Conselho Fiscal serao definidos na proxima assembleia
            </p>
          </div>
        </motion.div>
      </section>

      {/* ====== COORDENACAO CIENTIFICA ====== */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Users size={16} className="text-[#00B4D8]" />
          </div>
          <h3 className="text-sm font-bold text-white">Coordenacao Cientifica</h3>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5">
            <HelpCircle size={16} className="text-white/20" />
          </div>
          <div>
            <p className="text-xs font-medium text-white/30">A Definir</p>
            <p className="text-[10px] text-white/15">
              Coordenacao Cientifica em processo de estruturacao
            </p>
          </div>
        </motion.div>
      </section>

      {/* ====== EDIT / ADD MODAL ====== */}
      {(editingPerson || isAddingNew) && (
        <EditPersonModal
          person={editingPerson ?? emptyPerson() as Person}
          isNew={isAddingNew}
          onSave={handleSave}
          onDelete={editingPerson ? handleDelete : undefined}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
