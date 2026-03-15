// =============================================================================
// Export Utilities - CSV Export for Project Control Data
// Instituto i10 — Educação · Tecnologia · Inovação
// =============================================================================

import type {
  Task,
  HiringPosition,
  ActivityLogEntry,
  TaskStatus,
  TaskPriority,
  DepartmentId,
  HiringStatus,
} from '@/data/types';

// ---------------------------------------------------------------------------
// Label Maps
// ---------------------------------------------------------------------------

const statusLabels: Record<TaskStatus, string> = {
  nao_iniciada: 'Não Iniciada',
  em_andamento: 'Em Andamento',
  concluida: 'Concluída',
  bloqueada: 'Bloqueada',
  atrasada: 'Atrasada',
  cancelada: 'Cancelada',
};

const priorityLabels: Record<TaskPriority, string> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

const departmentLabels: Record<DepartmentId, string> = {
  juridico: 'Jurídico',
  tecnologia: 'Tecnologia',
  relacoes_publicas: 'Relações Públicas',
  operacoes_locais: 'Operações Locais',
  santa_catarina: 'Santa Catarina',
  pedagogico: 'Pedagógico',
  administrativo_financeiro: 'Admin/Financeiro',
};

const hiringStatusLabels: Record<HiringStatus, string> = {
  aberta: 'Aberta',
  em_selecao: 'Em Seleção',
  oferta_enviada: 'Oferta Enviada',
  contratado: 'Contratado',
  cancelada: 'Cancelada',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Escapes a single CSV field. If the value contains a comma, double-quote,
 * or newline, the entire field is wrapped in double quotes and any internal
 * double quotes are doubled.
 */
function escapeCSVField(value: string): string {
  if (
    value.includes(',') ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r')
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Converts an array of string arrays (rows) into a single CSV string.
 * Each field is escaped individually.
 */
function buildCSVString(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(escapeCSVField).join(',');
  const dataLines = rows.map((row) =>
    row.map(escapeCSVField).join(','),
  );
  return [headerLine, ...dataLines].join('\r\n');
}

/**
 * Returns today's date formatted as YYYY-MM-DD for use in default filenames.
 */
function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats an ISO date string to a localized Brazilian date string.
 * Returns an empty string if the input is null, undefined, or empty.
 */
function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString('pt-BR');
  } catch {
    return isoString;
  }
}

/**
 * Formats an ISO date string to a localized Brazilian date+time string.
 */
function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleString('pt-BR');
  } catch {
    return isoString;
  }
}

/**
 * Creates a Blob from a CSV string with a UTF-8 BOM prefix so that
 * spreadsheet applications (Excel, Google Sheets) correctly decode
 * Portuguese characters like ã, ç, é, etc.
 */
function createCSVBlob(csvContent: string): Blob {
  const BOM = '\uFEFF';
  return new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
}

/**
 * Triggers a browser file download by creating a temporary anchor element,
 * assigning it an object URL pointing to the provided Blob, and
 * programmatically clicking it.
 */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // Clean up after a short delay so the browser has time to start the download
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Builds a CSV string, wraps it in a BOM-prefixed Blob, and triggers download.
 */
function downloadCSV(
  headers: string[],
  rows: string[][],
  filename: string,
): void {
  const csvContent = buildCSVString(headers, rows);
  const blob = createCSVBlob(csvContent);
  triggerDownload(blob, filename);
}

// ---------------------------------------------------------------------------
// Export Functions
// ---------------------------------------------------------------------------

/**
 * Exports an array of tasks to a CSV file and triggers a browser download.
 *
 * Columns: ID, Titulo, Status, Prioridade, Departamento, Responsaveis,
 *          Data de Entrega, Progresso, Tags, Notas, Criado em
 *
 * @param tasks    - The tasks to export
 * @param filename - Optional filename override (defaults to "tarefas-YYYY-MM-DD.csv")
 */
