'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import {
  tasks as initialTasks,
  hiring as initialHiring,
  companies as initialCompanies,
  people as initialPeople,
} from '../data/projectData';
import type {
  Task, Subtask, TaskStatus, TaskPriority, DepartmentId,
  HiringPosition, HiringStatus, AssociateCompany, CompanyType,
  Person, PersonRole, ActivityLogEntry,
} from '../data/types';
import { showBrowserNotification } from '../lib/notifications';

// ---------------------------------------------------------------------------
// Notification type
// ---------------------------------------------------------------------------

export interface Notification {
  id: string;
  type: 'overdue' | 'critical' | 'deadline' | 'info';
  title: string;
  message: string;
  entityId?: string;
  entityType?: 'task' | 'hiring' | 'milestone';
  timestamp: string;
  read: boolean;
}

// ---------------------------------------------------------------------------
// Context interface
// ---------------------------------------------------------------------------

interface ProjectContextType {
  // Tasks
  tasks: Task[];
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addTask: (partial: { title: string; departmentId: DepartmentId; priority: TaskPriority; status: TaskStatus }) => string;
  deleteTask: (taskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  removeSubtask: (taskId: string, subtaskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  getTask: (taskId: string) => Task | undefined;

  // Hiring
  hiringPositions: HiringPosition[];
  updateHiring: (id: string, updates: Partial<HiringPosition>) => void;
  addHiring: (partial: Omit<HiringPosition, 'id' | 'openedAt' | 'filledAt' | 'filledBy'>) => string;
  deleteHiring: (id: string) => void;

  // Companies
  associateCompanies: AssociateCompany[];
  updateCompany: (id: string, updates: Partial<AssociateCompany>) => void;
  addCompany: (partial: Omit<AssociateCompany, 'id'>) => string;
  deleteCompany: (id: string) => void;

  // People
  teamPeople: Person[];
  updatePerson: (id: string, updates: Partial<Person>) => void;
  addPerson: (partial: Omit<Person, 'id'>) => string;
  deletePerson: (id: string) => void;

  // Activity log
  activityLog: ActivityLogEntry[];

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureSubtasks(taskList: Task[]): Task[] {
  return taskList.map((t) => ({
    ...t,
    subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
  }));
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch { /* fallback */ }
  }
  return fallback;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ProjectProvider({ children }: { children: ReactNode }) {
  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() =>
    ensureSubtasks(loadFromStorage('i10-tasks', initialTasks))
  );

  // Hiring
  const [hiringPositions, setHiringPositions] = useState<HiringPosition[]>(() =>
    loadFromStorage('i10-hiring', initialHiring)
  );

  // Companies
  const [associateCompanies, setAssociateCompanies] = useState<AssociateCompany[]>(() =>
    loadFromStorage('i10-companies', initialCompanies)
  );

  // People
  const [teamPeople, setTeamPeople] = useState<Person[]>(() =>
    loadFromStorage('i10-people', initialPeople)
  );

  // Activity log
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(() =>
    loadFromStorage('i10-activity-log', [])
  );

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadFromStorage('i10-notifications', [])
  );

  // Persist all state
  useEffect(() => { localStorage.setItem('i10-tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('i10-hiring', JSON.stringify(hiringPositions)); }, [hiringPositions]);
  useEffect(() => { localStorage.setItem('i10-companies', JSON.stringify(associateCompanies)); }, [associateCompanies]);
  useEffect(() => { localStorage.setItem('i10-people', JSON.stringify(teamPeople)); }, [teamPeople]);
  useEffect(() => { localStorage.setItem('i10-activity-log', JSON.stringify(activityLog)); }, [activityLog]);
  useEffect(() => { localStorage.setItem('i10-notifications', JSON.stringify(notifications)); }, [notifications]);

  // ---- Activity log helper ----
  const logActivity = useCallback((entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: ActivityLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    setActivityLog((prev) => [newEntry, ...prev].slice(0, 500)); // Keep last 500
  }, []);

  // ---- Generate notifications from current state ----
  useEffect(() => {
    const now = new Date();
    const newNotifs: Notification[] = [];

    // Overdue tasks
    tasks.forEach((t) => {
      if (t.dueDate && t.status !== 'concluida' && t.status !== 'cancelada') {
        const due = new Date(t.dueDate + 'T23:59:59');
        const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) {
          newNotifs.push({
            id: `notif-overdue-${t.id}`,
            type: 'overdue',
            title: 'Tarefa Atrasada',
            message: `"${t.title}" está ${Math.abs(daysLeft)} dia(s) atrasada`,
            entityId: t.id,
            entityType: 'task',
            timestamp: now.toISOString(),
            read: false,
          });
        } else if (daysLeft <= 3) {
          newNotifs.push({
            id: `notif-deadline-${t.id}`,
            type: 'deadline',
            title: 'Prazo Próximo',
            message: `"${t.title}" vence em ${daysLeft} dia(s)`,
            entityId: t.id,
            entityType: 'task',
            timestamp: now.toISOString(),
            read: false,
          });
        }
      }
      if (t.priority === 'critica' && t.status !== 'concluida' && t.status !== 'cancelada') {
        newNotifs.push({
          id: `notif-critical-${t.id}`,
          type: 'critical',
          title: 'Tarefa Crítica',
          message: `"${t.title}" é prioridade crítica`,
          entityId: t.id,
          entityType: 'task',
          timestamp: now.toISOString(),
          read: false,
        });
      }
    });

    // Merge: keep read state from existing notifications, fire browser notifications for new ones
    setNotifications((prev) => {
      const readMap = new Map(prev.map((n) => [n.id, n.read]));
      const existingIds = new Set(prev.map((n) => n.id));

      // Fire browser notifications only for genuinely new overdue/critical items
      newNotifs.forEach((n) => {
        if (!existingIds.has(n.id) && (n.type === 'overdue' || n.type === 'critical')) {
          showBrowserNotification({
            title: n.title,
            body: n.message,
            url: '/dashboard',
          });
        }
      });

      return newNotifs.map((n) => ({
        ...n,
        read: readMap.get(n.id) ?? false,
      }));
    });
  }, [tasks]);

  // ---- Task CRUD ----
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => {
      const oldTask = prev.find((t) => t.id === taskId);
      const newTasks = prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
      if (oldTask) {
        const changedFields = Object.keys(updates) as (keyof Task)[];
        changedFields.forEach((field) => {
          if (field === 'subtasks') return;
          const oldVal = String(oldTask[field] ?? '');
          const newVal = String(updates[field] ?? '');
          if (oldVal !== newVal) {
            logActivity({
              entityType: 'task',
              entityId: taskId,
              entityTitle: updates.title ?? oldTask.title,
              action: field === 'status' ? 'status_changed' : 'updated',
              field,
              oldValue: oldVal,
              newValue: newVal,
            });
          }
        });

        // Browser notification: task completed
        if (updates.status === 'concluida' && oldTask.status !== 'concluida') {
          showBrowserNotification({
            title: 'Tarefa Concluída',
            body: `"${oldTask.title}" foi marcada como concluída.`,
            url: '/dashboard',
          });
        }

        // Browser notification: task became critical
        if (updates.priority === 'critica' && oldTask.priority !== 'critica') {
          showBrowserNotification({
            title: 'Prioridade Crítica',
            body: `"${oldTask.title}" foi marcada como prioridade crítica.`,
            url: '/dashboard',
          });
        }
      }
      return newTasks;
    });
  }, [logActivity]);

