# IBEF Platform — Architecture Review
> Generated: 2026-03-23 | Reviewed by: AI Assistant

---

## What This Platform Does

**IBEF (Instituto i10 Project Control)** is an internal operations dashboard built to coordinate the delivery of Brazil's largest state-level EdTech contract — an Encomenda Tecnológica (ETEC) with SED/SC worth R$4.65M, targeting 1,000+ schools, 50,000 teachers, and 550,000 students across Santa Catarina over 2026–2028.

### Core Modules

| Module | What it manages |
|--------|----------------|
| **Dashboard** | Executive KPIs, countdowns to milestones, phase progress, department status |
| **Workstreams / Kanban** | Task management by department with drag-and-drop, subtasks, attachments |
| **Timeline** | 4-phase roadmap with milestones and deliverables |
| **Organograma** | Hierarchical org chart across 7 departments |
| **Contratações** | Hiring pipeline (aberta → contratado) |
| **Associados** | Partner/associate companies |
| **Documentos** | File attachments per task or hiring position |
| **Activity Log** | Changelog of all mutations |
| **Landing Page** | Public-facing cinematic intro for i10 |

### Key Technical Features
- **Offline-first** via localStorage + IndexedDB (file blobs)
- **Cross-device sync** via pull/push mutations against Vercel Postgres
- **PWA** — installable, service worker, Web Push notifications
- **Voice commands** via Web Speech API
- **CSV/JSON export**
- **Framer Motion** animations throughout

---

## Architecture Overview

```
Browser
  ├── React 19 + Next.js 15 (App Router)
  ├── ProjectContext (global state, 500+ lines)
  │     ├── localStorage (primary offline store)
  │     ├── IndexedDB (file blobs)
  │     └── SyncManager (pull/push every 30s)
  └── Service Worker (cache + push)

Server (Vercel)
  ├── /api/sync GET  → pullSince(timestamp) → Postgres
  ├── /api/sync POST → pushMutations()      → Postgres
  └── /api/push/*   → Web Push VAPID

Database (Vercel Postgres)
  ├── tasks            (id, data JSONB, updated_at, deleted)
  ├── people           (id, data JSONB, updated_at, deleted)
  ├── hiring_positions (id, data JSONB, updated_at, deleted)
  ├── associate_companies (id, data JSONB, updated_at, deleted)
  ├── activity_log     (id, data JSONB, updated_at)
  └── push_subscriptions (id, endpoint, keys_p256dh, keys_auth)
```

---

## Issues & Improvements

### 🔴 CRITICAL

---

#### 1. No Authentication on Any API Route

**Current state:** `/api/sync` (read + write) and `/api/push/subscribe` have zero authentication. Anyone who discovers the URL can:
- Read all project data (people, tasks, hiring, companies)
- Write arbitrary mutations (overwrite or delete tasks)
- Register their device for push notifications

**For an ETEC contract with government data, this is a hard blocker.**

**Fix:**
```typescript
// Middleware (middleware.ts)
import { NextRequest, NextResponse } from 'next/server';

const API_SECRET = process.env.API_SECRET!;

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const token = req.headers.get('x-api-key') ?? 
                  req.nextUrl.searchParams.get('key');
    if (token !== API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  return NextResponse.next();
}
```

Longer term: use NextAuth.js or Clerk with role-based access per department.

---

#### 2. Database Schema — The JSONB Blob Anti-Pattern

**Current state:** All tables use a single `data JSONB` column for the entire entity:
```sql
tasks (id TEXT, data JSONB, updated_at TIMESTAMPTZ, deleted BOOL)
```

**Problems:**
- Can't filter tasks by status, priority, or department at the DB level
- No indexes on queryable fields — every query deserializes all rows
- No foreign key constraints
- No DB-level validation
- Full table scans on every pull

**Fix — proper relational schema:**
```sql
CREATE TABLE tasks (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('nao_iniciada','em_andamento','concluida','bloqueada','atrasada','cancelada')),
  priority     TEXT NOT NULL CHECK (priority IN ('critica','alta','media','baixa')),
  department_id TEXT NOT NULL,
  phase_id     TEXT REFERENCES phases(id),
  due_date     DATE,
  progress     SMALLINT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  data         JSONB,   -- for flexible fields (subtasks, tags, notes)
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted      BOOL NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_tasks_status ON tasks(status) WHERE NOT deleted;
CREATE INDEX idx_tasks_department ON tasks(department_id) WHERE NOT deleted;
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE NOT deleted;
CREATE INDEX idx_tasks_updated_at ON tasks(updated_at);
```

This enables server-side filtering, dramatically smaller payloads on pull, and proper relational integrity.

---

#### 3. Naive Last-Write-Wins (LWW) Conflict Resolution

**Current state:** Two team members editing the same task offline will silently overwrite each other based on wall-clock timestamps. Clock skew between devices makes this worse.

