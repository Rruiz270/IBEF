'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Scale,
  AlertTriangle,
  User,
  ShieldCheck,
  FileWarning,
} from 'lucide-react';
import { people, milestones } from '../../data/projectData';
import { useProject } from '../../contexts/ProjectContext';
import TaskEditModal from '../../components/TaskEditModal';
import type { Person } from '../../data/types';
import TaskCard from '../../components/TaskCard';
import CountdownCard from '../../components/CountdownCard';

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function JuridicoPage() {
  const { tasks } = useProject();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Build people map
  const peopleMap = useMemo<Record<string, Person>>(() => {
    const map: Record<string, Person> = {};
    for (const p of people) {
      map[p.id] = p;
    }
    return map;
  }, []);

  // Filter juridico tasks
  const juridicoTasks = useMemo(
    () => tasks.filter((t) => t.departmentId === 'juridico'),
    [tasks],
  );

  // Department leads: Mercia and Emerson
  const leads = useMemo(
    () =>
      people.filter(
        (p) => p.id === 'pessoa-mercia' || p.id === 'pessoa-emerson',
      ),
    [],
  );

  // Juridico-related milestones
  const juridicoMilestones = useMemo(
    () => milestones.filter((m) => m.departmentIds.includes('juridico')),
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
          <div className="w-10 h-10 rounded-xl bg-[#6366F1]/20 flex items-center justify-center">
            <Scale size={20} className="text-[#6366F1]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Jur\u00eddico
            </h1>
            <p className="text-sm text-white/50 mt-0.5">
              Assessoria jur\u00eddica, contratos e conformidade regulat\u00f3ria
            </p>
          </div>
        </div>
      </motion.div>

      {/* Critical Deadline Banner - Estatuto Registration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-[#0A2463] to-red-900/30 p-1">
          {/* Pulsing border */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-red-500/30"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileWarning size={16} className="text-red-400" />
              <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider">
                Prazo Cr\u00edtico Iminente
              </h2>
            </div>
            <CountdownCard
              targetDate="2026-03-18"
              title="Registro do Estatuto do IBEF"
              subtitle="Prazo CR\u00cdTICO - Quarta-feira 18/03/2026. Sem registro, o IBEF n\u00e3o existe juridicamente. Bloqueia todas as demais a\u00e7\u00f5es."
              urgency="critical"
              totalDays={18}
            />
          </div>
        </div>
      </motion.div>

      {/* Department Leads */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
          Lideran\u00e7a do Departamento
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {leads.map((lead, idx) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: idx === 0 ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + idx * 0.1, duration: 0.4 }}
              className="relative rounded-xl bg-[#0A2463]/60 border border-[#6366F1]/20 p-5 overflow-hidden"
            >
              {/* Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />

              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-[#6366F1]/20 flex items-center justify-center text-lg font-bold text-[#6366F1]">
                    {lead.name
                      .split(' ')
                      .map((n) => n.charAt(0))
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A2463] bg-[#00E5A0]">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#00E5A0]"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white">{lead.name}</h3>
                  <p className="text-xs text-white/50 mt-0.5">{lead.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/30">
                      Fundador
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#00E5A0]/10 text-[#00E5A0]">
                      Assembleia OK
                    </span>
                  </div>
                  {lead.notes && (
                    <p className="text-[10px] text-white/30 mt-2 leading-relaxed line-clamp-2">
                      {lead.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Tasks assigned count */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                <User size={12} className="text-white/30" />
                <span className="text-[11px] text-white/40">
                  {
                    juridicoTasks.filter((t) =>
                      t.assigneeIds.includes(lead.id),
                    ).length
                  }{' '}
                  tarefa(s) atribu\u00edda(s)
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Milestones */}
      {juridicoMilestones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
            Marcos Jur\u00eddicos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {juridicoMilestones.map((milestone) => (
              <CountdownCard
                key={milestone.id}
                targetDate={milestone.targetDate}
                title={milestone.title}
                subtitle={milestone.description}
                urgency={
                  milestone.isCritical
                    ? 'critical'
                    : milestone.status === 'em_andamento'
                      ? 'high'
                      : 'medium'
                }
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* All Juridico Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
            Todas as Tarefas do Jur\u00eddico
          </h2>
          <span className="text-xs text-white/30">
            {juridicoTasks.length} tarefa(s)
          </span>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {juridicoTasks.map((task) => (
            <motion.div key={task.id} variants={itemVariants}>
              <TaskCard
                task={task}
                people={peopleMap}
                onEdit={(taskId) => setEditingTaskId(taskId)}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Task Edit Modal */}
      <TaskEditModal taskId={editingTaskId} onClose={() => setEditingTaskId(null)} />
    </div>
  );
}
