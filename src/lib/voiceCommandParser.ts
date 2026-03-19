// Voice Command Parser for PT-BR
// Extracts intent + ALL fields (title, department, priority, status, date, notes)
// from natural Portuguese speech.

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
  description?: string;
  parentTitle?: string;
  departmentId?: DepartmentId;
  status?: TaskStatus;
  hiringStatus?: HiringStatus;
  priority?: TaskPriority;
  progress?: number;
  dueDate?: string;          // ISO YYYY-MM-DD
  notes?: string;
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
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Date extraction (PT-BR)
// ---------------------------------------------------------------------------

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const WEEKDAY_MAP: Record<string, number> = {
  domingo: 0, segunda: 1, terca: 2, quarta: 3, quinta: 4, sexta: 5, sabado: 6,
  'segunda feira': 1, 'terca feira': 2, 'quarta feira': 3, 'quinta feira': 4, 'sexta feira': 5,
};

function extractDate(text: string): { date: string | undefined; matchedPhrases: string[] } {
  const norm = normalize(text);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const matched: string[] = [];

  // "hoje"
  if (/\bhoje\b/.test(norm)) {
    matched.push('hoje');
    return { date: toISODate(today), matchedPhrases: matched };
  }

  // "amanhã" / "amanha"
  if (/\bamanha\b/.test(norm)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    matched.push('amanha');
    // also match "para amanha", "ate amanha"
    if (/para amanha/.test(norm)) matched.push('para amanha');
    if (/ate amanha/.test(norm)) matched.push('ate amanha');
    return { date: toISODate(d), matchedPhrases: matched };
  }

  // "depois de amanhã"
  if (/depois de amanha/.test(norm)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 2);
    matched.push('depois de amanha');
    return { date: toISODate(d), matchedPhrases: matched };
  }

  // "próxima segunda", "na sexta", etc.
  for (const [name, dayNum] of Object.entries(WEEKDAY_MAP)) {
    const patterns = [
      new RegExp(`proxim[ao]\\s+${name}`),
      new RegExp(`na\\s+${name}`),
      new RegExp(`no\\s+${name}`),
      new RegExp(`ate\\s+${name}`),
      new RegExp(`para\\s+${name}`),
      new RegExp(`\\b${name}\\b`),
    ];
    for (const pat of patterns) {
      const m = norm.match(pat);
      if (m) {
        const d = new Date(today);
        let diff = dayNum - d.getDay();
        if (diff <= 0) diff += 7;
        d.setDate(d.getDate() + diff);
        matched.push(m[0]);
        return { date: toISODate(d), matchedPhrases: matched };
      }
    }
  }

  // "em X dias" / "daqui X dias"
  const daysMatch = norm.match(/(?:em|daqui|daqui a)\s+(\d{1,3})\s+dias?/);
  if (daysMatch) {
    const d = new Date(today);
    d.setDate(d.getDate() + parseInt(daysMatch[1], 10));
    matched.push(daysMatch[0]);
    return { date: toISODate(d), matchedPhrases: matched };
  }

  // "próxima semana" / "semana que vem"
  if (/proxima semana|semana que vem/.test(norm)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 7);
    const m = norm.match(/proxima semana|semana que vem/);
    if (m) matched.push(m[0]);
    return { date: toISODate(d), matchedPhrases: matched };
  }

  // "dia DD" / "dia DD de MES"
  const dayOfMonth = norm.match(/dia\s+(\d{1,2})(?:\s+de\s+(\w+))?/);
  if (dayOfMonth) {
    const day = parseInt(dayOfMonth[1], 10);
    let month = today.getMonth();
    let year = today.getFullYear();
    if (dayOfMonth[2]) {
      const monthNames: Record<string, number> = {
        janeiro: 0, fevereiro: 1, marco: 2, abril: 3, maio: 4, junho: 5,
        julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
      };
      if (monthNames[dayOfMonth[2]] !== undefined) {
        month = monthNames[dayOfMonth[2]];
      }
    }
    const d = new Date(year, month, day);
    if (d < today) {
      d.setMonth(d.getMonth() + 1);
    }
    matched.push(dayOfMonth[0]);
    return { date: toISODate(d), matchedPhrases: matched };
  }

  return { date: undefined, matchedPhrases: [] };
}