  const addTask = useCallback(
    (partial: { title: string; departmentId: DepartmentId; priority: TaskPriority; status: TaskStatus }): string => {
      const id = `task-${Date.now()}`;
      const newTask: Task = {
        id,
        title: partial.title,
        description: '',
        status: partial.status,
        priority: partial.priority,
        departmentId: partial.departmentId,
        assigneeIds: [],
        dueDate: null,
        createdAt: new Date().toISOString().slice(0, 10),
        completedAt: null,
        phaseId: null,
        dependencies: [],
        notes: '',
        progress: 0,
        tags: [],
        subtasks: [],
      };
      setTasks((prev) => [...prev, newTask]);
      logActivity({
        entityType: 'task',
        entityId: id,
        entityTitle: partial.title,
        action: 'created',
      });

      // Browser notification: task created
      showBrowserNotification({
        title: 'Nova Tarefa Criada',
        body: `"${partial.title}" foi adicionada ao projeto.`,
        url: '/dashboard',
      });

      return id;
    },
    [logActivity]
  );

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (task) {
        logActivity({
          entityType: 'task',
          entityId: taskId,
          entityTitle: task.title,
          action: 'deleted',
        });
      }
      return prev.filter((t) => t.id !== taskId);
    });
  }, [logActivity]);

  const addSubtask = useCallback((taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newSubtask: Subtask = { id: `sub-${Date.now()}`, title, completed: false };
        return { ...t, subtasks: [...(t.subtasks || []), newSubtask] };
      })
    );
  }, []);

  const removeSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, subtasks: (t.subtasks || []).filter((s) => s.id !== subtaskId) };
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
    (taskId: string) => tasks.find((t) => t.id === taskId),
    [tasks]
  );

  // ---- Hiring CRUD ----
  const updateHiring = useCallback((id: string, updates: Partial<HiringPosition>) => {
    setHiringPositions((prev) => {
      const old = prev.find((h) => h.id === id);
      if (old) {
        logActivity({
          entityType: 'hiring',
          entityId: id,
          entityTitle: old.title,
          action: updates.status ? 'status_changed' : 'updated',
          field: updates.status ? 'status' : undefined,
          oldValue: updates.status ? old.status : undefined,
          newValue: updates.status ? updates.status : undefined,
        });
      }
      return prev.map((h) => (h.id === id ? { ...h, ...updates } : h));
    });
  }, [logActivity]);

  const addHiring = useCallback((partial: Omit<HiringPosition, 'id' | 'openedAt' | 'filledAt' | 'filledBy'>): string => {
    const id = `hiring-${Date.now()}`;
    const newPos: HiringPosition = {
      ...partial,
      id,
      openedAt: new Date().toISOString().slice(0, 10),
      filledAt: null,
      filledBy: null,
    };
    setHiringPositions((prev) => [...prev, newPos]);
    logActivity({ entityType: 'hiring', entityId: id, entityTitle: partial.title, action: 'created' });
    return id;
  }, [logActivity]);

  const deleteHiring = useCallback((id: string) => {
    setHiringPositions((prev) => {
      const h = prev.find((p) => p.id === id);
      if (h) logActivity({ entityType: 'hiring', entityId: id, entityTitle: h.title, action: 'deleted' });
      return prev.filter((p) => p.id !== id);
    });
  }, [logActivity]);

  // ---- Company CRUD ----
  const updateCompany = useCallback((id: string, updates: Partial<AssociateCompany>) => {
    setAssociateCompanies((prev) => {
      const old = prev.find((c) => c.id === id);
      if (old) logActivity({ entityType: 'company', entityId: id, entityTitle: old.name, action: 'updated' });
      return prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
    });
  }, [logActivity]);

  const addCompany = useCallback((partial: Omit<AssociateCompany, 'id'>): string => {
    const id = `company-${Date.now()}`;
    setAssociateCompanies((prev) => [...prev, { ...partial, id }]);
    logActivity({ entityType: 'company', entityId: id, entityTitle: partial.name, action: 'created' });
    return id;
  }, [logActivity]);

  const deleteCompany = useCallback((id: string) => {
    setAssociateCompanies((prev) => {
      const c = prev.find((co) => co.id === id);
      if (c) logActivity({ entityType: 'company', entityId: id, entityTitle: c.name, action: 'deleted' });
      return prev.filter((co) => co.id !== id);
    });
  }, [logActivity]);

  // ---- People CRUD ----
  const updatePerson = useCallback((id: string, updates: Partial<Person>) => {
    setTeamPeople((prev) => {
      const old = prev.find((p) => p.id === id);
      if (old) logActivity({ entityType: 'person', entityId: id, entityTitle: old.name, action: 'updated' });
      return prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
    });
  }, [logActivity]);

  const addPerson = useCallback((partial: Omit<Person, 'id'>): string => {
    const id = `person-${Date.now()}`;
    setTeamPeople((prev) => [...prev, { ...partial, id }]);
    logActivity({ entityType: 'person', entityId: id, entityTitle: partial.name, action: 'created' });
    return id;
  }, [logActivity]);

  const deletePerson = useCallback((id: string) => {
    setTeamPeople((prev) => {
      const p = prev.find((pe) => pe.id === id);
      if (p) logActivity({ entityType: 'person', entityId: id, entityTitle: p.name, action: 'deleted' });
      return prev.filter((pe) => pe.id !== id);
    });
  }, [logActivity]);

  // ---- Notifications ----
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return (
    <ProjectContext.Provider
      value={{
        tasks, updateTask, addTask, deleteTask, addSubtask, removeSubtask, toggleSubtask, getTask,
        hiringPositions, updateHiring, addHiring, deleteHiring,
        associateCompanies, updateCompany, addCompany, deleteCompany,
        teamPeople, updatePerson, addPerson, deletePerson,
        activityLog,
        notifications, markNotificationRead, markAllNotificationsRead, unreadCount,
      }}
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
