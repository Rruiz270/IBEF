'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { departments, milestones } from '@/data/projectData';
import { useProject } from '@/contexts/ProjectContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GlobalSearchProps {
  onTaskSelect?: (taskId: string) => void;
}

type ResultCategory =
  | 'tarefas'
  | 'pessoas'
  | 'marcos'
  | 'departamentos'
  | 'vagas'
  | 'empresas';

interface SearchResult {
  id: string;
  category: ResultCategory;
  title: string;
  subtitle?: string;
  /** Extra metadata shown on the right side */
  meta?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_PER_CATEGORY = 5;

const CATEGORY_LABELS: Record<ResultCategory, string> = {
  tarefas: 'Tarefas',
  pessoas: 'Pessoas',
  marcos: 'Marcos',
  departamentos: 'Departamentos',
  vagas: 'Vagas',
  empresas: 'Empresas',
};

const CATEGORY_ORDER: ResultCategory[] = [
  'tarefas',
  'pessoas',
  'marcos',
  'departamentos',
  'vagas',
  'empresas',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalise string for accent-insensitive matching */
function normalise(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Check if a value matches the query (accent-insensitive) */
function matches(value: string | null | undefined, query: string): boolean {
  if (!value) return false;
  return normalise(value).includes(query);
}

// ---------------------------------------------------------------------------
// Highlighted text component
// ---------------------------------------------------------------------------

function HighlightText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query) return <span>{text}</span>;

  const normText = normalise(text);
  const normQuery = normalise(query);
  const idx = normText.indexOf(normQuery);

  if (idx === -1) return <span>{text}</span>;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);

