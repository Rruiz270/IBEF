'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  FolderOpen,
  Download,
  Trash2,
  Search,
  FileText,
  Calendar,
} from 'lucide-react';

import { useProject } from '@/contexts/ProjectContext';
import { departments } from '@/data/projectData';
import { downloadFile, formatFileSize, getFileIcon } from '@/lib/fileStorage';
import type { DepartmentId, FileAttachment } from '@/data/types';

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ---------------------------------------------------------------------------
// Department tab data
// ---------------------------------------------------------------------------

const ALL_TAB = 'all';

const tabs: { id: string; label: string }[] = [
  { id: ALL_TAB, label: 'Todos' },
  ...departments.map((d) => ({ id: d.id, label: d.name })),
];

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function DocumentosPage() {
  const {
    fileAttachments,
    removeFileAttachment,
    tasks,
    hiringPositions,
  } = useProject();

  const [activeTab, setActiveTab] = useState<string>(ALL_TAB);
  const [search, setSearch] = useState('');

  // Lookup maps for parent entity names
  const taskMap = useMemo(() =>
    Object.fromEntries(tasks.map((t) => [t.id, t.title])),
    [tasks]
  );
  const hiringMap = useMemo(() =>
    Object.fromEntries(hiringPositions.map((h) => [h.id, h.title])),
    [hiringPositions]
  );

  // Filter attachments
  const filteredAttachments = useMemo(() => {
    let list = [...fileAttachments];

    // Department filter
    if (activeTab !== ALL_TAB) {
      list = list.filter((f) => f.departmentId === activeTab);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }

    // Sort by upload date descending
    list.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return list;
  }, [fileAttachments, activeTab, search]);

  // Group by department
  const grouped = useMemo(() => {
    if (activeTab !== ALL_TAB) {
      return [{ departmentId: activeTab as DepartmentId, files: filteredAttachments }];
    }
    const map = new Map<string, FileAttachment[]>();
    filteredAttachments.forEach((f) => {
      const existing = map.get(f.departmentId) || [];
      existing.push(f);
      map.set(f.departmentId, existing);
    });
    return Array.from(map.entries()).map(([departmentId, files]) => ({
      departmentId: departmentId as DepartmentId,
      files,
    }));
  }, [filteredAttachments, activeTab]);

  function getEntityLabel(file: FileAttachment): string {
    if (file.entityType === 'task') {
      return taskMap[file.entityId] || 'Tarefa removida';
    }
    return hiringMap[file.entityId] || 'Vaga removida';
  }

  function getDeptName(id: string): string {
    return departments.find((d) => d.id === id)?.name ?? id;
  }

  function getDeptColor(id: string): string {
    return departments.find((d) => d.id === id)?.color ?? '#94A3B8';
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="absolute -top-20 left-1/4 w-96 h-64 bg-[#00B4D8]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/10 flex items-center justify-center">
              <FolderOpen size={20} className="text-[#00B4D8]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Documentos do Projeto
              </h1>
              <p className="text-sm text-white/50 mt-0.5">
                Todos os arquivos anexados a tarefas e contratações
              </p>
            </div>
          </div>

          <div className="text-sm text-white/40">
            {fileAttachments.length} arquivo{fileAttachments.length !== 1 ? 's' : ''} no total
          </div>
        </div>

        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </motion.header>

      {/* Search + Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* Search bar */}
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome do arquivo..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-transparent transition"
          />
        </div>

        {/* Department tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/30'
                  : 'bg-white/[0.03] text-white/50 border border-white/5 hover:bg-white/[0.06] hover:text-white/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* File list */}
      {filteredAttachments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-16"
        >
          <FileText size={40} className="mx-auto text-white/10 mb-3" />
          <p className="text-sm text-white/30">
            {search ? 'Nenhum arquivo encontrado para esta busca.' : 'Nenhum arquivo anexado ainda.'}
          </p>
          <p className="text-xs text-white/20 mt-1">
            Adicione arquivos através do editor de tarefas ou contratações.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {grouped.map(({ departmentId, files }) => (
            <motion.div key={departmentId} variants={itemVariants}>
              {/* Department header */}
              {activeTab === ALL_TAB && (
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getDeptColor(departmentId) }}
                  />
                  <h3 className="text-sm font-semibold text-white/70">
                    {getDeptName(departmentId)}
                  </h3>
                  <span className="text-[10px] text-white/30">
                    ({files.length} arquivo{files.length !== 1 ? 's' : ''})
                  </span>
                </div>
              )}

              {/* Files */}
              <div className="rounded-xl bg-[#061742]/60 border border-white/5 overflow-hidden divide-y divide-white/[0.04]">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* File icon */}
                    <span className="text-lg shrink-0" aria-hidden>
                      {getFileIcon(file.type, file.name)}
                    </span>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 font-medium truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-white/30">
                          {formatFileSize(file.size)}
                        </span>
                        <span className="text-[10px] text-white/20">&middot;</span>
                        <span className="text-[10px] text-white/30">
                          {file.entityType === 'task' ? 'Tarefa' : 'Vaga'}:{' '}
                          <span className="text-white/45">{getEntityLabel(file)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Upload date */}
                    <div className="hidden sm:flex items-center gap-1 shrink-0 text-[10px] text-white/25">
                      <Calendar size={10} />
                      {new Date(file.uploadedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => downloadFile(file.id, file.name)}
                      className="shrink-0 p-1.5 rounded-md hover:bg-white/10 text-white/30 hover:text-[#00B4D8] transition-colors"
                      title="Baixar"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => removeFileAttachment(file.id)}
                      className="shrink-0 p-1.5 rounded-md hover:bg-red-500/15 text-white/30 hover:text-red-400 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="h-4" />
    </div>
  );
}
