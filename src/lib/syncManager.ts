/**
 * src/lib/syncManager.ts
 * Client-side sync orchestration: offline queue, auto-retry, periodic poll.
 */

import { getPushEndpoint } from '@/lib/notifications';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

type TableName = 'tasks' | 'people' | 'hiring_positions' | 'associate_companies' | 'activity_log';

export interface SyncMutation {
  table: TableName;
  operation: 'upsert' | 'delete';
  id: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

export interface SyncPullResponse {
  tasks: { id: string; data: Record<string, unknown>; updated_at: string; deleted?: boolean }[];
  people: { id: string; data: Record<string, unknown>; updated_at: string; deleted?: boolean }[];
  hiringPositions: { id: string; data: Record<string, unknown>; updated_at: string; deleted?: boolean }[];
  associateCompanies: { id: string; data: Record<string, unknown>; updated_at: string; deleted?: boolean }[];
  activityLog: { id: string; data: Record<string, unknown>; updated_at: string }[];
  serverTimestamp: string;
}

type StatusCallback = (status: SyncStatus) => void;
type PullCallback = (data: SyncPullResponse) => void;

// ---------------------------------------------------------------------------
// Queue persistence
// ---------------------------------------------------------------------------

const QUEUE_KEY = 'i10-sync-queue';
const LAST_SYNC_KEY = 'i10-last-sync';

function loadQueue(): SyncMutation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: SyncMutation[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

function getLastSync(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_SYNC_KEY);
}

function setLastSync(ts: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_SYNC_KEY, ts);
}

// ---------------------------------------------------------------------------
// SyncManager
// ---------------------------------------------------------------------------

export class SyncManager {
  private queue: SyncMutation[] = [];
  private flushing = false;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private onStatusChange: StatusCallback | null = null;
  private onPull: PullCallback | null = null;
  private _status: SyncStatus = 'synced';
  private pollIntervalMs = 30_000;

  constructor() {
    this.queue = loadQueue();
  }

  // --- Public API ---

  get status(): SyncStatus {
    return this._status;
  }

  setCallbacks(onStatus: StatusCallback, onPull: PullCallback) {
    this.onStatusChange = onStatus;
    this.onPull = onPull;
  }

  /** Start polling + listen for online/offline events */
  start() {
    if (typeof window === 'undefined') return;

    // Initial sync
    this.pull();

    // Periodic poll
    this.pollTimer = setInterval(() => this.pull(), this.pollIntervalMs);

    // Reconnection handler
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    // Set offline status if already offline
    if (!navigator.onLine) {
      this.updateStatus('offline');
    }
  }

  /** Stop polling + cleanup listeners */
  stop() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
  }

  /** Enqueue a mutation. If online, flush immediately. */
  enqueue(mutation: SyncMutation) {
    this.queue.push(mutation);
    saveQueue(this.queue);

    if (navigator.onLine) {
      this.flush();
    }
  }

  /** Force a full pull (no since param) */
  async fullPull() {
    await this.pull(true);
  }

  // --- Private ---

  private updateStatus(status: SyncStatus) {
    if (this._status === status) return;
    this._status = status;
    this.onStatusChange?.(status);
  }

  private handleOnline = () => {
    this.flush().then(() => this.pull(true));
  };

  private handleOffline = () => {
    this.updateStatus('offline');
  };

  /** Pull changes from server */
  private async pull(full = false) {
    if (!navigator.onLine) {
      this.updateStatus('offline');
      return;
    }

    this.updateStatus('syncing');

    try {
      const since = full ? undefined : getLastSync();
      const url = since ? `/api/sync?since=${encodeURIComponent(since)}` : '/api/sync';
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Pull failed: ${res.status}`);
      }

      const data: SyncPullResponse = await res.json();
      setLastSync(data.serverTimestamp);
      this.onPull?.(data);

      // After pull, flush any pending mutations
      if (this.queue.length > 0) {
        await this.flush();
      } else {
        this.updateStatus('synced');
      }
    } catch (err) {
      console.error('[SyncManager] pull error:', err);
      this.updateStatus('error');
    }
  }

  /** Flush pending mutations to server */
  private async flush() {
    if (this.flushing || this.queue.length === 0) {
      if (this.queue.length === 0 && navigator.onLine) {
        this.updateStatus('synced');
      }
      return;
    }

    if (!navigator.onLine) {
      this.updateStatus('offline');
      return;
    }

    this.flushing = true;
    this.updateStatus('syncing');

    // Send current batch
    const batch = [...this.queue];

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mutations: batch,
          senderEndpoint: getPushEndpoint() ?? undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Push failed: ${res.status}`);
      }

      // Remove flushed mutations from queue
      this.queue = this.queue.slice(batch.length);
      saveQueue(this.queue);
      this.updateStatus(this.queue.length > 0 ? 'syncing' : 'synced');
    } catch (err) {
      console.error('[SyncManager] flush error:', err);
      this.updateStatus('error');
    } finally {
      this.flushing = false;
    }
  }
}

// Singleton
let _instance: SyncManager | null = null;

export function getSyncManager(): SyncManager {
  if (!_instance) {
    _instance = new SyncManager();
  }
  return _instance;
}
