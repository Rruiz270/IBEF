// Voice Command Parser for PT-BR
// Pure module: normalizes Portuguese text, extracts intent + params via keyword dictionaries

import type { Task, HiringPosition, DepartmentId, TaskStatus, TaskPriority, HiringStatus } from '@/data/types';

// ---------------------------------------------------------------------------
// Intent types
// ---------------------------------------------------------------------------

export type VoiceIntent =
  | 'CREATE_TASK'
  | 'UPDATE_TASK_STATUS'
  | 'UPDATE_TASK_PROGRESS'
  | 'DELETE_TASK'
  | 'CREATE_HIRING'
  | 'UPDATE_HIRING_STATUS'
  | 'ADD_SUBTASK'
  | 'NAVIGATE'
  | 'QUERY'
  | 'UNKNOWN';

export interface ParsedCommand {
  intent: VoiceIntent;
  title?: string;
  parentTitle?: string; // For subtasks: the parent task title
  departmentId?: DepartmentId;
  status?: TaskStatus;
  hiringStatus?: HiringStatus;
  priority?: TaskPriority;
  progress?: number;
  route?: string;
  queryAnswer?: string;
  matchedTaskId?: string;
  matchedHiringId?: string;
  raw: string;
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Department mapping
// ---------------------------------------------------------------------------

const DEPARTMENT_KEYWORDS: Record<string, DepartmentId> = {
  juridico: 'juridico',
  legal: 'juridico',
  tecnologia: 'tecnologia',
  tech: 'tecnologia',
  ti: 'tecnologia',
  'relacoes publicas': 'relacoes_publicas',
  rp: 'relacoes_publicas',
  comunicacao: 'relacoes_publicas',
  'operacoes locais': 'operacoes_locais',
  operacoes: 'operacoes_locais',
  'santa catarina': 'santa_catarina',
  sc: 'santa_catarina',
  sed: 'santa_catarina',
  pedagogico: 'pedagogico',
  educacao: 'pedagogico',
  administrativo: 'administrativo_financeiro',
  financeiro: 'administrativo_financeiro',
  'admin financeiro': 'administrativo_financeiro',
  adm: 'administrativo_financeiro',
};

function extractDepartment(text: string): DepartmentId | undefined {
  const norm = normalize(text);
  // Check longer keys first for better matching
  const sorted = Object.entries(DEPARTMENT_KEYWORDS).sort((a, b) => b[0].length - a[0].length);
  for (const [keyword, dept] of sorted) {
    if (norm.includes(keyword)) return dept;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Status mapping
// ---------------------------------------------------------------------------

const STATUS_KEYWORDS: Record<string, TaskStatus> = {
  'nao iniciada': 'nao_iniciada',
  'nao comecou': 'nao_iniciada',
  pendente: 'nao_iniciada',
  'em andamento': 'em_andamento',
  andamento: 'em_andamento',
  iniciada: 'em_andamento',
  concluida: 'concluida',
  completa: 'concluida',
  finalizada: 'concluida',
  feita: 'concluida',
  terminada: 'concluida',
  pronta: 'concluida',
  bloqueada: 'bloqueada',
  travada: 'bloqueada',
  atrasada: 'atrasada',
  cancelada: 'cancelada',
};

function extractStatus(text: string): TaskStatus | undefined {
  const norm = normalize(text);
  const sorted = Object.entries(STATUS_KEYWORDS).sort((a, b) => b[0].length - a[0].length);
  for (const [keyword, status] of sorted) {
    if (norm.includes(keyword)) return status;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Hiring status mapping
// ---------------------------------------------------------------------------

const HIRING_STATUS_KEYWORDS: Record<string, HiringStatus> = {
  aberta: 'aberta',
  'em selecao': 'em_selecao',
  selecao: 'em_selecao',
  entrevista: 'em_selecao',
  'oferta enviada': 'oferta_enviada',
  oferta: 'oferta_enviada',
  contratado: 'contratado',
  contratada: 'contratado',
  preenchida: 'contratado',
  cancelada: 'cancelada',
};

function extractHiringStatus(text: string): HiringStatus | undefined {
  const norm = normalize(text);
  const sorted = Object.entries(HIRING_STATUS_KEYWORDS).sort((a, b) => b[0].length - a[0].length);
  for (const [keyword, status] of sorted) {
    if (norm.includes(keyword)) return status;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Priority mapping
// ---------------------------------------------------------------------------

const PRIORITY_KEYWORDS: Record<string, TaskPriority> = {
  critica: 'critica',
  urgente: 'critica',
  alta: 'alta',
  importante: 'alta',
  media: 'media',
  normal: 'media',
  baixa: 'baixa',
  pouca: 'baixa',
};

function extractPriority(text: string): TaskPriority | undefined {
  const norm = normalize(text);
  for (const [keyword, priority] of Object.entries(PRIORITY_KEYWORDS)) {
    if (norm.includes(keyword)) return priority;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Progress extraction
// ---------------------------------------------------------------------------

function extractProgress(text: string): number | undefined {
  const norm = normalize(text);
  // Match patterns like "50 porcento", "50%", "50 por cento"
  const match = norm.match(/(\d{1,3})\s*(?:porcento|por\s*cento|%)/);
  if (match) {
    const val = parseInt(match[1], 10);
    if (val >= 0 && val <= 100) return val;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Navigation mapping
// ---------------------------------------------------------------------------

const ROUTE_KEYWORDS: Record<string, string> = {
  dashboard: '/dashboard',
  painel: '/dashboard',
  inicio: '/dashboard',
  departamentos: '/workstreams',
  atividades: '/workstreams',
  workstreams: '/workstreams',
  kanban: '/workstreams',
  contratacoes: '/contratacoes',
  vagas: '/contratacoes',
  'recursos humanos': '/contratacoes',
  rh: '/contratacoes',
  associados: '/associados',
  parceiros: '/associados',
  empresas: '/associados',
  juridico: '/juridico',
  legal: '/juridico',
  'santa catarina': '/santa-catarina',
  sed: '/santa-catarina',
  cronograma: '/timeline',
  timeline: '/timeline',
  fases: '/timeline',
  organograma: '/organograma',
  equipe: '/organograma',
  time: '/organograma',
};

function extractRoute(text: string): string | undefined {
  const norm = normalize(text);
  const sorted = Object.entries(ROUTE_KEYWORDS).sort((a, b) => b[0].length - a[0].length);
  for (const [keyword, route] of sorted) {
    if (norm.includes(keyword)) return route;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Fuzzy title matching
// ---------------------------------------------------------------------------

function fuzzyScore(query: string, target: string): number {
  const q = normalize(query);
  const t = normalize(target);
  if (t.includes(q)) return q.length / t.length + 0.5;
  // Word overlap
  const qWords = q.split(' ').filter(Boolean);
  const tWords = t.split(' ').filter(Boolean);
  let matched = 0;
  for (const qw of qWords) {
    if (tWords.some((tw) => tw.includes(qw) || qw.includes(tw))) matched++;
  }
  return qWords.length > 0 ? matched / qWords.length : 0;
}

function findBestTask(query: string, tasks: Task[]): Task | undefined {
  let best: Task | undefined;
  let bestScore = 0.3; // minimum threshold
  for (const task of tasks) {
    const score = fuzzyScore(query, task.title);
    if (score > bestScore) {
      bestScore = score;
      best = task;
    }
  }
  return best;
}

function findBestHiring(query: string, hirings: HiringPosition[]): HiringPosition | undefined {
  let best: HiringPosition | undefined;
  let bestScore = 0.3;
  for (const h of hirings) {
    const score = fuzzyScore(query, h.title);
    if (score > bestScore) {
      bestScore = score;
      best = h;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Title extraction helpers
// ---------------------------------------------------------------------------

function extractTitleAfterKeyword(text: string, keywords: string[]): string {
  const norm = normalize(text);
  for (const kw of keywords) {
    const idx = norm.indexOf(kw);
    if (idx >= 0) {
      let rest = norm.slice(idx + kw.length).trim();
      // Remove department / priority / status suffixes
      for (const dk of Object.keys(DEPARTMENT_KEYWORDS)) {
        const dkIdx = rest.lastIndexOf(' no ' + dk);
        if (dkIdx > 0) rest = rest.slice(0, dkIdx).trim();
        const dkIdx2 = rest.lastIndexOf(' na ' + dk);
        if (dkIdx2 > 0) rest = rest.slice(0, dkIdx2).trim();
      }
      for (const pk of Object.keys(PRIORITY_KEYWORDS)) {
        const pIdx = rest.lastIndexOf(' com prioridade ' + pk);
        if (pIdx > 0) rest = rest.slice(0, pIdx).trim();
        const pIdx2 = rest.lastIndexOf(' prioridade ' + pk);
        if (pIdx2 > 0) rest = rest.slice(0, pIdx2).trim();
      }
      // Remove "para X" status suffix
      for (const sk of Object.keys(STATUS_KEYWORDS)) {
        const sIdx = rest.lastIndexOf(' para ' + sk);
        if (sIdx > 0) rest = rest.slice(0, sIdx).trim();
      }
      if (rest.length > 0) return rest;
    }
  }
  return '';
}

// Extract text between two keyword groups
function extractBetweenKeywords(text: string, beforeKeywords: string[], afterKeywords: string[]): string {
  const norm = normalize(text);
  let startIdx = 0;
  for (const kw of beforeKeywords) {
    const idx = norm.indexOf(kw);
    if (idx >= 0) {
      startIdx = idx + kw.length;
      break;
    }
  }
  let endIdx = norm.length;
  for (const kw of afterKeywords) {
    const idx = norm.indexOf(kw, startIdx);
    if (idx >= 0 && idx < endIdx) {
      endIdx = idx;
    }
  }
  return norm.slice(startIdx, endIdx).trim();
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

export function parseVoiceCommand(
  raw: string,
  tasks: Task[],
  hiringPositions: HiringPosition[],
): ParsedCommand {
  const norm = normalize(raw);

  // 1. NAVIGATE
  if (/(?:mostrar|ir para|abrir|navegar|vai para|mostra)/.test(norm)) {
    const route = extractRoute(raw);
    if (route) {
      return { intent: 'NAVIGATE', route, raw };
    }
  }

  // 2. CREATE_TASK
  if (/(?:criar tarefa|nova tarefa|adicionar tarefa|crie tarefa|cria tarefa|criar atividade|nova atividade)/.test(norm)) {
    const title = extractTitleAfterKeyword(raw, [
      'criar tarefa ', 'nova tarefa ', 'adicionar tarefa ', 'crie tarefa ', 'cria tarefa ',
      'criar atividade ', 'nova atividade ',
    ]);
    return {
      intent: 'CREATE_TASK',
      title: title || 'Nova Tarefa',
      departmentId: extractDepartment(raw),
      priority: extractPriority(raw) ?? 'media',
      raw,
    };
  }

  // 3. CREATE_HIRING
  if (/(?:abrir vaga|nova vaga|criar vaga|contratar|nova contratacao)/.test(norm)) {
    const title = extractTitleAfterKeyword(raw, [
      'abrir vaga de ', 'abrir vaga ', 'nova vaga de ', 'nova vaga ',
      'criar vaga de ', 'criar vaga ', 'contratar ',
    ]);
    return {
      intent: 'CREATE_HIRING',
      title: title || 'Nova Vaga',
      departmentId: extractDepartment(raw),
      priority: extractPriority(raw) ?? 'media',
      raw,
    };
  }

  // 4. ADD_SUBTASK
  if (/(?:adicionar subtarefa|nova subtarefa|criar subtarefa)/.test(norm)) {
    const subtaskTitle = extractBetweenKeywords(
      raw,
      ['adicionar subtarefa ', 'nova subtarefa ', 'criar subtarefa '],
      [' na tarefa ', ' em tarefa ', ' da tarefa '],
    );
    const parentTitle = extractTitleAfterKeyword(raw, [' na tarefa ', ' em tarefa ', ' da tarefa ']);
    const parent = findBestTask(parentTitle, tasks);
    return {
      intent: 'ADD_SUBTASK',
      title: subtaskTitle || 'Nova subtarefa',
      parentTitle,
      matchedTaskId: parent?.id,
      raw,
    };
  }

  // 5. DELETE_TASK
  if (/(?:excluir tarefa|deletar tarefa|remover tarefa|apagar tarefa)/.test(norm)) {
    const title = extractTitleAfterKeyword(raw, [
      'excluir tarefa ', 'deletar tarefa ', 'remover tarefa ', 'apagar tarefa ',
    ]);
    const match = findBestTask(title, tasks);
    return {
      intent: 'DELETE_TASK',
      title,
      matchedTaskId: match?.id,
      raw,
    };
  }

  // 6. UPDATE_TASK_PROGRESS
  if (/(?:progresso|porcentagem|porcento|por cento)/.test(norm)) {
    const progress = extractProgress(raw);
    if (progress !== undefined) {
      // Extract task title — everything between "tarefa" and the number
      let taskRef = '';
      const tarIdx = norm.indexOf('tarefa');
      if (tarIdx >= 0) {
        const afterTar = norm.slice(tarIdx + 7).trim();
        const numMatch = afterTar.match(/^(.*?)(\d{1,3})\s*(?:porcento|por\s*cento|%)/);
        if (numMatch) taskRef = numMatch[1].trim();
      }
      const match = findBestTask(taskRef, tasks);
      return {
        intent: 'UPDATE_TASK_PROGRESS',
        title: taskRef,
        progress,
        matchedTaskId: match?.id,
        raw,
      };
    }
  }

  // 7. UPDATE_HIRING_STATUS
  if (/(?:mudar vaga|status da vaga|atualizar vaga|mover vaga)/.test(norm)) {
    const title = extractBetweenKeywords(
      raw,
      ['mudar vaga ', 'status da vaga ', 'atualizar vaga ', 'mover vaga '],
      [' para '],
    );
    const hiringStatus = extractHiringStatus(raw);
    const match = findBestHiring(title, hiringPositions);
    return {
      intent: 'UPDATE_HIRING_STATUS',
      title,
      hiringStatus,
      matchedHiringId: match?.id,
      raw,
    };
  }

  // 8. UPDATE_TASK_STATUS
  if (/(?:mudar|status|mover|atualizar)/.test(norm) && /(?:tarefa|atividade)/.test(norm)) {
    const title = extractBetweenKeywords(
      raw,
      ['mudar tarefa ', 'mudar status da tarefa ', 'mover tarefa ', 'atualizar tarefa ',
       'mudar atividade ', 'status da tarefa '],
      [' para '],
    );
    const status = extractStatus(raw);
    const match = findBestTask(title, tasks);
    return {
      intent: 'UPDATE_TASK_STATUS',
      title,
      status,
      matchedTaskId: match?.id,
      raw,
    };
  }

  // 9. QUERY
  if (/(?:quantas|quantos|qual|quais|lista|listar|contar)/.test(norm)) {
    let answer = '';
    if (/atrasad/.test(norm)) {
      const overdue = tasks.filter((t) => {
        if (!t.dueDate || t.status === 'concluida' || t.status === 'cancelada') return false;
        return new Date(t.dueDate + 'T23:59:59') < new Date();
      });
      answer = `${overdue.length} tarefa(s) atrasada(s)`;
    } else if (/concluida|finalizada|completa/.test(norm)) {
      const done = tasks.filter((t) => t.status === 'concluida');
      answer = `${done.length} tarefa(s) concluida(s)`;
    } else if (/critica/.test(norm)) {
      const crit = tasks.filter((t) => t.priority === 'critica' && t.status !== 'concluida');
      answer = `${crit.length} tarefa(s) critica(s) pendente(s)`;
    } else if (/andamento/.test(norm)) {
      const prog = tasks.filter((t) => t.status === 'em_andamento');
      answer = `${prog.length} tarefa(s) em andamento`;
    } else if (/total|todas/.test(norm)) {
      answer = `${tasks.length} tarefa(s) no total`;
    } else if (/vaga|contratac/.test(norm)) {
      const open = hiringPositions.filter((h) => h.status === 'aberta' || h.status === 'em_selecao');
      answer = `${open.length} vaga(s) aberta(s)`;
    } else {
      answer = `${tasks.length} tarefas no total, ${tasks.filter((t) => t.status === 'em_andamento').length} em andamento`;
    }
    return { intent: 'QUERY', queryAnswer: answer, raw };
  }

  return { intent: 'UNKNOWN', raw };
}
