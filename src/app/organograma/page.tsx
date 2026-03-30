'use client';

import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

// =============================================================================
// Organograma - Estrutura ICT (Instituto i10)
// Based on whiteboard organizational chart
// =============================================================================

// ---------------------------------------------------------------------------
// OrgNode: reusable box component
// ---------------------------------------------------------------------------
type NodeVariant = 'assembly' | 'executive' | 'council' | 'advisory' | 'legal' | 'dept' | 'sub';

const variantStyles: Record<NodeVariant, string> = {
  assembly:
    'bg-gradient-to-br from-[#1a5276] to-[#2471a3] border-[#1a5276] text-white',
  executive:
    'bg-gradient-to-br from-[#c0392b] to-[#e74c3c] border-[#c0392b] text-white',
  council:
    'bg-gradient-to-br from-[#d4ac0d] to-[#f1c40f] border-[#d4ac0d] text-[#333]',
  advisory:
    'bg-gradient-to-br from-[#8e44ad] to-[#a569bd] border-[#8e44ad] text-white',
  legal:
    'bg-gradient-to-br from-[#117a65] to-[#1abc9c] border-[#117a65] text-white',
  dept: 'bg-[#0d1f3c] border-[#2e86c1] text-white',
  sub: 'bg-[#0a1628] border-[#4a5568] text-white/80',
};