**Scenario:** Bruno updates a task's status to `em_andamento` at 10:00 on his laptop. Raphael marks it `concluida` at 10:01 on his phone (both were offline). When both sync, Raphael's edit wins — but Bruno's status change is silently lost, not even logged.

**Fix options (in order of effort):**
1. **Field-level LWW** (easier) — store `updated_at` per field, not per entity. Only overwrite individual fields where the incoming timestamp is newer.
2. **Operational transforms** (medium) — detect conflicts and present a merge dialog.
3. **CRDTs** (hard, but best for collaboration) — Automerge or Yjs for true conflict-free concurrent editing.

Minimum viable: detect the conflict on the server and return a `409 Conflict` with both versions so the client can show a reconciliation UI.

---

### 🟠 HIGH PRIORITY

---

#### 4. God Context — `ProjectContext.tsx` (500+ lines)

**Current state:** One massive React Context manages tasks, hiring, companies, people, notifications, file attachments, sync state, and activity logging. Every component that calls `useProject()` re-renders on any state change anywhere.

**Impact:** Changing a task title triggers re-renders in the Org Chart, Hiring page, and everywhere else using the context.

**Fix — split into focused contexts:**
```
contexts/
  TaskContext.tsx        — tasks, subtasks, CRUD
  TeamContext.tsx        — people, CRUD
  HiringContext.tsx      — hiring positions
  CompanyContext.tsx     — associate companies
  NotificationContext.tsx
  SyncContext.tsx        — sync status, triggerSync
  FileContext.tsx        — attachments
```

Or migrate to **Zustand** (lightweight, no re-render bleed):
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTaskStore = create(persist(
  (set, get) => ({
    tasks: initialTasks,
    updateTask: (id, updates) => set(state => ({
      tasks: state.tasks.map(t => t.id === id ? {...t, ...updates} : t)
    })),
    // ...
  }),
  { name: 'i10-tasks' }
));
```

---

#### 5. ID Generation Using `Date.now()`

**Current state:**
```typescript
const id = `task-${Date.now()}`;
const id = `hiring-${Date.now()}`;
```

**Problems:**
- Two rapid operations (e.g. bulk task creation) within the same millisecond produce duplicate IDs
- IDs are predictable / enumerable
- Non-standard format

**Fix:**
```typescript
// Use built-in crypto (works in Node.js 19+ and browser)
const id = `task-${crypto.randomUUID()}`;

// Or a dedicated utility
export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
```

---

#### 6. Static Seed Data as Source of Truth

**Current state:** `projectData.ts` has 1,500+ lines of hardcoded data (phases, departments, milestones, initial tasks, people). The app boots from localStorage, falls back to this seed if nothing's in storage.

**Problems:**
- A new team member opening the app gets the hardcoded seed, not the live DB state
- If a phase date changes in code but the DB has old data, they diverge silently
- The DB is only authoritative for mutations *on top of* the seed

**Fix:**
1. Move phases, departments, milestones to the DB (seed once via `npm run db:seed`, then never in code)
2. On first mount (no `i10-last-sync` in localStorage), do a full pull before rendering
3. Show a proper loading skeleton, not stale hardcoded data

```typescript
// In ProjectProvider
const [bootstrapped, setBootstrapped] = useState(false);

useEffect(() => {
  if (!localStorage.getItem('i10-last-sync')) {
    // First time user — pull everything from DB
    syncManager.fullPull().then(() => setBootstrapped(true));
  } else {
    setBootstrapped(true);
  }
}, []);

if (!bootstrapped) return <LoadingScreen />;
```

---

#### 7. No Input Validation on the Sync API

**Current state:** The POST `/api/sync` endpoint accepts and applies arbitrary JSON mutations with no schema validation:
```typescript
const mutations: SyncMutation[] = body.mutations;
// Used directly without validation
const results = await pushMutations(mutations);
```

A malformed or malicious payload could corrupt DB rows.

**Fix — add Zod validation:**
```typescript
import { z } from 'zod';

const MutationSchema = z.object({
  table: z.enum(['tasks', 'people', 'hiring_positions', 'associate_companies', 'activity_log']),
  operation: z.enum(['upsert', 'delete']),
  id: z.string().min(1).max(100),
  data: z.record(z.unknown()).optional(),
  timestamp: z.string().datetime(),
});