// ---------------------------------------------------------------------------
// Department mapping
// ---------------------------------------------------------------------------

const DEPARTMENT_KEYWORDS: [string, DepartmentId][] = [
  ['relacoes publicas', 'relacoes_publicas'],
  ['operacoes locais', 'operacoes_locais'],
  ['santa catarina', 'santa_catarina'],
  ['admin financeiro', 'administrativo_financeiro'],
  ['administrativo financeiro', 'administrativo_financeiro'],
  ['administrativo', 'administrativo_financeiro'],
  ['financeiro', 'administrativo_financeiro'],
  ['comunicacao', 'relacoes_publicas'],
  ['tecnologia', 'tecnologia'],
  ['pedagogico', 'pedagogico'],
  ['operacoes', 'operacoes_locais'],
  ['juridico', 'juridico'],
  ['educacao', 'pedagogico'],
  ['legal', 'juridico'],
  ['tech', 'tecnologia'],
  ['adm', 'administrativo_financeiro'],
  ['sed', 'santa_catarina'],
  ['rp', 'relacoes_publicas'],
  ['ti', 'tecnologia'],
  ['sc', 'santa_catarina'],
];

function extractDepartment(text: string): { dept: DepartmentId | undefined; matchedPhrase: string } {
  const norm = normalize(text);
  for (const [keyword, dept] of DEPARTMENT_KEYWORDS) {
    // Match with word boundaries or preposition context
    const patterns = [
      new RegExp(`(?:no|na|do|da|em|de|para|pro|pra)\\s+${keyword}\\b`),
      new RegExp(`\\b${keyword}\\b`),
    ];
    for (const pat of patterns) {
      const m = norm.match(pat);
      if (m) return { dept, matchedPhrase: m[0] };
    }
  }
  return { dept: undefined, matchedPhrase: '' };
}

// ---------------------------------------------------------------------------
// Status mapping
// ---------------------------------------------------------------------------

const STATUS_KEYWORDS: [string, TaskStatus][] = [
  ['nao iniciada', 'nao_iniciada'],
  ['nao comecou', 'nao_iniciada'],
  ['em andamento', 'em_andamento'],
  ['nao sera feita', 'cancelada'],
  ['nao vai ser feita', 'cancelada'],
  ['finalizada', 'concluida'],
  ['terminada', 'concluida'],
  ['concluida', 'concluida'],
  ['bloqueada', 'bloqueada'],
  ['cancelada', 'cancelada'],
  ['completa', 'concluida'],
  ['atrasada', 'atrasada'],
  ['pendente', 'nao_iniciada'],
  ['iniciada', 'em_andamento'],
  ['andamento', 'em_andamento'],
  ['travada', 'bloqueada'],
  ['pronta', 'concluida'],
  ['feita', 'concluida'],
];

function extractStatus(text: string): { status: TaskStatus | undefined; matchedPhrase: string } {
  const norm = normalize(text);
  for (const [keyword, status] of STATUS_KEYWORDS) {
    if (norm.includes(keyword)) return { status, matchedPhrase: keyword };
  }
  return { status: undefined, matchedPhrase: '' };
}

// ---------------------------------------------------------------------------
// Hiring status mapping
// ---------------------------------------------------------------------------

const HIRING_STATUS_KEYWORDS: [string, HiringStatus][] = [
  ['oferta enviada', 'oferta_enviada'],
  ['em selecao', 'em_selecao'],
  ['contratado', 'contratado'],
  ['contratada', 'contratado'],
  ['preenchida', 'contratado'],
  ['entrevista', 'em_selecao'],
  ['cancelada', 'cancelada'],
  ['selecao', 'em_selecao'],
  ['aberta', 'aberta'],
  ['oferta', 'oferta_enviada'],
];