  return (
    <span>
      {before}
      <span className="bg-blue-500/30 text-white rounded-sm px-0.5">
        {match}
      </span>
      {after}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GlobalSearch({ onTaskSelect }: GlobalSearchProps) {
  const router = useRouter();
  const { tasks, teamPeople, hiringPositions, associateCompanies } =
    useProject();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ---- Keyboard shortcut to open (Cmd+K / Ctrl+K) ----
  useEffect(() => {
    function handleGlobalKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, []);

  // ---- Focus input when modal opens ----
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Small delay so the animation can start before focus
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ---- Build search results ----
  const results = useMemo<SearchResult[]>(() => {
    const q = normalise(query.trim());
    if (!q) return [];

    const out: SearchResult[] = [];

    // Tasks
    const matchedTasks = tasks.filter(
      (t) =>
        matches(t.title, q) ||
        matches(t.description, q) ||
        t.tags.some((tag) => matches(tag, q)),
    );
    matchedTasks.slice(0, MAX_PER_CATEGORY).forEach((t) => {
      const dept = departments.find((d) => d.id === t.departmentId);
      out.push({
        id: t.id,
        category: 'tarefas',
        title: t.title,
        subtitle: t.description
          ? t.description.slice(0, 80) + (t.description.length > 80 ? '...' : '')
          : undefined,
        meta: dept?.name,
      });
    });

    // People
    const matchedPeople = teamPeople.filter(
      (p) =>
        matches(p.name, q) ||
        matches(p.role, q) ||
        matches(p.title, q),
    );
    matchedPeople.slice(0, MAX_PER_CATEGORY).forEach((p) => {
      out.push({
        id: p.id,
        category: 'pessoas',
        title: p.name,
        subtitle: p.title,
        meta: p.role,
      });
    });

    // Milestones
    const matchedMilestones = milestones.filter(
      (m) =>
        matches(m.title, q) ||
        matches(m.description, q),
    );
    matchedMilestones.slice(0, MAX_PER_CATEGORY).forEach((m) => {
      out.push({
        id: m.id,
        category: 'marcos',
        title: m.title,
        subtitle: m.description
          ? m.description.slice(0, 80) + (m.description.length > 80 ? '...' : '')
          : undefined,
        meta: m.targetDate,
      });
    });

    // Departments
    const matchedDepts = departments.filter(
      (d) =>
        matches(d.name, q) ||
        matches(d.description, q),
    );
    matchedDepts.slice(0, MAX_PER_CATEGORY).forEach((d) => {
      out.push({
        id: d.id,
        category: 'departamentos',
        title: d.name,
        subtitle: d.description
          ? d.description.slice(0, 80) + (d.description.length > 80 ? '...' : '')
          : undefined,
      });
    });

    // Hiring positions
    const matchedHiring = hiringPositions.filter(
      (h) =>
        matches(h.title, q) ||
        matches(h.description, q),
    );
    matchedHiring.slice(0, MAX_PER_CATEGORY).forEach((h) => {
      const dept = departments.find((d) => d.id === h.departmentId);
      out.push({
        id: h.id,
        category: 'vagas',
        title: h.title,
        subtitle: h.description
          ? h.description.slice(0, 80) + (h.description.length > 80 ? '...' : '')
          : undefined,
        meta: dept?.name,
      });
    });

    // Companies
    const matchedCompanies = associateCompanies.filter(
      (c) =>
        matches(c.name, q) ||
        matches(c.description, q) ||
        matches(c.type, q),
    );
    matchedCompanies.slice(0, MAX_PER_CATEGORY).forEach((c) => {
      out.push({
        id: c.id,
        category: 'empresas',
        title: c.name,
        subtitle: c.description
          ? c.description.slice(0, 80) + (c.description.length > 80 ? '...' : '')
          : undefined,
        meta: c.type,
      });
    });

    return out;
  }, [query, tasks, teamPeople, hiringPositions, associateCompanies]);

  // ---- Group results by category (preserving CATEGORY_ORDER) ----
  const groupedResults = useMemo(() => {
    const groups: { category: ResultCategory; items: SearchResult[] }[] = [];
    for (const cat of CATEGORY_ORDER) {
      const items = results.filter((r) => r.category === cat);
      if (items.length > 0) {
        groups.push({ category: cat, items });
      }
    }
    return groups;
  }, [results]);

  // ---- Flat list for keyboard navigation ----
  const flatResults = useMemo(
    () => groupedResults.flatMap((g) => g.items),
    [groupedResults],
  );

  // ---- Reset selected index when results change ----
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // ---- Handle result selection ----
  const handleSelect = useCallback(
    (result: SearchResult) => {
      setIsOpen(false);

      switch (result.category) {
        case 'tarefas':
          if (onTaskSelect) {
            onTaskSelect(result.id);
          }
          break;
        case 'pessoas':
          router.push('/organograma');
          break;
        case 'departamentos':
          router.push('/workstreams');
          break;
        case 'vagas':
          router.push('/contratacoes');
          break;
        case 'marcos':
          router.push('/timeline');
          break;
        case 'empresas':
          router.push('/workstreams');
          break;
      }
    },
    [onTaskSelect, router],
  );

  // ---- Keyboard navigation inside the modal ----
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < flatResults.length - 1 ? prev + 1 : 0,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : flatResults.length - 1,
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (flatResults[selectedIndex]) {
            handleSelect(flatResults[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    },
    [flatResults, selectedIndex, handleSelect],
  );

  // ---- Scroll selected item into view ----
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector(
      `[data-result-index="${selectedIndex}"]`,
    );
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // ---- Compute a running index so we can map grouped -> flat index ----
  let runningIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onKeyDown={handleKeyDown}
          >
            <div className="w-full max-w-2xl bg-[#061742] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Search className="w-5 h-5 text-white/40 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar tarefas, pessoas, marcos..."
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-white/40 hover:text-white/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-white/30 bg-white/5 border border-white/10 rounded">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto overscroll-contain"
              >
                {query.trim() && flatResults.length === 0 && (
                  <div className="px-4 py-10 text-center text-white/40 text-sm">
                    Nenhum resultado encontrado
                  </div>
                )}

                {!query.trim() && (
                  <div className="px-4 py-10 text-center text-white/30 text-sm">
                    Digite para buscar tarefas, pessoas, marcos, departamentos...
                  </div>
                )}

                {groupedResults.map((group) => {
                  const groupStartIndex = runningIndex;
                  return (
                    <div key={group.category}>
                      {/* Category header */}
                      <div className="px-4 pt-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                        {CATEGORY_LABELS[group.category]}
                      </div>

                      {/* Items */}
                      {group.items.map((item, i) => {
                        const flatIndex = groupStartIndex + i;
                        const isSelected = flatIndex === selectedIndex;

                        // Advance running index for next group
                        if (i === group.items.length - 1) {
                          runningIndex = flatIndex + 1;
                        }

                        return (
                          <button
                            key={item.id}
                            data-result-index={flatIndex}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(flatIndex)}
                            className={`
                              w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors cursor-pointer
                              ${isSelected ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'}
                            `}
                          >
                            {/* Category dot */}
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  group.category === 'departamentos'
                                    ? departments.find((d) => d.id === item.id)
                                        ?.color ?? '#6366f1'
                                    : group.category === 'tarefas'
                                      ? '#3b82f6'
                                      : group.category === 'pessoas'
                                        ? '#10b981'
                                        : group.category === 'marcos'
                                          ? '#f59e0b'
                                          : group.category === 'vagas'
                                            ? '#8b5cf6'
                                            : '#ec4899',
                              }}
                            />

                            {/* Text content */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white truncate">
                                <HighlightText
                                  text={item.title}
                                  query={query.trim()}
                                />
                              </div>
                              {item.subtitle && (
                                <div className="text-xs text-white/40 truncate mt-0.5">
                                  <HighlightText
                                    text={item.subtitle}
                                    query={query.trim()}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Meta badge */}
                            {item.meta && (
                              <span className="shrink-0 text-[11px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                                {item.meta}
                              </span>
                            )}

                            {/* Enter hint on selected */}
                            {isSelected && (
                              <kbd className="hidden sm:inline-flex shrink-0 items-center px-1.5 py-0.5 text-[10px] font-medium text-white/30 bg-white/5 border border-white/10 rounded">
                                Enter
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Footer with keyboard hints */}
              <div className="px-4 py-2 border-t border-white/10 flex items-center gap-4 text-[11px] text-white/25">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">
                    Esc
                  </kbd>
                  <span>para fechar</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">
                    Enter
                  </kbd>
                  <span>para selecionar</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">
                    &uarr;
                  </kbd>
                  <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">
                    &darr;
                  </kbd>
                  <span>para navegar</span>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
