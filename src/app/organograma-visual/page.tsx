'use client';

import { motion } from 'framer-motion';
import { Network, Users, Plus } from 'lucide-react';
import OrgChart from '../../components/OrgChart';
import PersonCard from '../../components/PersonCard';
import { people, departments } from '../../data/projectData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

// Cores por departamento
const deptColors: Record<string, { bg: string; border: string; icon: string; text: string }> = {
  juridico: {
    bg: 'from-violet-900/40 to-violet-800/30',
    border: 'border-violet-500/30',
    icon: '⚖️',
    text: 'text-violet-300',
  },
  tecnologia: {
    bg: 'from-emerald-900/40 to-emerald-800/30',
    border: 'border-emerald-500/30',
    icon: '💻',
    text: 'text-emerald-300',
  },
  relacoes_publicas: {
    bg: 'from-amber-900/40 to-amber-800/30',
    border: 'border-amber-500/30',
    icon: '🤝',
    text: 'text-amber-300',
  },
  operacoes_locais: {
    bg: 'from-rose-900/40 to-rose-800/30',
    border: 'border-rose-500/30',
    icon: '📍',
    text: 'text-rose-300',
  },
  administrativo_financeiro: {
    bg: 'from-cyan-900/40 to-cyan-800/30',
    border: 'border-cyan-500/30',
    icon: '💰',
    text: 'text-cyan-300',
  },
  pedagogico: {
    bg: 'from-pink-900/40 to-pink-800/30',
    border: 'border-pink-500/30',
    icon: '🎓',
    text: 'text-pink-300',
  },
  santa_catarina: {
    bg: 'from-indigo-900/40 to-indigo-800/30',
    border: 'border-indigo-500/30',
    icon: '🏛️',
    text: 'text-indigo-300',
  },
};

function getRoleColor(role: string): string {
  switch (role) {
    case 'lider':
      return 'bg-amber-500/20 border-amber-500/50 text-amber-300';
    case 'fundador':
      return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
    case 'convidado':
      return 'bg-purple-500/20 border-purple-500/50 text-purple-300';
    case 'contratacao':
      return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300';
    default:
      return 'bg-slate-500/20 border-slate-500/50 text-slate-300';
  }
}

function getLeaderCard(person: any) {
  const initials = person.name
    .split(' ')
    .map((n: string) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-full mx-auto mb-12"
    >
      <div className="bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-blue-600/20 border border-blue-500/30 rounded-2xl p-8 max-w-lg w-full backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-2xl font-bold text-white ring-2 ring-amber-400">
            {initials}
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              👑 Líder do Projeto
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{person.name}</h2>
            <p className="text-sm text-blue-200">{person.title}</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-semibold">
                Líder
              </span>
              {person.assembleiaConfirmed && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
                  Assembleia OK
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function OrganogramaVisualPage() {
  const leader = people.find((p) => p.role === 'lider');
  const allDepts = departments.filter((d) =>
    d.id !== 'santa_catarina' && d.id !== 'pedagogico' && d.id !== 'administrativo_financeiro'
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Network size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Organograma i10</h1>
            <p className="text-sm text-slate-400">Estrutura organizacional do Instituto i10</p>
          </div>
        </div>
      </motion.div>

      {/* Líder do Projeto */}
      {leader && (
        <div className="grid grid-cols-1">
          {getLeaderCard(leader)}
        </div>
      )}

      {/* Departamentos Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {allDepts.map((dept) => {
          const deptPeople = people.filter((p) => p.departmentIds.includes(dept.id));
          const colors = deptColors[dept.id] || deptColors.juridico;

          return (
            <motion.div key={dept.id} variants={itemVariants}>
              <div
                className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl overflow-hidden backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-slate-900/50`}
              >
                {/* Dept Header */}
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{colors.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{dept.name}</h3>
                      <p className="text-xs text-slate-400">{deptPeople.length} membro(s)</p>
                    </div>
                  </div>
                </div>

                {/* Dept Members */}
                <div className="p-4 space-y-3">
                  {deptPeople.length > 0 ? (
                    deptPeople.map((person) => {
                      const initials = person.name
                        .split(' ')
                        .map((n) => n.charAt(0))
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <motion.div
                          key={person.id}
                          whileHover={{ x: 4 }}
                          className={`p-3 rounded-lg border ${getRoleColor(
                            person.role
                          )} transition-all hover:shadow-md`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-white truncate">
                                {person.name}
                              </p>
                              <p className="text-xs text-slate-400 truncate">{person.title}</p>
                            </div>
                            {person.assembleiaConfirmed && (
                              <span className="text-xs px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded whitespace-nowrap">
                                ✓
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="p-3 rounded-lg border border-dashed border-slate-500/30 bg-slate-900/20 text-center">
                      <p className="text-xs text-slate-500">A contratar</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Conselho Fiscal & Consultivo */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-12"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Users size={16} className="text-purple-300" />
          </div>
          <h2 className="text-xl font-bold text-white">Órgãos Colegiados</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Conselho Fiscal */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-orange-900/40 to-orange-800/30 border border-orange-500/30 rounded-xl p-6 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">⚠️</span> Conselho Fiscal
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-900/40 rounded-lg border border-orange-500/20">
                <p className="text-sm font-semibold text-white">Emerson</p>
                <p className="text-xs text-slate-400">Conselho Fiscal</p>
              </div>
              <div className="p-3 bg-slate-900/40 rounded-lg border border-orange-500/20">
                <p className="text-sm font-semibold text-white">Gustavo</p>
                <p className="text-xs text-slate-400">Conselho Fiscal (2º)</p>
              </div>
            </div>
          </motion.div>

          {/* Conselho Consultivo */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🎯</span> Conselho Consultivo
            </h3>
            <div className="space-y-3">
              {people
                .filter((p) => p.role === 'convidado')
                .map((person) => (
                  <div key={person.id} className="p-3 bg-slate-900/40 rounded-lg border border-purple-500/20">
                    <p className="text-sm font-semibold text-white">{person.name}</p>
                    <p className="text-xs text-slate-400">{person.title}</p>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm mt-12"
      >
        <h3 className="text-amber-400 font-bold mb-3">📌 Observações</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>
            <strong>Regimento Interno:</strong> Necessário para evitar conflito de interesses
            (Presidente + Diretor Executivo)
          </li>
          <li>
            <strong>Escritório:</strong> Edifício Corporativo Softplan, Sapiens Park, Av. Luiz
            Boiteux Piazza 1302, Canasvieiras, Florianópolis/SC
          </li>
          <li>
            <strong>Fundadores confirmados na assembleia:</strong> 7 membros com status "Assembleia OK"
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
