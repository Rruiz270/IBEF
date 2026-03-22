'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Plus, Trash2, CheckSquare, Square, Search, Tag, Paperclip } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { people, departments } from '@/data/projectData';
import type { TaskStatus, TaskPriority, DepartmentId } from '@/data/types';
import FileUpload from './FileUpload';

// ---------------------------------------------------------------------------
// Mapas de labels (Português com acentos)
// ---------------------------------------------------------------------------

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'nao_iniciada', label: 'Não Iniciada' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluida', label: 'Concluída' },
  { value: 'bloqueada', label: 'Bloqueada' },
  { value: 'atrasada', label: 'Atrasada' },
  { value: 'cancelada', label: 'Cancelada' },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'critica', label: 'Crítica' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
];

const departmentOptions: { value: DepartmentId; label: string }[] = departments.map(
  (d) => ({ value: d.id, label: d.name })
);

/** Build a lookup from person IDs to names */
const peopleMap = Object.fromEntries(people.map((p) => [p.id, p.name]));

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface TaskEditModalProps {
  taskId: string | null;
  onClose: () => void;
}

export default function TaskEditModal({ taskId, onClose }: TaskEditModalProps) {
  const {
    getTask,
    updateTask,
    addSubtask,
    removeSubtask,
    toggleSubtask,
    deleteTask,
    tasks,
  } = useProject();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [depSearch, setDepSearch] = useState('');
  const [depDropdownOpen, setDepDropdownOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const depDropdownRef = useRef<HTMLDivElement>(null);

  // Resolve task
  const task = taskId ? getTask(taskId) : undefined;

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (depDropdownOpen) {
          setDepDropdownOpen(false);
        } else if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, depDropdownOpen, showDeleteConfirm]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (taskId) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [taskId]);

  // Close dependency dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        depDropdownRef.current &&
        !depDropdownRef.current.contains(e.target as Node)
      ) {
        setDepDropdownOpen(false);
      }
    }
    if (depDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [depDropdownOpen]);

  // Reset local state when taskId changes
  useEffect(() => {
    setNewSubtaskTitle('');
    setNewTagInput('');
    setDepSearch('');
    setDepDropdownOpen(false);
    setShowDeleteConfirm(false);
  }, [taskId]);

  // Available tasks for dependency selection (all except current)
  const availableDeps = useMemo(() => {
    if (!taskId) return [];
    return tasks.filter((t) => t.id !== taskId);
  }, [tasks, taskId]);

  // Filtered dependency list based on search
  const filteredDeps = useMemo(() => {
    if (!depSearch.trim()) return availableDeps;
    const q = depSearch.toLowerCase();
    return availableDeps.filter((t) => t.title.toLowerCase().includes(q));
  }, [availableDeps, depSearch]);

  if (!taskId || !task) return null;

  // At this point task is guaranteed non-null (narrowed by the guard above).
  const currentTask = task;

  // Resolve assignee names to comma-separated string
  const assigneeNames = currentTask.assigneeIds
    .map((id) => peopleMap[id] ?? id)
    .join(', ');

  // Resolve dependency names
  const currentDeps = (currentTask.dependencies ?? [])
    .map((depId) => {
      const depTask = tasks.find((t) => t.id === depId);
      return depTask ? { id: depTask.id, title: depTask.title } : null;
    })
    .filter(Boolean) as { id: string; title: string }[];

  // ------- handlers -------

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  function handleTitleChange(value: string) {
    updateTask(currentTask.id, { title: value });
  }

  function handleDescriptionChange(value: string) {
    updateTask(currentTask.id, { description: value });
  }

  function handleStatusChange(value: string) {
    updateTask(currentTask.id, { status: value as TaskStatus });
  }

  function handlePriorityChange(value: string) {
    updateTask(currentTask.id, { priority: value as TaskPriority });
  }

  function handleDepartmentChange(value: string) {
    updateTask(currentTask.id, { departmentId: value as DepartmentId });
  }

  function handleAssigneesChange(value: string) {
    // Reverse-lookup: convert names back to IDs when possible
    const names = value
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);
    const ids = names.map((name) => {
      const found = people.find(
        (p) => p.name.toLowerCase() === name.toLowerCase()
      );
      return found ? found.id : name;
    });
    updateTask(currentTask.id, { assigneeIds: ids });
  }

  function handleDueDateChange(value: string) {
    updateTask(currentTask.id, { dueDate: value || null });
  }

  function handleProgressChange(value: number) {
    updateTask(currentTask.id, { progress: value });
  }

  function handleNotesChange(value: string) {
    updateTask(currentTask.id, { notes: value });
  }

  // --- Tags ---

  function handleAddTag() {
    const tag = newTagInput.trim();
    if (!tag) return;
    const currentTags = currentTask.tags ?? [];
    if (currentTags.includes(tag)) {
      setNewTagInput('');
      return;
    }
    updateTask(currentTask.id, { tags: [...currentTags, tag] });
    setNewTagInput('');
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }

  function handleRemoveTag(tag: string) {
    const currentTags = currentTask.tags ?? [];
    updateTask(currentTask.id, { tags: currentTags.filter((t) => t !== tag) });
  }

  // --- Dependencies ---

  function handleAddDependency(depId: string) {
    const currentDepsIds = currentTask.dependencies ?? [];
    if (currentDepsIds.includes(depId)) return;
    updateTask(currentTask.id, { dependencies: [...currentDepsIds, depId] });
    setDepSearch('');
    setDepDropdownOpen(false);
  }

  function handleRemoveDependency(depId: string) {
    const currentDepsIds = currentTask.dependencies ?? [];
    updateTask(currentTask.id, {
      dependencies: currentDepsIds.filter((id) => id !== depId),
    });
  }

  // --- Subtasks ---

  function handleAddSubtask() {
    const title = newSubtaskTitle.trim();
    if (!title) return;
    addSubtask(currentTask.id, title);
    setNewSubtaskTitle('');
  }

  function handleSubtaskKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubtask();
    }
  }

  // --- Delete ---

  function handleDelete() {
    deleteTask(currentTask.id);
    onClose();
  }

  // Subtasks list (safe fallback)
  const subtasksList = currentTask.subtasks ?? [];
  const tagsList = currentTask.tags ?? [];

  // ------- render -------

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';

  const labelClass =
    'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white text-gray-800 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900 truncate pr-4">
            Editar Tarefa
          </h2>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Fechar"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Título */}
          <div>
            <label className={labelClass}>Título</label>
            <input
              type="text"
              value={currentTask.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputClass}
              placeholder="Nome da tarefa"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className={labelClass}>Descrição</label>
            <textarea
              value={currentTask.description ?? ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={3}
              className={`${inputClass} resize-y`}
              placeholder="Descreva o objetivo e contexto desta tarefa..."
            />
          </div>

          {/* Status + Prioridade (lado a lado) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={currentTask.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={inputClass}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Prioridade</label>
              <select
                value={currentTask.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className={inputClass}
              >
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Departamento */}
          <div>
            <label className={labelClass}>Departamento</label>
            <select
              value={currentTask.departmentId}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className={inputClass}
            >
              {departmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Responsáveis */}
          <div>
            <label className={labelClass}>Responsáveis</label>
            <input
              type="text"
              value={assigneeNames}
              onChange={(e) => handleAssigneesChange(e.target.value)}
              className={inputClass}
              placeholder="Nomes separados por vírgula"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Separe nomes com vírgula. Ex: Raphael Ruiz, Bruno Almeida
            </p>
          </div>

          {/* Data de Entrega */}
          <div>
            <label className={labelClass}>Data de Entrega</label>
            <input
              type="date"
              value={currentTask.dueDate ?? ''}
              onChange={(e) => handleDueDateChange(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Progresso */}
          <div>
            <label className={labelClass}>Progresso</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={currentTask.progress}
                onChange={(e) => handleProgressChange(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none bg-gray-200 accent-blue-600 cursor-pointer"
              />
              <span className="shrink-0 w-12 text-center text-sm font-bold text-gray-700 bg-gray-100 rounded-lg py-1">
                {currentTask.progress}%
              </span>
            </div>
            {/* Visual progress bar */}
            <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${currentTask.progress}%`,
                  backgroundColor:
                    currentTask.progress >= 80
                      ? '#10B981'
                      : currentTask.progress >= 40
                        ? '#3B82F6'
                        : '#F59E0B',
                }}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags</label>
            {/* Existing tags as chips */}
            {tagsList.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tagsList.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"
                  >
                    <Tag size={12} />
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-0.5 p-0.5 rounded-full hover:bg-blue-200 transition-colors"
                      aria-label={`Remover tag ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Add tag input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className={`flex-1 ${inputClass}`}
                placeholder="Adicionar tag..."
              />
              <button
                onClick={handleAddTag}
                disabled={!newTagInput.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Dependências */}
          <div>
            <label className={labelClass}>Dependências</label>
            {/* Current dependencies */}
            {currentDeps.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {currentDeps.map((dep) => (
                  <div
                    key={dep.id}
                    className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2"
                  >
                    <span className="flex-1 text-sm text-gray-700 truncate">
                      {dep.title}
                    </span>
                    <button
                      onClick={() => handleRemoveDependency(dep.id)}
                      className="shrink-0 p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                      aria-label={`Remover dependência ${dep.title}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Searchable dropdown to add dependencies */}
            <div ref={depDropdownRef} className="relative">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={depSearch}
                  onChange={(e) => {
                    setDepSearch(e.target.value);
                    setDepDropdownOpen(true);
                  }}
                  onFocus={() => setDepDropdownOpen(true)}
                  className={`${inputClass} pl-9`}
                  placeholder="Buscar tarefa para adicionar como dependência..."
                />
              </div>
              {depDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                  {filteredDeps.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-400 italic">
                      Nenhuma tarefa encontrada.
                    </div>
                  ) : (
                    filteredDeps.map((t) => {
                      const alreadyAdded = (
                        currentTask.dependencies ?? []
                      ).includes(t.id);
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            if (!alreadyAdded) handleAddDependency(t.id);
                          }}
                          disabled={alreadyAdded}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                            alreadyAdded
                              ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer'
                          }`}
                        >
                          <span className="block truncate">{t.title}</span>
                          {alreadyAdded && (
                            <span className="text-[11px] text-gray-400">
                              Já adicionada
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Subtarefas */}
          <div>
            <label className={`${labelClass} mb-2`}>Subtarefas</label>

            {/* Lista de subtarefas existentes */}
            {subtasksList.length > 0 ? (
              <ul className="space-y-1.5 mb-3">
                {subtasksList.map((sub) => (
                  <li
                    key={sub.id}
                    className="flex items-center gap-2 group rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
                  >
                    <button
                      onClick={() => toggleSubtask(currentTask.id, sub.id)}
                      className="shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label={
                        sub.completed
                          ? 'Desmarcar subtarefa'
                          : 'Marcar subtarefa como concluída'
                      }
                    >
                      {sub.completed ? (
                        <CheckSquare size={18} className="text-green-600" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        sub.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-700'
                      }`}
                    >
                      {sub.title}
                    </span>
                    <button
                      onClick={() => removeSubtask(currentTask.id, sub.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                      aria-label="Remover subtarefa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic mb-3">
                Nenhuma subtarefa adicionada.
              </p>
            )}

            {/* Adicionar subtarefa */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={handleSubtaskKeyDown}
                className={`flex-1 ${inputClass}`}
                placeholder="Nova subtarefa..."
              />
              <button
                onClick={handleAddSubtask}
                disabled={!newSubtaskTitle.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} />
                Adicionar
              </button>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className={labelClass}>Notas</label>
            <textarea
              value={currentTask.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={4}
              className={`${inputClass} resize-y`}
              placeholder="Observações, contexto ou lembretes..."
            />
          </div>

          {/* Arquivos e Documentos */}
          <div>
            <label className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <Paperclip size={12} />
                Arquivos e Documentos
                {(currentTask.attachmentIds?.length ?? 0) > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                    {currentTask.attachmentIds?.length}
                  </span>
                )}
              </span>
            </label>
            <FileUpload
              entityType="task"
              entityId={currentTask.id}
              departmentId={currentTask.departmentId}
              light
            />
          </div>

          {/* Separador antes do botão de excluir */}
          <div className="border-t border-gray-200 pt-5">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-200 hover:bg-red-100 hover:border-red-300 transition-colors w-full justify-center"
              >
                <Trash2 size={16} />
                Excluir Tarefa
              </button>
            ) : (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700 font-medium mb-3">
                  Tem certeza? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={14} />
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-3 rounded-b-2xl">
          <p className="text-[11px] text-gray-400 text-center">
            As alterações são salvas automaticamente.
          </p>
        </div>
      </div>
    </div>
  );
}
