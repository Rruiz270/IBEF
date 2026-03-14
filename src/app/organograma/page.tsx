'use client';

import { motion } from 'framer-motion';
import { Network, Users } from 'lucide-react';
import OrgChart from '../../components/OrgChart';
import PersonCard from '../../components/PersonCard';
import { people } from '../../data/projectData';

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

export default function OrganogramaPage() {
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
            <Network size={20} className="text-[#00B4D8]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Organograma
            </h1>
            <p className="text-sm text-white/50">
              Estrutura organizacional do Instituto i10
            </p>
          </div>
        </div>
      </motion.div>

      {/* Componente OrgChart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <OrgChart />
      </motion.div>

      {/* Seção: Todos os Membros */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Users size={16} className="text-[#00B4D8]" />
          </div>
          <h2 className="text-lg font-bold text-white">Todos os Membros</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">
            {people.length}
          </span>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {people.map((person, index) => (
            <motion.div key={person.id} variants={itemVariants}>
              <PersonCard person={person} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