export function exportTasksToCSV(
  tasks: Task[],
  filename?: string,
): void {
  const headers = [
    'ID',
    'Título',
    'Status',
    'Prioridade',
    'Departamento',
    'Responsáveis',
    'Data de Entrega',
    'Progresso',
    'Tags',
    'Notas',
    'Criado em',
  ];

  const rows = tasks.map((task) => [
    task.id,
    task.title,
    statusLabels[task.status] ?? task.status,
    priorityLabels[task.priority] ?? task.priority,
    departmentLabels[task.departmentId] ?? task.departmentId,
    task.assigneeIds.join('; '),
    formatDate(task.dueDate),
    `${task.progress}%`,
    task.tags.join('; '),
    task.notes,
    formatDate(task.createdAt),
  ]);

  downloadCSV(headers, rows, filename ?? `tarefas-${getTodayISO()}.csv`);
}

/**
 * Exports an array of hiring positions to a CSV file and triggers a browser download.
 *
 * Columns: ID, Titulo, Departamento, Status, Prioridade, Aberta em, Prazo
 *
 * @param hiring   - The hiring positions to export
 * @param filename - Optional filename override (defaults to "contratacoes-YYYY-MM-DD.csv")
 */
export function exportHiringToCSV(
  hiring: HiringPosition[],
  filename?: string,
): void {
  const headers = [
    'ID',
    'Título',
    'Departamento',
    'Status',
    'Prioridade',
    'Aberta em',
    'Prazo',
  ];

  const rows = hiring.map((position) => [
    position.id,
    position.title,
    departmentLabels[position.departmentId] ?? position.departmentId,
    hiringStatusLabels[position.status] ?? position.status,
    priorityLabels[position.priority] ?? position.priority,
    formatDate(position.openedAt),
    formatDate(position.deadlineDate ?? null),
  ]);

  downloadCSV(
    headers,
    rows,
    filename ?? `contratacoes-${getTodayISO()}.csv`,
  );
}

/**
 * Exports an array of activity log entries to a CSV file and triggers a browser download.
 *
 * Columns: Data/Hora, Tipo, Entidade, Acao, Campo, Valor Anterior, Novo Valor
 *
 * @param log      - The activity log entries to export
 * @param filename - Optional filename override (defaults to "atividades-YYYY-MM-DD.csv")
 */
export function exportActivityLogToCSV(
  log: ActivityLogEntry[],
  filename?: string,
): void {
  const headers = [
    'Data/Hora',
    'Tipo',
    'Entidade',
    'Ação',
    'Campo',
    'Valor Anterior',
    'Novo Valor',
  ];

  const entityTypeLabels: Record<ActivityLogEntry['entityType'], string> = {
    task: 'Tarefa',
    hiring: 'Contratação',
    company: 'Empresa',
    person: 'Pessoa',
    orgchart: 'Organograma',
  };

  const actionLabels: Record<ActivityLogEntry['action'], string> = {
    created: 'Criado',
    updated: 'Atualizado',
    deleted: 'Excluído',
    status_changed: 'Status Alterado',
  };

  const rows = log.map((entry) => [
    formatDateTime(entry.timestamp),
    entityTypeLabels[entry.entityType] ?? entry.entityType,
    entry.entityTitle,
    actionLabels[entry.action] ?? entry.action,
    entry.field ?? '',
    entry.oldValue ?? '',
    entry.newValue ?? '',
  ]);

  downloadCSV(
    headers,
    rows,
    filename ?? `atividades-${getTodayISO()}.csv`,
  );
}

/**
 * Exports all project data (tasks, hiring positions, and activity log) as
 * separate CSV files, triggering one download per dataset.
 *
 * Each file is named with the current date:
 *   - tarefas-YYYY-MM-DD.csv
 *   - contratacoes-YYYY-MM-DD.csv
 *   - atividades-YYYY-MM-DD.csv
 *
 * Downloads are staggered with a small delay between each to ensure
 * browsers that throttle rapid downloads handle all three files.
 *
 * @param data - Object containing tasks, hiring positions, and activity log
 */
export function exportAllDataToCSV(data: {
  tasks: Task[];
  hiring: HiringPosition[];
  log: ActivityLogEntry[];
}): void {
  const dateStr = getTodayISO();

  exportTasksToCSV(data.tasks, `tarefas-${dateStr}.csv`);

  setTimeout(() => {
    exportHiringToCSV(data.hiring, `contratacoes-${dateStr}.csv`);
  }, 200);

  setTimeout(() => {
    exportActivityLogToCSV(data.log, `atividades-${dateStr}.csv`);
  }, 400);
}
