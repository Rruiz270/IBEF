'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ArrowUpDown } from 'lucide-react';
import type { DepartmentId } from '@/data/types';
import { departments } from '@/data/projectData';

export type KanbanSortMode = 'prioridade' | 'prazo' | 'progresso';

interface KanbanFilterBarProps {
  departmentFilter: DepartmentId | 'todas';
  onDepartmentChange: (dept: DepartmentId | 'todas') => void;
  sortMode: KanbanSortMode;
  onSortChange: (sort: KanbanSortMode) => void;
}

const SORT_OPTIONS: { key: KanbanSortMode; label: string }[] = [
  { key: 'prioridade', label: 'Prioridade' },
  { key: 'prazo', label: 'Prazo' },
  { key: 'progresso', label: 'Progresso' },
];

export default function KanbanFilterBar({
  departmentFilter,
  onDepartmentChange,
  sortMode,
  onSortChange,
}: KanbanFilterBarProps) {
  const [open, setOpen] = useState(false);

  const activeCount =
    (departmentFilter !== 'todas' ? 1 : 0) +
    (sortMode !== 'prioridade' ? 1 : 0);

  return (
    <div className="mb-3">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 hover:bg-white/[0.06] transition-colors"
      >
        <Filter size={13} />
        <span>Filtros</span>
        {activeCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-[#00B4D8]/20 text-[#00B4D8] text-[10px] font-semibold">
            {activeCount}
          </span>
        )}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={13} />
        </motion.span>
      </button>

      {/* Expandable panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2">
              {/* Department filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-white/30 shrink-0 w-20">Departamento</span>
                <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
                  <button
                    onClick={() => onDepartmentChange('todas')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors ${
                      departmentFilter === 'todas'
                        ? 'bg-[#00B4D8]/20 text-[#00B4D8] border border-[#00B4D8]/30'
                        : 'bg-white/[0.04] text-white/40 border border-white/[0.06] hover:bg-white/[0.08]'
                    }`}
                  >
                    Todos
                  </button>
                  {departments.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => onDepartmentChange(d.id)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors ${
                        departmentFilter === d.id
                          ? 'bg-[#00B4D8]/20 text-[#00B4D8] border border-[#00B4D8]/30'
                          : 'bg-white/[0.04] text-white/40 border border-white/[0.06] hover:bg-white/[0.08]'
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-white/30 shrink-0 w-20">
                  <ArrowUpDown size={10} className="inline mr-1" />
                  Ordenar
                </span>
                <div className="flex gap-1.5">
                  {SORT_OPTIONS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => onSortChange(s.key)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors ${
                        sortMode === s.key
                          ? 'bg-[#00E5A0]/20 text-[#00E5A0] border border-[#00E5A0]/30'
                          : 'bg-white/[0.04] text-white/40 border border-white/[0.06] hover:bg-white/[0.08]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
