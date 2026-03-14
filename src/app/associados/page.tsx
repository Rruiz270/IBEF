'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building,
  Crown,
  UserPlus,
  Globe,
  Briefcase,
  Code,
  Calculator,
} from 'lucide-react';
import { people, companies } from '../../data/projectData';
import type { AssociateCompany } from '../../data/types';
import PersonCard from '../../components/PersonCard';

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
// Company Card Sub-component
// ---------------------------------------------------------------------------

function CompanyCard({
  company,
  index,
}: {
  company: AssociateCompany;
  index: number;
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
      className="relative rounded-xl overflow-hidden bg-[#0A2463]/60 border border-white/5 hover:border-white/10 hover:shadow-lg transition-all duration-200"
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

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${typeCfg.bg}`}
          >
            <TypeIcon size={20} className={typeCfg.color} />
          </div>

          <div className="flex-1 min-w-0">
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
// Page Component
// ---------------------------------------------------------------------------

export default function AssociadosPage() {
  // Filter people by role
  const fundadores = useMemo(
    () => people.filter((p) => p.role === 'fundador'),
    [],
  );

  const convidados = useMemo(
    () => people.filter((p) => p.role === 'convidado'),
    [],
  );

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
              Empresas e pessoas associadas ao IBEF
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
            {companies.length}
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
          <span className="text-xs text-white/30 ml-auto">
            {fundadores.length} membro(s)
          </span>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {fundadores.map((person, idx) => (
            <motion.div key={person.id} variants={itemVariants}>
              <PersonCard person={person} index={idx} />
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
          <span className="text-xs text-white/30 ml-auto">
            {convidados.length} membro(s)
          </span>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {convidados.map((person, idx) => (
            <motion.div key={person.id} variants={itemVariants}>
              <PersonCard person={person} index={idx} />
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
          <span className="text-xs text-white/30 ml-auto">
            {companies.length} empresa(s)
          </span>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {companies.map((company, idx) => (
            <motion.div key={company.id} variants={itemVariants}>
              <CompanyCard company={company} index={idx} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
