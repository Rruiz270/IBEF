// =============================================================================
// i10 Project Control - Type Definitions
// Instituto i10 — Educação · Tecnologia · Inovação
// Encomenda Tecnológica (ETEC) - Santa Catarina
// =============================================================================

// ---------------------------------------------------------------------------
// Enums & Literal Types
// ---------------------------------------------------------------------------

export type TaskStatus =
  | 'nao_iniciada'   // Not started
  | 'em_andamento'   // In progress
  | 'concluida'      // Completed
  | 'bloqueada'      // Blocked / waiting on dependency
  | 'atrasada'       // Overdue
  | 'cancelada';     // Cancelled

export type TaskPriority =
  | 'critica'        // Critical - drop everything
  | 'alta'           // High
  | 'media'          // Medium
  | 'baixa';         // Low

export type PhaseStatus =
  | 'planejada'      // Planned / upcoming
  | 'em_andamento'   // Currently active
  | 'concluida'      // Done
  | 'atrasada';      // Behind schedule

export type PersonRole =
  | 'fundador'       // Founding member (will attend first assembleia)
  | 'convidado'      // Invited to advisory/executive board
  | 'contratacao'    // Hiring target
  | 'parceiro'       // Associate / partner company representative
  | 'lider';         // Project leader

export type DepartmentId =
  | 'juridico'
  | 'tecnologia'
  | 'relacoes_publicas'
  | 'operacoes_locais'
  | 'santa_catarina'
  | 'pedagogico'
  | 'administrativo_financeiro';

export type MilestoneStatus =
  | 'pendente'
  | 'em_andamento'
  | 'concluido'
  | 'atrasado';

export type CompanyType =
  | 'tech'
  | 'administrative'
  | 'accounting'
  | 'consulting'
  | 'educational';

export type HiringStatus =
  | 'aberta'         // Open position
  | 'em_selecao'     // Screening / interviewing
  | 'oferta_enviada' // Offer sent
  | 'contratado'     // Hired
  | 'cancelada';     // Position cancelled

// ---------------------------------------------------------------------------
// Core Data Structures
// ---------------------------------------------------------------------------

/** A subtask within a task */
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

/** A file attachment linked to a task or hiring position */
export interface FileAttachment {
  id: string;
  name: string;
  size: number;        // bytes
  type: string;        // MIME type
  entityType: 'task' | 'hiring';
  entityId: string;
  departmentId: DepartmentId;
  uploadedAt: string;  // ISO datetime
}

/** A single task within a department */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  departmentId: DepartmentId;
  assigneeIds: string[];           // Person IDs
  /** ISO date string (YYYY-MM-DD) or null if no hard deadline */
  dueDate: string | null;
  /** ISO date string */
  createdAt: string;
  /** ISO date string or null */
  completedAt: string | null;
  /** Related phase id, if tied to a specific ETEC phase */
  phaseId: string | null;
  /** IDs of tasks that must be completed first */
  dependencies: string[];
  /** Arbitrary notes / context */
  notes: string;
  /** 0-100 percentage */
  progress: number;
  tags: string[];
  subtasks: Subtask[];
  attachmentIds?: string[];
}

/** An ETEC project phase */
export interface Phase {
  id: string;
  /** e.g. 0, 1, 2, 3 */
  number: number;
  title: string;
  description: string;
  status: PhaseStatus;
  /** ISO date string */
  startDate: string;
  /** ISO date string */
  endDate: string;
  /** 0-100 */
  progress: number;
  /** Key deliverables for this phase */
  deliverables: string[];
  /** Budget allocated (BRL) */
  budgetBRL: number | null;
}

/** A department / area within the project */
export interface Department {
  id: DepartmentId;
  name: string;
  description: string;
  /** Person IDs of department leads */
  leadIds: string[];
  /** Hex colour used in UI */
  color: string;
  /** Icon name from lucide-react */
  icon: string;
  taskIds: string[];
}

/** A person involved in the project */
export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  /** Their title / position within i10 or externally */
  title: string;
  /** Which departments they belong to (by DepartmentId) */
  departmentIds: DepartmentId[];
  email: string | null;
  /** Short bio or context */
  notes: string;
  /** URL to avatar image, if any */
  avatarUrl: string | null;
  /** Whether they are confirmed for the first assembleia */
  assembleiaConfirmed: boolean;
}

/** An associate / partner company */
export interface AssociateCompany {
  id: string;
  name: string;
  type: CompanyType;
  description: string;
  contactPerson: string | null;
  website: string | null;
  /** Which departments they are linked to */
  departmentIds: DepartmentId[];
}

/** A key project milestone */
export interface Milestone {
  id: string;
  title: string;
  description: string;
  /** ISO date string */
  targetDate: string;
  status: MilestoneStatus;
  /** Related phase, if applicable */
  phaseId: string | null;
  /** Is this a hard contractual / legal deadline? */
  isCritical: boolean;
  /** Related department IDs */
  departmentIds: DepartmentId[];
}

/** A position the project is hiring for */
export interface HiringPosition {
  id: string;
  title: string;
  departmentId: DepartmentId;
  description: string;
  status: HiringStatus;
  priority: TaskPriority;
  /** ISO date string - when position was opened */
  openedAt: string;
  /** ISO date string or null */
  filledAt: string | null;
  /** Candidate name if filled */
  filledBy: string | null;
  /** ISO date string - deadline for filling this position */
  deadlineDate?: string;
  attachmentIds?: string[];
  /** Free-text notes about potential candidates */
  candidateNotes?: string;
}

// ---------------------------------------------------------------------------
// Aggregate / Dashboard Types
// ---------------------------------------------------------------------------

/** Summary stats for the dashboard header */
export interface DashboardSummary {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  criticalTasks: number;
  activePhase: Phase | null;
  nextMilestone: Milestone | null;
  daysUntilNextMilestone: number | null;
  overallProgress: number; // 0-100
}

/** Used by countdown widgets */
export interface CountdownTarget {
  id: string;
  label: string;
  /** ISO date string */
  targetDate: string;
  isCritical: boolean;
  /** Additional context shown below the countdown */
  context: string;
}

/** The complete project data store */
export interface ProjectData {
  phases: Phase[];
  departments: Department[];
  tasks: Task[];
  people: Person[];
  companies: AssociateCompany[];
  milestones: Milestone[];
  hiring: HiringPosition[];
  countdowns: CountdownTarget[];
}

// ---------------------------------------------------------------------------
// UI Component Types
// ---------------------------------------------------------------------------

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

/** An entry in the activity log */
export interface ActivityLogEntry {
  id: string;
  timestamp: string;       // ISO date string
  entityType: 'task' | 'hiring' | 'company' | 'person' | 'orgchart';
  entityId: string;
  entityTitle: string;
  action: 'created' | 'updated' | 'deleted' | 'status_changed';
  field?: string;          // Which field changed
  oldValue?: string;
  newValue?: string;
}

/** Used by the org chart component for tree rendering */
export interface OrgNode {
  person: Person;
  /** Display label override (e.g. department name for group nodes) */
  label?: string;
  children?: OrgNode[];
  expanded?: boolean;
}
