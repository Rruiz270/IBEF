'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users, HelpCircle } from 'lucide-react';
import PersonCard from './PersonCard';
import type { Person, OrgNode } from '../data/types';

interface OrgChartProps {
  data?: OrgNode;
  onPersonClick?: (person: Person) => void;
}

// Default organizational structure for IBEF
const defaultOrgData: OrgNode = {
  person: {
    id: 'raphael',
    name: 'Raphael Ruiz',
    role: 'fundador',
    title: 'Project Leader / Diretor Executivo Presidente',
    departmentIds: [],
    email: null,
    notes: 'Líder geral do projeto ETEC. Todos reportam a ele.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },
  expanded: true,
  children: [
    {
      label: 'Jurídico',
      person: {
        id: 'mercia',
        name: 'Mercia',
        role: 'parceiro',
        title: 'Assessoria Jurídica',
        departmentIds: ['juridico'],
        email: null,
        notes: '',
        avatarUrl: null,
        assembleiaConfirmed: false,
      },
      expanded: true,
      children: [
        {
          person: {
            id: 'emerson',
            name: 'Emerson',
            role: 'parceiro',
            title: 'Assessoria Jurídica',
            departmentIds: ['juridico'],
            email: null,
            notes: '',
            avatarUrl: null,
            assembleiaConfirmed: false,
          },
        },
      ],
    },
    {
      person: {
        id: 'bruno-almeida',
        name: 'Bruno Almeida',
        role: 'fundador',
        title: 'Diretor de Tecnologia',
        departmentIds: ['tecnologia'],
        email: null,
        notes: '',
        avatarUrl: null,
        assembleiaConfirmed: true,
      },
      expanded: true,
      children: [],
    },
    {
      person: {
        id: 'bruno-quick',
        name: 'Bruno Quick',
        role: 'fundador',
        title: 'Diretor de Relações Públicas',
        departmentIds: ['relacoes_publicas'],
        email: null,
        notes: '',
        avatarUrl: null,
        assembleiaConfirmed: true,
      },
      expanded: true,
      children: [],
    },
    {
      person: {
        id: 'gustavo',
        name: 'Gustavo',
        role: 'fundador',
        title: 'Diretor de Operações',
        departmentIds: ['operacoes_locais'],
        email: null,
        notes: '',
        avatarUrl: null,
        assembleiaConfirmed: true,
      },
      expanded: true,
      children: [],
    },
    {
      person: {
        id: 'enio',
        name: 'Enio',
        role: 'fundador',
        title: 'Diretor Admin/Financeiro',
        departmentIds: ['administrativo_financeiro'],
        email: null,
        notes: '',
        avatarUrl: null,
        assembleiaConfirmed: true,
      },
      expanded: true,
      children: [],
    },
  ],
};

const advisoryBoard: Person[] = [
  {
    id: 'daniel-aguado',
    name: 'Daniel Aguado',
    role: 'convidado',
    title: 'Conselheiro',
    departmentIds: [],
    email: null,
    notes: 'Conselho Consultivo',
    avatarUrl: null,
    assembleiaConfirmed: false,
  },
  {
    id: 'franco',
    name: 'Franco',
    role: 'convidado',
    title: 'Conselheiro',
    departmentIds: [],
    email: null,
    notes: 'Conselho Consultivo',
    avatarUrl: null,
    assembleiaConfirmed: false,
  },
  {
    id: 'daniel-mendes',
    name: 'Daniel Mendes',
    role: 'convidado',
    title: 'Conselheiro',
    departmentIds: [],
    email: null,
    notes: 'Conselho Consultivo',
    avatarUrl: null,
    assembleiaConfirmed: false,
  },
  {
    id: 'mariza',
    name: 'Mariza',
    role: 'convidado',
    title: 'Conselheira',
    departmentIds: [],
    email: null,
    notes: 'Conselho Consultivo',
    avatarUrl: null,
    assembleiaConfirmed: false,
  },
];

interface OrgNodeComponentProps {
  node: OrgNode;
  level: number;
  onToggle: (personId: string) => void;
  onPersonClick?: (person: Person) => void;
}

function OrgNodeComponent({
  node,
  level,
  onToggle,
  onPersonClick,
}: OrgNodeComponentProps) {
  const hasChildren = node.children != null && node.children.length > 0;
  const isExpanded = node.expanded ?? true;

  return (
    <div className="relative">
      <div className="flex items-start gap-2">
        {/* Expand/collapse button */}
        {hasChildren ? (
          <button
            onClick={() => onToggle(node.person.id)}
            className="mt-3 p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors shrink-0"
            aria-label={isExpanded ? 'Recolher' : 'Expandir'}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} />
            </motion.div>
          </button>
        ) : (
          <div className="w-7 shrink-0" />
        )}

        {/* Person card */}
        <div className="flex-1 max-w-xs">
          {node.label && (
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-1 ml-1">
              {node.label}
            </p>
          )}
          <PersonCard
            person={node.person}
            compact={level > 0}
            onClick={onPersonClick}
          />
        </div>
      </div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="ml-4 sm:ml-6 pl-4 sm:pl-6 border-l border-white/10 mt-2 space-y-2">
              {node.children!.map((child) => (
                <OrgNodeComponent
                  key={child.person.id}
                  node={child}
                  level={level + 1}
                  onToggle={onToggle}
                  onPersonClick={onPersonClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionHeader({
  title,
  icon: Icon,
  count,
}: {
  title: string;
  icon: React.ElementType;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
        <Icon size={16} className="text-[#00B4D8]" />
      </div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {count != null && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/40">
          {count}
        </span>
      )}
    </div>
  );
}

function TBDCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10"
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5">
        <HelpCircle size={16} className="text-white/20" />
      </div>
      <div>
        <p className="text-xs font-medium text-white/30">{title}</p>
        <p className="text-[10px] text-white/15">{description}</p>
      </div>
    </motion.div>
  );
}

export default function OrgChart({ data, onPersonClick }: OrgChartProps) {
  const [orgTree, setOrgTree] = useState<OrgNode>(data ?? defaultOrgData);

  const toggleNode = useCallback((personId: string) => {
    const toggleInTree = (node: OrgNode): OrgNode => {
      if (node.person.id === personId) {
        return { ...node, expanded: !(node.expanded ?? true) };
      }
      if (node.children) {
        return { ...node, children: node.children.map(toggleInTree) };
      }
      return node;
    };
    setOrgTree((prev) => toggleInTree(prev));
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Main org tree */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Organograma IBEF
          </h2>
          <div className="flex items-center gap-3 text-[10px] text-white/30">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00E5A0]" /> Fundador
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Convidado
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00B4D8]" />{' '}
              Contratação
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-[#061742]/50 border border-white/5">
          <OrgNodeComponent
            node={orgTree}
            level={0}
            onToggle={toggleNode}
            onPersonClick={onPersonClick}
          />
        </div>
      </section>

      {/* Conselho Consultivo (Advisory Board) */}
      <section>
        <SectionHeader
          title="Conselho Consultivo"
          icon={Users}
          count={advisoryBoard.length}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {advisoryBoard.map((person, i) => (
            <PersonCard
              key={person.id}
              person={person}
              compact
              index={i}
              onClick={onPersonClick}
            />
          ))}
        </div>
      </section>

      {/* Conselho Fiscal */}
      <section>
        <SectionHeader title="Conselho Fiscal" icon={Users} />
        <TBDCard
          title="A Definir"
          description="Membros do Conselho Fiscal serão definidos na próxima assembleia"
        />
      </section>

      {/* Coordenação Científica */}
      <section>
        <SectionHeader title="Coordenação Científica" icon={Users} />
        <TBDCard
          title="A Definir"
          description="Coordenação Científica em processo de estruturação"
        />
      </section>
    </div>
  );
}
