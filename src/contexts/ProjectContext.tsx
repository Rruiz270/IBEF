'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo, useRef } from 'react';
import {
  tasks as initialTasks,
  hiring as initialHiring,
  companies as initialCompanies,
  people as initialPeople,
} from '../data/projectData';
import type {
  Task, Subtask, TaskStatus, TaskPriority, DepartmentId,
  HiringPosition, HiringStatus, AssociateCompany, CompanyType,
  Person, PersonRole, ActivityLogEntry, FileAttachment,
} from '../data/types';
import { saveFileBlob, deleteFileBlob } from '../lib/fileStorage';
import { showBrowserNotification } from '../lib/notifications';
import { newId } from '../lib/ids';
import { SyncManager, type SyncStatus, type SyncPullResponse, type SyncMutation } from '../lib/syncManager';

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
// Table name mapping
// ---------------------------------------------------------------------------

type SyncTable = 'tasks' | 'people' | 'hiring_positions' | 'associate_companies' | 'activity_log';

// ---------------------------------------------------------------------------
// Fired-notifications persistence (for dedup)
// ---------------------------------------------------------------------------

const FIRED_NOTIFS_KEY = 'i10-fired-notifs';
const FIRED_NOTIFS_CAP = 1000;

function loadFiredNotifs(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(FIRED_NOTIFS_KEY);
    if (raw) {
      const arr: unknown = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr as string[]);
    }
  } catch { /* ignore */ }
  return new Set();
}

