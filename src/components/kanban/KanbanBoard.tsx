'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Task, TaskStatus, DepartmentId } from '@/data/types';
import KanbanColumn from './KanbanColumn';
import KanbanFilterBar, { type KanbanSortMode } from './KanbanFilterBar';

const KANBAN_COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'nao_iniciada', label: 'Nao Iniciada', color: '#6B7280' },
  { key: 'em_andamento', label: 'Em Andamento', color: '#00B4D8' },
  { key: 'bloqueada', label: 'Bloqueada', color: '#F59E0B' },
  { key: 'atrasada', label: 'Atrasada', color: '#EF4444' },
  { key: 'concluida', label: 'Concluida', color: '#10B981' },
];

const PRIORITY_ORDER: Record<string, number> = { critica: 0, alta: 1, media: 2, baixa: 3 };

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
}

export default function KanbanBoard({ tasks, onEditTask, onStatusChange, onAddTask }: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentId | 'todas'>('todas');
  const [sortMode, setSortMode] = useState<KanbanSortMode>('prioridade');
  const [activeColumn, setActiveColumn] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter tasks by department
  const filteredTasks = useMemo(() => {
    if (departmentFilter === 'todas') return tasks;
    return tasks.filter((t) => t.departmentId === departmentFilter);
  }, [tasks, departmentFilter]);

  // Sort function
  const sortTasks = useCallback(
    (taskList: Task[]) => {
      const sorted = [...taskList];
      if (sortMode === 'prioridade') {
        sorted.sort((a, b) => {
          const pDiff = (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9);
          if (pDiff !== 0) return pDiff;
          if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;
          return 0;
        });
      } else if (sortMode === 'prazo') {
        sorted.sort((a, b) => {
          if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;
          return 0;
        });
      } else if (sortMode === 'progresso') {
        sorted.sort((a, b) => b.progress - a.progress);
      }
      return sorted;
    },
    [sortMode],
  );

  // Build columns
  const columns = useMemo(() => {
    const map: Record<string, Task[]> = {};
    KANBAN_COLUMNS.forEach((col) => {
      map[col.key] = [];
    });
    filteredTasks.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
      else map['nao_iniciada'].push(t);
    });
    // Sort each column
    Object.keys(map).forEach((key) => {
      map[key] = sortTasks(map[key]);
    });
    return map;
  }, [filteredTasks, sortTasks]);

  // Track scroll position for mobile dot indicator
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const colWidth = el.scrollWidth / KANBAN_COLUMNS.length;
      setActiveColumn(Math.round(scrollLeft / colWidth));
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDragStart = useCallback((id: string) => setDraggedTaskId(id), []);
  const handleDragEnd = useCallback(() => setDraggedTaskId(null), []);

  return (
    <div>
      <KanbanFilterBar
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        sortMode={sortMode}
        onSortChange={setSortMode}
      />

      {/* Board: horizontal scroll + snap on mobile, grid on desktop */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 hide-scrollbar lg:grid lg:grid-cols-5 lg:overflow-x-visible lg:snap-none"
      >
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.key}
            columnKey={col.key}
            label={col.label}
            color={col.color}
            tasks={columns[col.key] ?? []}
            onEditTask={onEditTask}
            onStatusChange={onStatusChange}
            onAddTask={onAddTask}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggedTaskId={draggedTaskId}
          />
        ))}
      </div>

      {/* Mobile column indicator dots */}
      <div className="flex items-center justify-center gap-2 mt-3 lg:hidden">
        {KANBAN_COLUMNS.map((col, i) => (
          <motion.button
            key={col.key}
            onClick={() => {
              const el = scrollRef.current;
              if (el) {
                const colWidth = el.scrollWidth / KANBAN_COLUMNS.length;
                el.scrollTo({ left: colWidth * i, behavior: 'smooth' });
              }
            }}
            className="rounded-full transition-all"
            animate={{
              width: activeColumn === i ? 16 : 6,
              height: 6,
              backgroundColor: activeColumn === i ? col.color : 'rgba(255,255,255,0.15)',
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
