'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import type { Person, PersonRole, DepartmentId } from '../data/types';

interface PersonCardProps {
  person: Person;
  compact?: boolean;
  index?: number;
  onClick?: (person: Person) => void;
}

const roleConfig: Record<
  PersonRole,
  { label: string; color: string; bg: string; border: string }
> = {
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
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
  },
  parceiro: {
    label: 'Parceiro',
    color: 'text-[#00E5A0]',
    bg: 'bg-[#00E5A0]/15',
    border: 'border-[#00E5A0]/30',
  },
};

const departmentColorMap: Record<DepartmentId, string> = {
  juridico: '#8B5CF6',
  tecnologia: '#00E5A0',
  relacoes_publicas: '#F59E0B',
  operacoes_locais: '#EF4444',
  santa_catarina: '#06B6D4',
  pedagogico: '#EC4899',
  administrativo_financeiro: '#3B82F6',
};

const departmentLabelMap: Record<DepartmentId, string> = {
  juridico: 'Juridico',
  tecnologia: 'Tecnologia',
  relacoes_publicas: 'Relacoes Publicas',
  operacoes_locais: 'Operacoes',
  santa_catarina: 'Santa Catarina',
  pedagogico: 'Pedagogico',
  administrativo_financeiro: 'Admin/Financeiro',
};

function getDeptColor(deptIds: DepartmentId[]): string {
  if (deptIds.length === 0) return '#6B7280';
  return departmentColorMap[deptIds[0]] ?? '#6B7280';
}

function getDeptLabel(deptIds: DepartmentId[]): string {
  if (deptIds.length === 0) return '';
  const labels = deptIds.map((id) => departmentLabelMap[id] ?? id);
  return labels.join(', ');
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .join('')
    .toUpperCase();
}

/** Determine visual status from the PersonRole */
function getStatusDot(role: PersonRole): string {
  switch (role) {
    case 'fundador':
      return 'bg-[#00E5A0]'; // active green
    case 'convidado':
      return 'bg-amber-400'; // pending invite
    case 'contratacao':
      return 'bg-[#00B4D8]'; // hiring blue
    case 'parceiro':
      return 'bg-[#00E5A0]'; // active partner
    default:
      return 'bg-white/30';
  }
}

function getStatusLabel(role: PersonRole): string {
  switch (role) {
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

export default function PersonCard({
  person,
  compact = false,
  index = 0,
  onClick,
}: PersonCardProps) {
  const roleCfg = roleConfig[person.role];
  const deptColor = getDeptColor(person.departmentIds);
  const deptLabel = getDeptLabel(person.departmentIds);
  const initials = getInitials(person.name);
  const statusDot = getStatusDot(person.role);
  const statusLabel = getStatusLabel(person.role);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => onClick?.(person)}
        className={`
          flex items-center gap-3 p-3 rounded-xl
          bg-[#0A2463]/60 border border-white/5
          hover:border-white/10 transition-all duration-200
          ${onClick ? 'cursor-pointer' : ''}
        `}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: `${deptColor}30` }}
          >
            {initials}
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0A2463] ${statusDot}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">
            {person.name}
          </p>
          <p className="text-[10px] text-white/40 truncate">{person.title}</p>
        </div>

        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${roleCfg.bg} ${roleCfg.color}`}
        >
          {roleCfg.label}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={() => onClick?.(person)}
      className={`
        relative rounded-xl overflow-hidden
        bg-[#0A2463]/60 border border-white/5
        hover:border-white/10 hover:shadow-lg
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Top accent */}
      <div className="h-1" style={{ backgroundColor: deptColor }} />

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
              {person.role === 'fundador' && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#00E5A0]"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
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
          {/* Role badge */}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleCfg.bg} ${roleCfg.color} ${roleCfg.border}`}
          >
            {roleCfg.label}
          </span>

          {/* Status badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/50">
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
            {statusLabel}
          </span>

          {/* Assembleia confirmed */}
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