function persistFiredNotifs(set: Set<string>) {
  if (typeof window === 'undefined') return;
  // Cap at FIRED_NOTIFS_CAP entries — keep the most recent ones
  const arr = [...set];
  const trimmed = arr.length > FIRED_NOTIFS_CAP ? arr.slice(arr.length - FIRED_NOTIFS_CAP) : arr;
  localStorage.setItem(FIRED_NOTIFS_KEY, JSON.stringify(trimmed));
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

  // File attachments
  fileAttachments: FileAttachment[];
  addFileAttachment: (meta: Omit<FileAttachment, 'id' | 'uploadedAt'>, blob: Blob) => Promise<string>;
  removeFileAttachment: (id: string) => void;
  getAttachmentsForEntity: (entityType: 'task' | 'hiring', entityId: string) => FileAttachment[];
  getAttachmentsForDepartment: (departmentId: DepartmentId) => FileAttachment[];

  // Sync
  syncStatus: SyncStatus;
  triggerFullSync: () => void;

  // Bootstrap
  bootstrapped: boolean;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureMigration(taskList: Task[]): Task[] {
  return taskList.map((t) => ({
    ...t,
    subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
    attachmentIds: Array.isArray(t.attachmentIds) ? t.attachmentIds : [],
  }));
}

function ensureHiringMigration(list: HiringPosition[]): HiringPosition[] {
  return list.map((h) => ({
    ...h,
    attachmentIds: Array.isArray(h.attachmentIds) ? h.attachmentIds : [],
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
    ensureMigration(loadFromStorage('i10-tasks', initialTasks))
  );

  // Hiring
  const [hiringPositions, setHiringPositions] = useState<HiringPosition[]>(() =>
    ensureHiringMigration(loadFromStorage('i10-hiring', initialHiring))
  );

  // File attachments (metadata only; blobs in IndexedDB)
  const [fileAttachments, setFileAttachments] = useState<FileAttachment[]>(() =>
    loadFromStorage('i10-file-attachments', [])
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

  // Sync status
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

  // SyncManager — scoped to the React tree via useRef (no module singleton)
  const syncManagerRef = useRef<SyncManager | null>(null);
  if (!syncManagerRef.current) {
    syncManagerRef.current = new SyncManager();
  }

  // Guard to avoid applying incoming pull data during a local mutation
  const isPullingRef = useRef(false);

  // Fired notifications dedup set
  const firedNotifsRef = useRef<Set<string>>(loadFiredNotifs());

  // Bootstrap guard — first-load full-pull
  const [bootstrapped, setBootstrapped] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('i10-last-sync');
  });

  // Persist all state
  useEffect(() => { localStorage.setItem('i10-tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('i10-hiring', JSON.stringify(hiringPositions)); }, [hiringPositions]);
  useEffect(() => { localStorage.setItem('i10-companies', JSON.stringify(associateCompanies)); }, [associateCompanies]);
  useEffect(() => { localStorage.setItem('i10-people', JSON.stringify(teamPeople)); }, [teamPeople]);
  useEffect(() => { localStorage.setItem('i10-activity-log', JSON.stringify(activityLog)); }, [activityLog]);
  useEffect(() => { localStorage.setItem('i10-notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('i10-file-attachments', JSON.stringify(fileAttachments)); }, [fileAttachments]);

  // ---- Sync: apply incoming pull data ----
  const applyPull = useCallback((data: SyncPullResponse) => {
    isPullingRef.current = true;

    // Tasks
    if (data.tasks.length > 0) {
      setTasks((prev) => {
        let updated = [...prev];
        for (const row of data.tasks) {
          if (row.deleted) {
            updated = updated.filter((t) => t.id !== row.id);
          } else {
            const taskData = row.data as unknown as Task;
            const idx = updated.findIndex((t) => t.id === row.id);
            if (idx >= 0) {
              updated[idx] = { ...taskData, subtasks: Array.isArray(taskData.subtasks) ? taskData.subtasks : [] };
            } else {
              updated.push({ ...taskData, subtasks: Array.isArray(taskData.subtasks) ? taskData.subtasks : [] });
            }
          }
        }
        return updated;
      });
    }

    // People
    if (data.people.length > 0) {
      setTeamPeople((prev) => {
        let updated = [...prev];
        for (const row of data.people) {
          if (row.deleted) {
            updated = updated.filter((p) => p.id !== row.id);
          } else {
            const personData = row.data as unknown as Person;
            const idx = updated.findIndex((p) => p.id === row.id);
            if (idx >= 0) {
              updated[idx] = personData;
            } else {
              updated.push(personData);
            }
          }
        }
        return updated;
      });
    }

    // Hiring
    if (data.hiringPositions.length > 0) {
      setHiringPositions((prev) => {
        let updated = [...prev];
        for (const row of data.hiringPositions) {
          if (row.deleted) {
            updated = updated.filter((h) => h.id !== row.id);
          } else {
            const hiringData = row.data as unknown as HiringPosition;
            const idx = updated.findIndex((h) => h.id === row.id);
            if (idx >= 0) {
              updated[idx] = hiringData;
            } else {
              updated.push(hiringData);
            }
          }
        }
        return updated;
      });
    }

    // Companies
    if (data.associateCompanies.length > 0) {
      setAssociateCompanies((prev) => {
        let updated = [...prev];
        for (const row of data.associateCompanies) {
          if (row.deleted) {
            updated = updated.filter((c) => c.id !== row.id);
          } else {
            const companyData = row.data as unknown as AssociateCompany;
            const idx = updated.findIndex((c) => c.id === row.id);
            if (idx >= 0) {
              updated[idx] = companyData;
            } else {
              updated.push(companyData);
            }
          }
        }
        return updated;
      });
    }

    // Activity log
    if (data.activityLog.length > 0) {
      setActivityLog((prev) => {
        const existingIds = new Set(prev.map((e) => e.id));
        const newEntries = data.activityLog
          .filter((row) => !existingIds.has(row.id))
          .map((row) => row.data as unknown as ActivityLogEntry);
        return [...newEntries, ...prev].slice(0, 500);
      });
    }

    isPullingRef.current = false;
  }, []);

  // ---- Sync: start manager + bootstrap guard ----
  useEffect(() => {
    const mgr = syncManagerRef.current!;
    const needsFullPull = !localStorage.getItem('i10-last-sync');

    mgr.setCallbacks(setSyncStatus, (data) => {
      applyPull(data);
      // After the first pull completes, mark as bootstrapped
      if (!bootstrapped) {
        setBootstrapped(true);
      }
    });

    if (needsFullPull) {
      // First-time user: do a full pull before considering bootstrapped
      mgr.fullPull().then(() => {
        setBootstrapped(true);
      }).catch(() => {
        // Even on error, let the app render with seed data
        setBootstrapped(true);
      });
    }

    mgr.start();
    return () => mgr.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyPull]);

  const triggerFullSync = useCallback(() => {
    syncManagerRef.current!.fullPull();
  }, []);

  // ---- Sync helper: enqueue mutation ----
  const enqueueSync = useCallback((table: SyncTable, operation: 'upsert' | 'delete', id: string, data?: Record<string, unknown>) => {
    const mutation: SyncMutation = {
      table,
      operation,
      id,
      data,
      timestamp: new Date().toISOString(),
    };
    syncManagerRef.current!.enqueue(mutation);
  }, []);

  // ---- Activity log helper ----
  const logActivity = useCallback((entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: ActivityLogEntry = {
      ...entry,
      id: newId('log'),
      timestamp: new Date().toISOString(),
    };
    setActivityLog((prev) => [newEntry, ...prev].slice(0, 500)); // Keep last 500
    // Sync the activity log entry
    enqueueSync('activity_log', 'upsert', newEntry.id, newEntry as unknown as Record<string, unknown>);
  }, [enqueueSync]);

  // ---- Helper: fire a browser notification with dedup ----
  const fireBrowserNotification = useCallback((notifId: string, payload: { title: string; body: string; url: string }) => {
    if (firedNotifsRef.current.has(notifId)) return;
    firedNotifsRef.current.add(notifId);
    // Cap the set
    if (firedNotifsRef.current.size > FIRED_NOTIFS_CAP) {
      const arr = [...firedNotifsRef.current];
      firedNotifsRef.current = new Set(arr.slice(arr.length - FIRED_NOTIFS_CAP));
    }
    persistFiredNotifs(firedNotifsRef.current);
    showBrowserNotification(payload);
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

      // Fire browser notifications only for genuinely new overdue/critical items
      // (skip during pull to avoid notification spam on sync)
      // Also skip if already fired (dedup via firedNotifsRef)
      if (!isPullingRef.current) {
        newNotifs.forEach((n) => {
          if ((n.type === 'overdue' || n.type === 'critical')) {
            fireBrowserNotification(n.id, {
              title: n.title,
              body: n.message,
              url: '/dashboard',
            });
          }
        });
      }

      return newNotifs.map((n) => ({
        ...n,
        read: readMap.get(n.id) ?? false,
      }));
    });
  }, [tasks, fireBrowserNotification]);

  // ---- Task CRUD ----
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => {
      const oldTask = prev.find((t) => t.id === taskId);
      const newTasks = prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
      if (oldTask) {
        const merged = { ...oldTask, ...updates };
        enqueueSync('tasks', 'upsert', taskId, merged as unknown as Record<string, unknown>);

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
          fireBrowserNotification(`notif-completed-${taskId}`, {
            title: 'Tarefa Concluída',
            body: `"${oldTask.title}" foi marcada como concluída.`,
            url: '/dashboard',
          });
        }

        // Browser notification: task became critical
        if (updates.priority === 'critica' && oldTask.priority !== 'critica') {
          fireBrowserNotification(`notif-became-critical-${taskId}`, {
            title: 'Prioridade Crítica',
            body: `"${oldTask.title}" foi marcada como prioridade crítica.`,
            url: '/dashboard',
          });
        }
      }
      return newTasks;
    });
  }, [logActivity, enqueueSync, fireBrowserNotification]);

  const addTask = useCallback(
    (partial: { title: string; departmentId: DepartmentId; priority: TaskPriority; status: TaskStatus }): string => {
      const id = newId('task');
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
        attachmentIds: [],
      };
      setTasks((prev) => [...prev, newTask]);
      enqueueSync('tasks', 'upsert', id, newTask as unknown as Record<string, unknown>);
      logActivity({
        entityType: 'task',
        entityId: id,
        entityTitle: partial.title,
        action: 'created',
      });

      // Browser notification: task created
      fireBrowserNotification(`notif-created-${id}`, {
        title: 'Nova Tarefa Criada',
        body: `"${partial.title}" foi adicionada ao projeto.`,
        url: '/dashboard',
      });

      return id;
    },
    [logActivity, enqueueSync, fireBrowserNotification]
  );

  const deleteTask = useCallback((taskId: string) => {
    // Clean up associated file attachments
    setFileAttachments((prev) => {
      const toRemove = prev.filter((f) => f.entityType === 'task' && f.entityId === taskId);
      toRemove.forEach((f) => deleteFileBlob(f.id).catch(() => {}));
      return prev.filter((f) => !(f.entityType === 'task' && f.entityId === taskId));
    });
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
      enqueueSync('tasks', 'delete', taskId);
      return prev.filter((t) => t.id !== taskId);
    });
  }, [logActivity, enqueueSync]);

  const addSubtask = useCallback((taskId: string, title: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== taskId) return t;
        const newSubtask: Subtask = { id: newId('sub'), title, completed: false };
        return { ...t, subtasks: [...(t.subtasks || []), newSubtask] };
      });
      const task = updated.find((t) => t.id === taskId);
      if (task) enqueueSync('tasks', 'upsert', taskId, task as unknown as Record<string, unknown>);
      return updated;
    });
  }, [enqueueSync]);

  const removeSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, subtasks: (t.subtasks || []).filter((s) => s.id !== subtaskId) };
      });
      const task = updated.find((t) => t.id === taskId);
      if (task) enqueueSync('tasks', 'upsert', taskId, task as unknown as Record<string, unknown>);
      return updated;
    });
  }, [enqueueSync]);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: (t.subtasks || []).map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          ),
        };
      });
      const task = updated.find((t) => t.id === taskId);
      if (task) enqueueSync('tasks', 'upsert', taskId, task as unknown as Record<string, unknown>);
      return updated;
    });
  }, [enqueueSync]);

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
      const newList = prev.map((h) => (h.id === id ? { ...h, ...updates } : h));
      const merged = newList.find((h) => h.id === id);
      if (merged) enqueueSync('hiring_positions', 'upsert', id, merged as unknown as Record<string, unknown>);
      return newList;
    });
  }, [logActivity, enqueueSync]);

  const addHiring = useCallback((partial: Omit<HiringPosition, 'id' | 'openedAt' | 'filledAt' | 'filledBy'>): string => {
    const id = newId('hiring');
    const newPos: HiringPosition = {
      ...partial,
      id,
      openedAt: new Date().toISOString().slice(0, 10),
      filledAt: null,
      filledBy: null,
    };
    setHiringPositions((prev) => [...prev, newPos]);
    enqueueSync('hiring_positions', 'upsert', id, newPos as unknown as Record<string, unknown>);
    logActivity({ entityType: 'hiring', entityId: id, entityTitle: partial.title, action: 'created' });
    return id;
  }, [logActivity, enqueueSync]);

  const deleteHiring = useCallback((id: string) => {
    // Clean up associated file attachments
    setFileAttachments((prev) => {
      const toRemove = prev.filter((f) => f.entityType === 'hiring' && f.entityId === id);
      toRemove.forEach((f) => deleteFileBlob(f.id).catch(() => {}));
      return prev.filter((f) => !(f.entityType === 'hiring' && f.entityId === id));
    });
    setHiringPositions((prev) => {
      const h = prev.find((p) => p.id === id);
      if (h) logActivity({ entityType: 'hiring', entityId: id, entityTitle: h.title, action: 'deleted' });
      enqueueSync('hiring_positions', 'delete', id);
      return prev.filter((p) => p.id !== id);
    });
  }, [logActivity, enqueueSync]);

  // ---- Company CRUD ----
  const updateCompany = useCallback((id: string, updates: Partial<AssociateCompany>) => {
    setAssociateCompanies((prev) => {
      const old = prev.find((c) => c.id === id);
      if (old) logActivity({ entityType: 'company', entityId: id, entityTitle: old.name, action: 'updated' });
      const newList = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      const merged = newList.find((c) => c.id === id);
      if (merged) enqueueSync('associate_companies', 'upsert', id, merged as unknown as Record<string, unknown>);
      return newList;
    });
  }, [logActivity, enqueueSync]);

  const addCompany = useCallback((partial: Omit<AssociateCompany, 'id'>): string => {
    const id = newId('company');
    const newCompany = { ...partial, id };
    setAssociateCompanies((prev) => [...prev, newCompany]);
    enqueueSync('associate_companies', 'upsert', id, newCompany as unknown as Record<string, unknown>);
    logActivity({ entityType: 'company', entityId: id, entityTitle: partial.name, action: 'created' });
    return id;
  }, [logActivity, enqueueSync]);

  const deleteCompany = useCallback((id: string) => {
    setAssociateCompanies((prev) => {
      const c = prev.find((co) => co.id === id);
      if (c) logActivity({ entityType: 'company', entityId: id, entityTitle: c.name, action: 'deleted' });
      enqueueSync('associate_companies', 'delete', id);
      return prev.filter((co) => co.id !== id);
    });
  }, [logActivity, enqueueSync]);

  // ---- People CRUD ----
  const updatePerson = useCallback((id: string, updates: Partial<Person>) => {
    setTeamPeople((prev) => {
      const old = prev.find((p) => p.id === id);
      if (old) logActivity({ entityType: 'person', entityId: id, entityTitle: old.name, action: 'updated' });
      const newList = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      const merged = newList.find((p) => p.id === id);
      if (merged) enqueueSync('people', 'upsert', id, merged as unknown as Record<string, unknown>);
      return newList;
    });
  }, [logActivity, enqueueSync]);

  const addPerson = useCallback((partial: Omit<Person, 'id'>): string => {
    const id = newId('person');
    const newPerson = { ...partial, id };
    setTeamPeople((prev) => [...prev, newPerson]);
    enqueueSync('people', 'upsert', id, newPerson as unknown as Record<string, unknown>);
    logActivity({ entityType: 'person', entityId: id, entityTitle: partial.name, action: 'created' });
    return id;
  }, [logActivity, enqueueSync]);

  const deletePerson = useCallback((id: string) => {
    setTeamPeople((prev) => {
      const p = prev.find((pe) => pe.id === id);
      if (p) logActivity({ entityType: 'person', entityId: id, entityTitle: p.name, action: 'deleted' });
      enqueueSync('people', 'delete', id);
      return prev.filter((pe) => pe.id !== id);
    });
  }, [logActivity, enqueueSync]);

  // ---- File attachments ----
  const addFileAttachment = useCallback(async (meta: Omit<FileAttachment, 'id' | 'uploadedAt'>, blob: Blob): Promise<string> => {
    const id = newId('file');
    const attachment: FileAttachment = { ...meta, id, uploadedAt: new Date().toISOString() };
    await saveFileBlob(id, blob);
    setFileAttachments((prev) => [...prev, attachment]);
    // Update parent entity's attachmentIds
    if (meta.entityType === 'task') {
      setTasks((prev) => prev.map((t) =>
        t.id === meta.entityId ? { ...t, attachmentIds: [...(t.attachmentIds || []), id] } : t
      ));
    } else {
      setHiringPositions((prev) => prev.map((h) =>
        h.id === meta.entityId ? { ...h, attachmentIds: [...(h.attachmentIds || []), id] } : h
      ));
    }
    // Resolve entity title for notification
    const entityTitle = meta.entityType === 'task'
      ? tasks.find((t) => t.id === meta.entityId)?.title ?? 'Tarefa'
      : hiringPositions.find((h) => h.id === meta.entityId)?.title ?? 'Vaga';
    logActivity({
      entityType: meta.entityType === 'task' ? 'task' : 'hiring',
      entityId: meta.entityId,
      entityTitle,
      action: 'updated',
      field: 'arquivo',
      newValue: meta.name,
    });
    setNotifications((prev) => [{
      id: `notif-file-add-${id}`,
      type: 'info' as const,
      title: 'Documento Anexado',
      message: `"${meta.name}" anexado a ${entityTitle}`,
      entityId: meta.entityId,
      entityType: meta.entityType === 'task' ? 'task' : 'hiring',
      timestamp: new Date().toISOString(),
      read: false,
    }, ...prev]);
    fireBrowserNotification(`notif-file-add-${id}`, {
      title: 'Documento Anexado',
      body: `"${meta.name}" foi anexado a "${entityTitle}".`,
      url: '/documentos',
    });
    return id;
  }, [tasks, hiringPositions, logActivity, fireBrowserNotification]);

  const removeFileAttachment = useCallback((id: string) => {
    // Find attachment info before removing
    const attachment = fileAttachments.find((f) => f.id === id);
    if (attachment) {
      deleteFileBlob(id).catch(() => {});
      // Remove from parent entity's attachmentIds
      if (attachment.entityType === 'task') {
        setTasks((p) => p.map((t) =>
          t.id === attachment.entityId ? { ...t, attachmentIds: (t.attachmentIds || []).filter((a) => a !== id) } : t
        ));
      } else {
        setHiringPositions((p) => p.map((h) =>
          h.id === attachment.entityId ? { ...h, attachmentIds: (h.attachmentIds || []).filter((a) => a !== id) } : h
        ));
      }
      // Notification
      const entityTitle = attachment.entityType === 'task'
        ? tasks.find((t) => t.id === attachment.entityId)?.title ?? 'Tarefa'
        : hiringPositions.find((h) => h.id === attachment.entityId)?.title ?? 'Vaga';
      logActivity({
        entityType: attachment.entityType === 'task' ? 'task' : 'hiring',
        entityId: attachment.entityId,
        entityTitle,
        action: 'updated',
        field: 'arquivo removido',
        newValue: attachment.name,
      });
      setNotifications((prev) => [{
        id: `notif-file-rm-${id}`,
        type: 'info' as const,
        title: 'Documento Removido',
        message: `"${attachment.name}" removido de ${entityTitle}`,
        entityId: attachment.entityId,
        entityType: attachment.entityType === 'task' ? 'task' : 'hiring',
        timestamp: new Date().toISOString(),
        read: false,
      }, ...prev]);
      fireBrowserNotification(`notif-file-rm-${id}`, {
        title: 'Documento Removido',
        body: `"${attachment.name}" foi removido de "${entityTitle}".`,
        url: '/documentos',
      });
    }
    setFileAttachments((prev) => prev.filter((f) => f.id !== id));
  }, [fileAttachments, tasks, hiringPositions, logActivity, fireBrowserNotification]);

  const getAttachmentsForEntity = useCallback((entityType: 'task' | 'hiring', entityId: string) => {
    return fileAttachments.filter((f) => f.entityType === entityType && f.entityId === entityId);
  }, [fileAttachments]);

  const getAttachmentsForDepartment = useCallback((departmentId: DepartmentId) => {
    return fileAttachments.filter((f) => f.departmentId === departmentId);
  }, [fileAttachments]);

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
        fileAttachments, addFileAttachment, removeFileAttachment, getAttachmentsForEntity, getAttachmentsForDepartment,
        notifications, markNotificationRead, markAllNotificationsRead, unreadCount,
        syncStatus, triggerFullSync,
        bootstrapped,
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
