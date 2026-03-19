'use client';

import { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Task, TaskStatus } from '@/data/types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  columnKey: TaskStatus;
  label: string;
  color: string;
  tasks: Task[];
  onEditTask: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  draggedTaskId: string | null;
}

export default function KanbanColumn({
  columnKey,
  label,
  color,
  tasks,
  onEditTask,
  onStatusChange,
  onAddTask,
  onDragStart,
  onDragEnd,
  draggedTaskId,
}: KanbanColumnProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('ring-1', 'ring-white/20', 'bg-white/[0.04]');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-1', 'ring-white/20', 'bg-white/[0.04]');
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.currentTarget.classList.remove('ring-1', 'ring-white/20', 'bg-white/[0.04]');
      if (draggedTaskId) {
        onStatusChange(draggedTaskId, columnKey);
      }
    },
    [draggedTaskId, columnKey, onStatusChange],
  );

  return (
    <div
      className="rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col min-w-[280px] snap-start shrink-0 lg:min-w-0 lg:shrink lg:snap-align-none transition-colors"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.06]">
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-xs font-semibold text-white/70 flex-1">{label}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40">
          {tasks.length}
        </span>
      </div>

      {/* Scrollable card list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[calc(100vh-280px)]">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onStatusChange={onStatusChange}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <p className="text-[10px] text-white/20 text-center py-6">Nenhuma tarefa</p>
        )}
      </div>

      {/* Add task button */}
      <button
        onClick={() => onAddTask(columnKey)}
        className="flex items-center justify-center gap-1.5 px-3 py-2 mx-2 mb-2 rounded-lg border border-dashed border-white/[0.1] text-white/30 text-[11px] font-medium hover:border-white/[0.2] hover:text-white/50 hover:bg-white/[0.03] transition-colors"
      >
        <Plus size={12} />
        Nova tarefa
      </button>
    </div>
  );
}
