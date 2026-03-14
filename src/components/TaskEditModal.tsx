'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { people } from '@/data/projectData';
import type { TaskStatus, TaskPriority } from '@/data/types';

// ---------------------------------------------------------------------------
// Mapas de labels (Português com acentos)
// ---------------------------------------------------------------------------

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'nao_iniciada', label: 'Não Iniciada' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluida', label: 'Concluída' },
  { value: 'bloqueada', label: 'Bloqueada' },
  { value: 'atrasada', label: 'Atrasada' },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'critica', label: 'Crítica' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
];

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
  const { getTask, updateTask, addSubtask, removeSubtask, toggleSubtask } =
    useProject();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  // Resolve task
  const task = taskId ? getTask(taskId) : undefined;

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (taskId) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [taskId]);

  if (!taskId || !task) return null;

  // At this point task is guaranteed non-null (narrowed by the guard above).
  const currentTask = task;

  // Resolve assignee names to comma-separated string
  const assigneeNames = currentTask.assigneeIds
    .map((id) => peopleMap[id] ?? id)
    .join(', ');

  // ------- handlers -------

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  function handleTitleChange(value: string) {
    updateTask(currentTask.id, { title: value });
  }

  function handleStatusChange(value: string) {
    updateTask(currentTask.id, { status: value as TaskStatus });
  }

  function handlePriorityChange(value: string) {
    updateTask(currentTask.id, { priority: value as TaskPriority });
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

  // Subtasks list (safe fallback)
  const subtasksList = currentTask.subtasks ?? [];

  // ------- render -------

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
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Título
            </label>
            <input
              type="text"
              value={currentTask.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Nome da tarefa"
            />
          </div>

          {/* Status + Prioridade (lado a lado) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={currentTask.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Prioridade
              </label>
              <select
                value={currentTask.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Responsáveis */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Responsáveis
            </label>
            <input
              type="text"
              value={assigneeNames}
              onChange={(e) => handleAssigneesChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Nomes separados por vírgula"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Separe nomes com vírgula. Ex: Raphael Ruiz, Bruno Almeida
            </p>
          </div>

          {/* Data de Entrega */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Data de Entrega
            </label>
            <input
              type="date"
              value={currentTask.dueDate ?? ''}
              onChange={(e) => handleDueDateChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Progresso */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Progresso
            </label>
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

          {/* Subtarefas */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Subtarefas
            </label>

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
                        sub.completed ? 'Desmarcar subtarefa' : 'Marcar subtarefa como concluída'
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
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Notas
            </label>
            <textarea
              value={currentTask.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
              placeholder="Observações, contexto ou lembretes..."
            />
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