function OrgNode({
  title,
  name,
  subtitle,
  variant = 'dept',
  wide,
  questionMark,
  asterisk,
  className = '',
}: {
  title: string;
  name?: string;
  subtitle?: string;
  variant?: NodeVariant;
  wide?: boolean;
  questionMark?: boolean;
  asterisk?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`
        relative border-2 rounded-xl px-4 py-3 text-center shadow-lg
        transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5
        ${wide ? 'min-w-[200px]' : 'min-w-[150px]'}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <div className="text-xs font-bold uppercase tracking-wide border-b border-white/20 pb-1.5 mb-1.5 flex items-center justify-center gap-1">
        {asterisk && <span className="text-yellow-300 text-sm">*</span>}
        {title}
        {questionMark && (
          <span className="inline-block w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold leading-4 text-center">
            ?
          </span>
        )}
      </div>
      {name && (
        <div
          className={`text-[11px] font-semibold ${
            variant === 'council' ? 'text-[#6e5b00]' : 'opacity-90'
          }`}
        >
          {name}
        </div>
      )}
      {subtitle && (
        <div className="text-[10px] opacity-60 mt-0.5">{subtitle}</div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Connector lines
// ---------------------------------------------------------------------------
function VLine({ height = 24 }: { height?: number }) {
  return (
    <div className="flex justify-center">
      <div
        className="w-0.5 bg-gradient-to-b from-white/30 to-white/10"
        style={{ height }}
      />
    </div>
  );
}

function HLine({ width = 60 }: { width?: number }) {
  return (
    <div
      className="h-0.5 bg-gradient-to-r from-white/30 to-white/10 self-center"
      style={{ width }}
    />
  );
}

// ---------------------------------------------------------------------------
// Info badge components
// ---------------------------------------------------------------------------
function MesaBadge() {
  return (
    <div className="bg-[#0d1f3c] border border-amber-500/30 rounded-lg px-4 py-3 text-left max-w-[200px]">
      <div className="text-[11px] font-bold text-amber-400 mb-1.5">
        Mesa da Assembleia
      </div>
      <div className="text-[11px] text-white/80 leading-relaxed space-y-0.5">
        <div>
          Pres.: <span className="text-amber-300 font-semibold">Enio</span>{' '}
          <span className="text-yellow-300 text-xs">*</span>
        </div>
        <div>
          Vice: <span className="text-amber-300 font-semibold">B.Q.</span>{' '}
          <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold leading-[14px] text-center">
            ?
          </span>
        </div>
        <div>
          Sec.: <span className="text-amber-300 font-semibold">Gustavo</span>
        </div>
      </div>
    </div>
  );
}

function AssociadosBadge() {
  return (
    <div className="bg-[#0d1f3c] border border-blue-500/30 rounded-lg px-4 py-3 text-left max-w-[220px]">
      <div className="text-[11px] font-bold text-blue-400 mb-1.5">
        Associados
      </div>
      <div className="text-[11px] text-white/70 leading-relaxed">
        Fundadores / Contribuintes / Beneméritos / Honorários
      </div>
      <div className="text-[10px] text-white/40 mt-1">
        BQ, Mércia, Gustavo, B.Almeida, Emerson, Ênio
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function OrganogramaPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/15 flex items-center justify-center">
            <Network size={20} className="text-[#00B4D8]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Organograma
            </h1>
            <p className="text-sm text-white/50">
              Estrutura Organizacional ICT — Instituto i10
            </p>
          </div>
        </div>
      </motion.div>

      {/* Org Chart Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="overflow-x-auto"
      >
        <div className="min-w-[900px] py-8 flex flex-col items-center gap-0">
          {/* ============================================================ */}
          {/* LEVEL 1: ASSEMBLEIA GERAL */}
          {/* ============================================================ */}
          <div className="flex flex-col items-center">
            <OrgNode
              title="Assembleia Geral"
              subtitle="Órgão Máximo de Deliberação"
              variant="assembly"
              wide
            />

            {/* Mesa + Associados badges */}
            <div className="flex items-start gap-6 mt-3">
              <MesaBadge />
              <AssociadosBadge />
            </div>
          </div>

          <VLine height={30} />

          {/* ============================================================ */}
          {/* LEVEL 2: CONSELHO FISCAL -- trunk -- CONSELHO NOTÁVEIS */}
          {/* ============================================================ */}
          <div className="flex items-center justify-center gap-0">
            {/* Conselho Fiscal (left) */}
            <OrgNode
              title="Conselho Fiscal"
              name="Emerson / Gustavo"
              variant="council"
            />
            <HLine width={50} />

            {/* Center vertical pass-through dot */}
            <div className="w-2 h-2 rounded-full bg-white/30" />

            <HLine width={50} />
            {/* Conselho de Notáveis (right) */}
            <OrgNode
              title="Conselho de Notáveis"
              name="A definir"
              subtitle="Fundadores / Contribuintes / Beneméritos / Honorários"
              variant="advisory"
              questionMark
            />
          </div>

          <VLine height={30} />

          {/* ============================================================ */}
          {/* LEVEL 3: DIRETORIA EXECUTIVA + JURÍDICO */}
          {/* ============================================================ */}
          <div className="flex items-center justify-center gap-0">
            <OrgNode
              title="Dir. Executiva"
              name="Ênio (Raphael)"
              subtitle="* Regimento Interno"
              variant="executive"
              wide
              asterisk
            />
            <HLine width={60} />
            <OrgNode
              title="Jurídico"
              name="Mércia"
              variant="legal"
            />
          </div>

          <VLine height={30} />

          {/* Horizontal branch line spanning 3 departments */}
          <div className="w-[520px] h-0.5 bg-gradient-to-r from-white/10 via-white/25 to-white/10" />

          {/* ============================================================ */}
          {/* LEVEL 4: 3 DEPARTMENTS (TEC / OPER / PED) */}
          {/* ============================================================ */}
          <div className="flex justify-center gap-6 w-[560px]">
            {/* ----- TECNOLOGIA ----- */}
            <div className="flex-1 flex flex-col items-center">
              <VLine height={20} />
              <OrgNode
                title="Tecnologia"
                name="B. Almeida"
                variant="dept"
              />
              <VLine height={16} />
              <OrgNode
                title="SC"
                name="1 ou 2"
                variant="sub"
              />
              <VLine height={12} />
              <OrgNode
                title="SP"
                name="2"
                variant="sub"
              />
            </div>

            {/* ----- OPERAÇÕES ----- */}
            <div className="flex-1 flex flex-col items-center">
              <VLine height={20} />
              <OrgNode
                title="Operações"
                name="Gustavo"
                variant="dept"
              />
              <VLine height={16} />
              <OrgNode
                title="SC"
                name="Campo / Logística"
                subtitle="Agente Local"
                variant="sub"
              />
              <VLine height={12} />
              <OrgNode
                title="SP"
                name="1"
                variant="sub"
              />
              <VLine height={12} />
              <div className="border-2 border-emerald-500/50 rounded-xl px-4 py-3 text-center bg-[#0a1628] min-w-[150px] shadow-lg">
                <div className="text-xs font-bold uppercase tracking-wide text-emerald-400 border-b border-emerald-500/20 pb-1.5 mb-1.5">
                  Agente Local
                </div>
                <div className="text-[11px] text-emerald-300/80 font-semibold">
                  Terceirizado
                </div>
              </div>
            </div>

            {/* ----- PEDAGÓGICO ----- */}
            <div className="flex-1 flex flex-col items-center">
              <VLine height={20} />
              <OrgNode
                title="Pedagógico"
                name="A definir"
                variant="dept"
                questionMark
              />
              <VLine height={16} />
              <OrgNode
                title="SC"
                name="1"
                variant="sub"
              />
              <VLine height={12} />
              <OrgNode
                title="SP"
                name="1"
                variant="sub"
              />
            </div>
          </div>

          {/* ============================================================ */}
          {/* NOTES / OBSERVAÇÕES */}
          {/* ============================================================ */}
          <div className="mt-10 w-full max-w-[600px]">
            <div className="bg-[#0d1f3c] border border-red-500/30 rounded-xl p-5 border-l-4 border-l-red-500">
              <h3 className="text-sm font-bold text-red-400 mb-3">
                Observações
              </h3>
              <ul className="text-xs text-white/60 space-y-2 leading-relaxed">
                <li>
                  <span className="text-yellow-300 font-bold">*</span>{' '}
                  Regimento Interno para evitar conflito de interesses.
                </li>
                <li>
                  <strong className="text-white/80">Membros fundadores:</strong>{' '}
                  BQ, Mércia, Gustavo, B.Almeida, Emerson, Ênio.
                </li>
                <li>
                  <strong className="text-white/80">SC</strong> = Santa Catarina
                  &nbsp;|&nbsp;
                  <strong className="text-white/80">SP</strong> = São Paulo
                </li>
                <li>
                  <strong className="text-white/80">
                    Tipos de Associados:
                  </strong>{' '}
                  Fundadores, Contribuintes, Beneméritos, Honorários.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