const BodySchema = z.object({
  mutations: z.array(MutationSchema).min(1).max(100),
  senderEndpoint: z.string().url().optional(),
});
```

---

### 🟡 MEDIUM PRIORITY

---

#### 8. SyncManager as Module-Level Singleton

**Current state:**
```typescript
let _instance: SyncManager | null = null;
export function getSyncManager(): SyncManager { ... }
```

In Next.js with Hot Module Replacement and SSR, module-level singletons can behave unexpectedly (double initialization, stale instances after HMR).

**Fix:** Scope the SyncManager to the React tree via `useRef` inside `ProjectProvider`:
```typescript
const syncManagerRef = useRef<SyncManager | null>(null);
if (!syncManagerRef.current) {
  syncManagerRef.current = new SyncManager();
}
```
(The code already does this! But it also calls `getSyncManager()` which uses the module singleton. Remove the module singleton and only use `useRef`.)

---

#### 9. Missing Error Boundaries

**Current state:** No React error boundaries. A crash in any component (e.g. Framer Motion, OrgChart rendering, voice commands) takes down the whole page.

**Fix — wrap critical sections:**
```typescript
// components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return <FallbackUI error={this.state.error} />;
    return this.props.children;
  }
}

// In pages:
<ErrorBoundary>
  <KanbanBoard />
</ErrorBoundary>
```

---

#### 10. No Budget Tracking Below Phase Level

**Current state:** `budgetBRL` only exists on `Phase`. There's no budget allocation per task, per department, or spend tracking.

**For an ETEC contract, financial traceability is a compliance requirement** (Law 13.243/2016 and Decree 9.283/2018 require financial reporting milestones).

**Add to types:**
```typescript
interface Task {
  // ...existing fields
  estimatedCostBRL?: number;
  actualCostBRL?: number;
  costCategory?: 'pessoal' | 'equipamentos' | 'servicos' | 'infraestrutura' | 'outros';
}

interface Department {
  // ...
  budgetBRL?: number;
  spentBRL?: number;
}
```

Add a **Financeiro** dashboard panel showing budget vs. spend by phase and department.

---

#### 11. Notifications Re-generated on Every Task State Change

**Current state:** The `useEffect` that generates notifications runs on every `tasks` change — including when tasks are modified by sync pulls:
```typescript
useEffect(() => {
  // Regenerates ALL notifications from scratch every time tasks changes
  const newNotifs: Notification[] = [];
  tasks.forEach((t) => { /* ... */ });
  setNotifications(...);
}, [tasks]);
```

This fires browser notifications on every sync pull for *every* overdue task, every time.

**Fix:** Track which notifications have already been fired in a `useRef` set:
```typescript
const firedNotifs = useRef<Set<string>>(new Set(
  JSON.parse(localStorage.getItem('i10-fired-notifs') ?? '[]')
));
```

Only fire browser notifications for IDs not already in the set.

---

#### 12. Voice Commands Require Better Degradation

**Current state:** `VoiceCommandSystem` uses Web Speech API which only works in Chrome/Edge. On Firefox, Safari iOS, or any unsupported browser, it fails silently or throws.

**Fix:** Detect support upfront, show clear UI feedback:
```typescript
const supported = typeof window !== 'undefined' && 
  'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

if (!supported) return null; // Or show "voice not supported" tooltip
```

---

### 🟢 NICE TO HAVE

---

#### 13. Role-Based Access Control (RBAC)

Each of the 7 departments (Juridico, Tecnologia, RP, etc.) should only be able to edit their own tasks and see certain views. Currently there's no concept of "logged in user" at all.

**Suggested roles:**
- `admin` — full access (Raphael, Bruno)
- `department_lead` — CRUD for own department
- `member` — read + own task updates only
- `viewer` — read only

---

#### 14. Real-Time Collaboration (WebSockets)

**Current state:** Pull polling every 30 seconds. If two people are working simultaneously, one waits up to 30s to see the other's changes.

**Fix:** Replace polling with **Vercel Realtime** (Ably/Pusher) or **Supabase Realtime**. On a mutation push, broadcast a lightweight "invalidate" event — clients immediately re-pull on receive.

---

#### 15. Dependency Graph Visualization

Tasks have a `dependencies: string[]` field but there's no UI that shows the dependency graph. For a project with ETEC phase gates, this matters — blocking tasks should be visible.

Add a simple **DAG view** (react-flow or D3) on the timeline or workstreams page showing which tasks are blocked on what.

---

#### 16. Missing Phases/Milestones in DB

Phases, milestones, and departments are read-only from static `projectData.ts`. They cannot be updated from the UI and don't sync. As the project evolves (phase dates shift, new milestones added), this becomes maintenance debt.

Move them to the DB with their own sync tables.

---

## Summary

| Category | Issues Found |
|----------|-------------|
| 🔴 Critical | 3 (auth, DB schema, conflict resolution) |
| 🟠 High | 4 (God Context, ID gen, static seed, validation) |
| 🟡 Medium | 5 (singleton, error boundaries, budget, notifs, voice) |
| 🟢 Nice-to-have | 4 (RBAC, realtime, dependency viz, DB phases) |

**Top 3 things to fix first:**
1. **Add authentication** — no sensitive data should be unprotected
2. **Normalize the DB schema** — JSONB-only is a future bottleneck
3. **Split ProjectContext** — unblock performance and maintainability

---

*This review was generated from static analysis of the IBEF codebase. All suggestions should be validated against operational constraints.*