function extractHiringStatus(text: string): HiringStatus | undefined {
  const norm = normalize(text);
  for (const [keyword, status] of HIRING_STATUS_KEYWORDS) {
    if (norm.includes(keyword)) return status;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Priority mapping
// ---------------------------------------------------------------------------

const PRIORITY_KEYWORDS: [string, TaskPriority][] = [
  ['prioridade critica', 'critica'],
  ['prioridade alta', 'alta'],
  ['prioridade media', 'media'],
  ['prioridade baixa', 'baixa'],
  ['muito urgente', 'critica'],
  ['super urgente', 'critica'],
  ['importante', 'alta'],
  ['urgente', 'critica'],
  ['critica', 'critica'],
  ['alta', 'alta'],
  ['media', 'media'],
  ['normal', 'media'],
  ['baixa', 'baixa'],
  ['pouca', 'baixa'],
];

function extractPriority(text: string): { priority: TaskPriority | undefined; matchedPhrase: string } {
  const norm = normalize(text);
  for (const [keyword, priority] of PRIORITY_KEYWORDS) {
    // For short words, require "prioridade X" or "com X prioridade" context or be standalone
    if (keyword.length <= 4) {
      const contextual = new RegExp(`(?:prioridade\\s+${keyword}|${keyword}\\s+prioridade|com\\s+${keyword})`);
      if (contextual.test(norm)) return { priority, matchedPhrase: keyword };
    } else {
      if (norm.includes(keyword)) return { priority, matchedPhrase: keyword };
    }
  }
  return { priority: undefined, matchedPhrase: '' };
}

// ---------------------------------------------------------------------------
// Progress extraction
// ---------------------------------------------------------------------------

function extractProgress(text: string): number | undefined {
  const norm = normalize(text);
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

const ROUTE_KEYWORDS: [string, string][] = [
  ['recursos humanos', '/contratacoes'],
  ['santa catarina', '/santa-catarina'],
  ['departamentos', '/workstreams'],
  ['contratacoes', '/contratacoes'],
  ['atividades', '/workstreams'],
  ['workstreams', '/workstreams'],
  ['organograma', '/organograma'],
  ['cronograma', '/timeline'],
  ['associados', '/associados'],
  ['parceiros', '/associados'],
  ['dashboard', '/dashboard'],
  ['timeline', '/timeline'],
  ['empresas', '/associados'],
  ['juridico', '/juridico'],
  ['kanban', '/workstreams'],
  ['equipe', '/organograma'],
  ['painel', '/dashboard'],
  ['inicio', '/dashboard'],
  ['vagas', '/contratacoes'],
  ['fases', '/timeline'],
  ['legal', '/juridico'],
  ['time', '/organograma'],
  ['sed', '/santa-catarina'],
  ['rh', '/contratacoes'],
];

function extractRoute(text: string): string | undefined {
  const norm = normalize(text);
  for (const [keyword, route] of ROUTE_KEYWORDS) {
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
  if (!q || !t) return 0;
  if (t.includes(q)) return q.length / t.length + 0.5;
  if (q.includes(t)) return t.length / q.length + 0.3;
  const qWords = q.split(' ').filter(Boolean);
  const tWords = t.split(' ').filter(Boolean);
  let matched = 0;
  for (const qw of qWords) {
    if (qw.length < 3) continue; // skip short words like "de", "no"
    if (tWords.some((tw) => tw.includes(qw) || qw.includes(tw))) matched++;
  }
  const meaningfulWords = qWords.filter((w) => w.length >= 3).length;
  return meaningfulWords > 0 ? matched / meaningfulWords : 0;
}

function findBestTask(query: string, tasks: Task[]): Task | undefined {
  let best: Task | undefined;
  let bestScore = 0.3;
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
// Smart title extraction — strips all metadata from the raw text
// ---------------------------------------------------------------------------

// All "noise" phrases that carry metadata, not title content
function buildCleanupPatterns(
  deptPhrase: string,
  dateMatchedPhrases: string[],
  priorityPhrase: string,
  statusPhrase: string,
): RegExp[] {
  const patterns: RegExp[] = [];

  // Trigger keywords
  const triggers = [
    'criar tarefa', 'nova tarefa', 'adicionar tarefa', 'crie tarefa', 'cria tarefa',
    'criar atividade', 'nova atividade', 'adicionar atividade',
    'abrir vaga de', 'abrir vaga', 'nova vaga de', 'nova vaga', 'criar vaga de', 'criar vaga',
    'nova contratacao', 'contratar',
    'adicionar subtarefa', 'nova subtarefa', 'criar subtarefa',
    'excluir tarefa', 'deletar tarefa', 'remover tarefa', 'apagar tarefa',
  ];
  for (const t of triggers) {
    patterns.push(new RegExp(t.replace(/\s+/g, '\\s+'), 'g'));
  }

  // Department (with prepositions)
  if (deptPhrase) {
    patterns.push(new RegExp(`(?:no|na|do|da|em|de|para|pro|pra)\\s+${deptPhrase}`, 'g'));
    patterns.push(new RegExp(`\\b${deptPhrase}\\b`, 'g'));
  }

  // Date phrases
  for (const dp of dateMatchedPhrases) {
    if (dp) {
      patterns.push(new RegExp(`(?:para|ate|com deadline|deadline|prazo)\\s+${dp.replace(/\s+/g, '\\s+')}`, 'g'));
      patterns.push(new RegExp(dp.replace(/\s+/g, '\\s+'), 'g'));
    }
  }

  // Priority phrases
  if (priorityPhrase) {
    patterns.push(new RegExp(`com\\s+prioridade\\s+${priorityPhrase}`, 'g'));
    patterns.push(new RegExp(`prioridade\\s+${priorityPhrase}`, 'g'));
    patterns.push(new RegExp(`\\b${priorityPhrase}\\b`, 'g'));
  }

  // Status phrases (with prepositions)
  if (statusPhrase) {
    patterns.push(new RegExp(`para\\s+${statusPhrase}`, 'g'));
    patterns.push(new RegExp(`\\b${statusPhrase}\\b`, 'g'));
  }

  // Common connectors/prepositions left dangling
  patterns.push(/\b(?:com|no|na|do|da|de|em|para|pro|pra|ate|as|aos|ao)\s*$/g);

  // Time phrases: "às 5pm", "as 17h", "5 da tarde", "5 da manha"
  patterns.push(/(?:as|ate as|deadline as|ate)\s+\d{1,2}\s*(?:pm|am|h|horas?|da\s+(?:tarde|manha|noite))/g);
  patterns.push(/\b\d{1,2}\s*(?:pm|am)\b/g);

  return patterns;
}

function cleanTitle(
  raw: string,
  deptPhrase: string,
  dateMatchedPhrases: string[],
  priorityPhrase: string,
  statusPhrase: string,
  triggerKeywords: string[],
): string {
  let norm = normalize(raw);

  // Find where the trigger ends — title starts after it
  for (const kw of triggerKeywords) {
    const idx = norm.indexOf(kw);
    if (idx >= 0) {
      norm = norm.slice(idx + kw.length).trim();
      break;
    }
  }

  // Remove metadata phrases
  const patterns = buildCleanupPatterns(deptPhrase, dateMatchedPhrases, priorityPhrase, statusPhrase);
  for (const pat of patterns) {
    norm = norm.replace(pat, ' ');
  }

  // Clean up whitespace and dangling prepositions
  norm = norm.replace(/\s+/g, ' ').trim();
  norm = norm.replace(/^(?:de|do|da|no|na|em|com|para|pro|pra|e|o|a)\s+/i, '');
  norm = norm.replace(/\s+(?:de|do|da|no|na|em|com|para|pro|pra)$/i, '');
  norm = norm.trim();

  // Capitalize first letter
  if (norm.length > 0) {
    norm = norm.charAt(0).toUpperCase() + norm.slice(1);
  }

  return norm;
}

// ---------------------------------------------------------------------------
// Extract text between two keyword groups
// ---------------------------------------------------------------------------

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
// Guardrails
// ---------------------------------------------------------------------------

const STOP_WORDS = new Set([
  'de', 'do', 'da', 'no', 'na', 'em', 'com', 'para', 'pro', 'pra',
  'o', 'a', 'os', 'as', 'um', 'uma', 'e', 'ou', 'que', 'se',
  'por', 'ao', 'aos', 'ate', 'mas', 'nem',
]);

function isMeaningfulTitle(title: string): boolean {
  if (!title || title.length < 3) return false;
  const words = normalize(title).split(' ').filter(Boolean);
  const meaningful = words.filter((w) => !STOP_WORDS.has(w) && w.length >= 2);
  return meaningful.length >= 1;
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

  // Extract metadata from the full text
  const { dept: deptId, matchedPhrase: deptPhrase } = extractDepartment(raw);
  const { date: dueDate, matchedPhrases: dateMatchedPhrases } = extractDate(raw);
  const { priority, matchedPhrase: priorityPhrase } = extractPriority(raw);
  const { status, matchedPhrase: statusPhrase } = extractStatus(raw);

  // -----------------------------------------------------------------------
  // 1. NAVIGATE — must come first, has unique trigger words
  // -----------------------------------------------------------------------
  if (/(?:mostrar|ir para|abrir|navegar|vai para|mostra)\b/.test(norm)) {
    const route = extractRoute(raw);
    if (route) {
      return { intent: 'NAVIGATE', route, raw };
    }
  }

  // -----------------------------------------------------------------------
  // 2. CREATE_TASK
  // -----------------------------------------------------------------------
  const createTaskTriggers = [
    'criar tarefa ', 'nova tarefa ', 'adicionar tarefa ', 'crie tarefa ', 'cria tarefa ',
    'criar atividade ', 'nova atividade ', 'adicionar atividade ',
  ];
  if (/(?:criar tarefa|nova tarefa|adicionar tarefa|crie tarefa|cria tarefa|criar atividade|nova atividade|adicionar atividade)/.test(norm)) {
    const title = cleanTitle(raw, deptPhrase, dateMatchedPhrases, priorityPhrase, statusPhrase, createTaskTriggers);

    if (!isMeaningfulTitle(title)) {
      return { intent: 'UNKNOWN', raw, notes: 'Titulo nao reconhecido. Diga por exemplo: "Criar tarefa revisao do contrato no juridico"' };
    }

    return {
      intent: 'CREATE_TASK',
      title,
      departmentId: deptId,
      priority: priority ?? 'media',
      status: status ?? 'nao_iniciada',
      dueDate,
      description: `Criada por comando de voz: "${raw}"`,
      raw,
    };
  }

  // -----------------------------------------------------------------------
  // 3. CREATE_HIRING
  // -----------------------------------------------------------------------
  const createHiringTriggers = [
    'abrir vaga de ', 'abrir vaga ', 'nova vaga de ', 'nova vaga ',
    'criar vaga de ', 'criar vaga ', 'nova contratacao ', 'contratar ',
  ];
  if (/(?:abrir vaga|nova vaga|criar vaga|contratar|nova contratacao)/.test(norm)) {
    const title = cleanTitle(raw, deptPhrase, dateMatchedPhrases, priorityPhrase, '', createHiringTriggers);

    return {
      intent: 'CREATE_HIRING',
      title: isMeaningfulTitle(title) ? title : 'Nova Vaga',
      departmentId: deptId,
      priority: priority ?? 'media',
      dueDate,
      raw,
    };
  }

  // -----------------------------------------------------------------------
  // 4. ADD_SUBTASK
  // -----------------------------------------------------------------------
  if (/(?:adicionar subtarefa|nova subtarefa|criar subtarefa)/.test(norm)) {
    const subtaskTitle = extractBetweenKeywords(
      raw,
      ['adicionar subtarefa ', 'nova subtarefa ', 'criar subtarefa '],
      [' na tarefa ', ' em tarefa ', ' da tarefa '],
    );
    // Extract parent task name after "na tarefa" etc.
    let parentTitle = '';
    const parentMatch = norm.match(/(?:na tarefa|em tarefa|da tarefa)\s+(.+)/);
    if (parentMatch) parentTitle = parentMatch[1].trim();
    const parent = findBestTask(parentTitle, tasks);

    return {
      intent: 'ADD_SUBTASK',
      title: subtaskTitle || 'Nova subtarefa',
      parentTitle,
      matchedTaskId: parent?.id,
      raw,
    };
  }

  // -----------------------------------------------------------------------
  // 5. DELETE_TASK
  // -----------------------------------------------------------------------
  if (/(?:excluir tarefa|deletar tarefa|remover tarefa|apagar tarefa|excluir atividade|deletar atividade|remover atividade|apagar atividade)/.test(norm)) {
    const deleteTriggers = [
      'excluir tarefa ', 'deletar tarefa ', 'remover tarefa ', 'apagar tarefa ',
      'excluir atividade ', 'deletar atividade ', 'remover atividade ', 'apagar atividade ',
    ];
    const title = cleanTitle(raw, '', [], '', '', deleteTriggers);
    const match = findBestTask(title, tasks);

    return {
      intent: 'DELETE_TASK',
      title,
      matchedTaskId: match?.id,
      raw,
    };
  }

  // -----------------------------------------------------------------------
  // 6. UPDATE_TASK_PROGRESS
  // -----------------------------------------------------------------------
  if (/(?:progresso|porcentagem|porcento|por cento)/.test(norm)) {
    const progress = extractProgress(raw);
    if (progress !== undefined) {
      let taskRef = '';
      const tarMatch = norm.match(/(?:tarefa|atividade)\s+(.*?)(?:\d{1,3}\s*(?:porcento|por\s*cento|%))/);
      if (tarMatch) taskRef = tarMatch[1].trim();
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

  // -----------------------------------------------------------------------
  // 7. UPDATE_HIRING_STATUS
  // -----------------------------------------------------------------------
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

  // -----------------------------------------------------------------------
  // 8. UPDATE_TASK_STATUS — also handles "tarefa X não será feita" etc.
  // -----------------------------------------------------------------------
  if (
    (/(?:mudar|status|mover|atualizar)/.test(norm) && /(?:tarefa|atividade)/.test(norm)) ||
    (/(?:tarefa|atividade)/.test(norm) && /(?:nao sera feita|nao vai ser feita|cancelar|bloquear)/.test(norm))
  ) {
    const title = extractBetweenKeywords(
      raw,
      [
        'mudar tarefa ', 'mudar status da tarefa ', 'mover tarefa ', 'atualizar tarefa ',
        'mudar atividade ', 'status da tarefa ', 'status da atividade ',
        'cancelar tarefa ', 'bloquear tarefa ',
        'tarefa ',
      ],
      [' para ', ' nao sera', ' nao vai ser', ' cancelar', ' bloquear'],
    );

    // Detect status from context
    let detectedStatus = status;
    if (!detectedStatus) {
      if (/nao sera feita|nao vai ser feita|cancelar/.test(norm)) detectedStatus = 'cancelada';
      if (/bloquear/.test(norm)) detectedStatus = 'bloqueada';
    }

    const match = findBestTask(title, tasks);

    // Also support updating other fields: priority, dueDate
    return {
      intent: 'UPDATE_TASK_STATUS',
      title,
      status: detectedStatus,
      priority,
      dueDate,
      matchedTaskId: match?.id,
      raw,
    };
  }

  // -----------------------------------------------------------------------
  // 9. QUERY
  // -----------------------------------------------------------------------
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

  // -----------------------------------------------------------------------
  // Fallback: UNKNOWN
  // -----------------------------------------------------------------------
  return {
    intent: 'UNKNOWN',
    raw,
    notes: 'Comando nao reconhecido. Exemplos: "Criar tarefa X no juridico", "Mudar tarefa Y para concluida", "Mostrar dashboard"',
  };
}
