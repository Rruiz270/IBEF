'use client';

import { motion } from 'framer-motion';
import { Crown, Users, HelpCircle, Scale, Code, Handshake, MapPin, GraduationCap, Wallet } from 'lucide-react';
import { people, departments } from '../data/projectData';
import type { Person, DepartmentId } from '../data/types';

interface OrgChartProps {
  onPersonClick?: (person: Person) => void;
}

// ---------------------------------------------------------------------------
// Department config: display data for each department in the org chart
// ---------------------------------------------------------------------------

interface DeptConfig {
  id: DepartmentId;
  label: string;
  color: string;
  icon: React.ElementType;
  leadIds: string[];
  isHiring?: boolean;
}

const deptConfigs: DeptConfig[] = [
  {
    id: 'juridico',
    label: 'Juridico',
    color: '#8B5CF6',
    icon: Scale,
    leadIds: ['pessoa-mercia', 'pessoa-emerson'],
  },
  {
    id: 'tecnologia',
    label: 'Tecnologia',
    color: '#00E5A0',
    icon: Code,
    leadIds: ['pessoa-bruno-almeida'],
  },
  {
    id: 'relacoes_publicas',
    label: 'Relacoes Publicas',
    color: '#F59E0B',
    icon: Handshake,
    leadIds: ['pessoa-bruno-quick'],
  },
  {
    id: 'operacoes_locais',
    label: 'Operacoes',
    color: '#EF4444',
    icon: MapPin,
    leadIds: ['pessoa-gustavo'],
  },
  {
    id: 'administrativo_financeiro',
    label: 'Admin/Financeiro',
    color: '#14B8A6',
    icon: Wallet,
    leadIds: ['pessoa-enio'],
  },
  {
    id: 'pedagogico',
    label: 'Pedagogico',
    color: '#EC4899',
    icon: GraduationCap,
    leadIds: [],
    isHiring: true,
  },
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

function getPersonById(id: string): Person | undefined {
  return people.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// LeaderCard - prominent golden card for Raphael
// ---------------------------------------------------------------------------

function LeaderCard({
  person,
  onClick,
}: {
  person: Person;
  onClick?: (person: Person) => void;
}) {
  const initials = getInitials(person.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onClick?.(person)}
      className={`
        relative mx-auto max-w-sm w-full rounded-2xl overflow-hidden
        bg-gradient-to-br from-amber-500/20 via-[#0A2463]/80 to-[#061742]/90
        border border-amber-500/30
        shadow-[0_0_40px_rgba(245,158,11,0.15)]
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Top golden accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-4">
          {/* Avatar with golden ring */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-xl font-bold text-amber-300 ring-2 ring-amber-500/40 ring-offset-2 ring-offset-[#0A2463]">
              {initials}
            </div>
            {/* Pulsing gold indicator */}
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
              Visao estrategica e coordenacao geral
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
// DepartmentCard - card for each department with its leads
// ---------------------------------------------------------------------------

function DepartmentCard({
  config,
  index,
  onClick,
}: {
  config: DeptConfig;
  index: number;
  onClick?: (person: Person) => void;
}) {
  const Icon = config.icon;
  const leads = config.leadIds
    .map((id) => getPersonById(id))
    .filter((p): p is Person => p != null);

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
              {leads.length > 1 ? 'Co-lideres' : leads.length === 1 ? 'Lider' : ''}
              {config.isHiring ? 'A Contratar' : ''}
            </p>
          </div>
        </div>

        {/* People in department */}
        <div className="space-y-2">
          {leads.map((person) => (
            <motion.div
              key={person.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onClick?.(person)}
              className={`
                flex items-center gap-2.5 p-2 rounded-lg
                bg-white/[0.03] hover:bg-white/[0.06]
                transition-colors duration-150
                ${onClick ? 'cursor-pointer' : ''}
              `}
            >
              <div className="relative shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: `${config.color}30` }}
                >
                  {getInitials(person.name)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00E5A0] border-[1.5px] border-[#0A2463]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-white truncate">
                  {person.name}
                </p>
                <p className="text-[9px] text-white/35 truncate">
                  {person.title}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Hiring placeholder */}
          {config.isHiring && leads.length === 0 && (
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-dashed border-white/10">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5">
                <HelpCircle size={14} className="text-white/20" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-white/30">
                  A Contratar
                </p>
                <p className="text-[9px] text-white/15">
                  Gerente Pedagogico
                </p>
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
// AdvisoryCard - card for a conselho consultivo member
// ---------------------------------------------------------------------------

function AdvisoryCard({
  person,
  index,
  onClick,
}: {
  person: Person;
  index: number;
  onClick?: (person: Person) => void;
}) {
  const initials = getInitials(person.name);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.06, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick?.(person)}
      className={`
        flex items-center gap-3 p-3 rounded-xl
        bg-[#0A2463]/40 border border-white/5
        hover:border-purple-500/20 transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="relative shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-purple-300 bg-purple-500/15">
          {initials}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-purple-400 border-[1.5px] border-[#0A2463]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate">
          {person.name}
        </p>
        <p className="text-[10px] text-white/35 truncate">{person.title}</p>
      </div>
      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 shrink-0">
        Convidado
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ConnectingLine - CSS-based hierarchy connector
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

// ---------------------------------------------------------------------------
// HorizontalBranch - horizontal line with vertical drops for departments
// ---------------------------------------------------------------------------

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
  // Get the leader (Raphael)
  const leader = people.find((p) => p.role === 'lider') ?? people[0];

  // Get advisory board members
  const advisoryBoard = people.filter((p) => p.role === 'convidado');

  return (
    <div className="w-full space-y-8">
      {/* Title & Legend */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Organograma i10
        </h2>
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
      </div>

      {/* ====== HIERARCHY VISUALIZATION ====== */}
      <section className="p-4 sm:p-8 rounded-2xl bg-[#061742]/50 border border-white/5">
        {/* Level 1: Leader */}
        <LeaderCard person={leader} onClick={onPersonClick} />

        {/* Connecting line from leader to departments */}
        <ConnectingLine />

        {/* Horizontal branch line */}
        <HorizontalBranch />

        {/* Level 2: Departments - responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {deptConfigs.map((config, i) => (
            <DepartmentCard
              key={config.id}
              config={config}
              index={i}
              onClick={onPersonClick}
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

        {/* Connecting line from org chart to advisory */}
        <ConnectingLineThin className="mb-2" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {advisoryBoard.map((person, i) => (
            <AdvisoryCard
              key={person.id}
              person={person}
              index={i}
              onClick={onPersonClick}
            />
          ))}
        </div>
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
    </div>
  );
}
