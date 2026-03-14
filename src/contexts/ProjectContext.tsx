'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { tasks as initialTasks } from '../data/projectData';
import type { Task, Subtask, TaskStatus, TaskPriority } from '../data/types';

interface ProjectContextType {
  tasks: Task[];
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addSubtask: (taskId: string, title: string) => void;
  removeSubtask: (taskId: string, subtaskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  getTask: (taskId: string) => Task | undefined;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

/**
 * Garante que cada tarefa tenha o campo subtasks (compatibilidade com dados antigos).
 */
function ensureSubtasks(taskList: Task[]): Task[] {
  return taskList.map((t) => ({
    ...t,
    subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
  }));
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ibef-tasks');
      if (saved) {
        try {
          return ensureSubtasks(JSON.parse(saved));
        } catch {
          /* fallback to initial data */
        }
      }
    }
    return ensureSubtasks(initialTasks);
  });

  useEffect(() => {
    localStorage.setItem('ibef-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
  }, []);

  const addSubtask = useCallback((taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newSubtask: Subtask = {
          id: `sub-${Date.now()}`,
          title,
          completed: false,
        };
        return { ...t, subtasks: [...(t.subtasks || []), newSubtask] };
      })
    );
  }, []);

  const removeSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: (t.subtasks || []).filter((s) => s.id !== subtaskId),
        };
      })
    );
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: (t.subtasks || []).map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          ),
        };
      })
    );
  }, []);

  const getTask = useCallback(
    (taskId: string) => {
      return tasks.find((t) => t.id === taskId);
    },
    [tasks]
  );

  return (
    <ProjectContext.Provider
      value={{ tasks, updateTask, addSubtask, removeSubtask, toggleSubtask, getTask }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
