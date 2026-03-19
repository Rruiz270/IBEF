'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, Check, X, Calendar, Flag, FolderOpen } from 'lucide-react';
import { useVoiceCommands, type VoiceState } from '@/hooks/useVoiceCommands';
import type { ParsedCommand } from '@/lib/voiceCommandParser';

const STATE_LABELS: Record<VoiceState, string> = {
  idle: '',
  listening: 'Ouvindo...',
  processing: 'Processando...',
  success: 'Concluido',
  error: 'Erro',
};

const INTENT_LABELS: Record<string, string> = {
  CREATE_TASK: 'Criar Tarefa',
  UPDATE_TASK_STATUS: 'Atualizar Status',
  UPDATE_TASK_PROGRESS: 'Atualizar Progresso',
  DELETE_TASK: 'Excluir Tarefa',
  CREATE_HIRING: 'Criar Vaga',
  UPDATE_HIRING_STATUS: 'Atualizar Vaga',
  ADD_SUBTASK: 'Adicionar Subtarefa',
  NAVIGATE: 'Navegar',
  QUERY: 'Consulta',
  UNKNOWN: 'Nao Reconhecido',
};

function FabIcon({ state }: { state: VoiceState }) {
  switch (state) {
    case 'processing':
      return <Loader2 size={22} className="animate-spin" />;
    case 'success':
      return <Check size={22} />;
    case 'error':
      return <X size={22} />;
    default:
      return <Mic size={22} />;
  }
}

function fabBgClass(state: VoiceState): string {
  switch (state) {
    case 'listening':
      return 'bg-[#00B4D8]/90 shadow-[0_0_20px_rgba(0,180,216,0.4)]';
    case 'success':
      return 'bg-emerald-500/90';
    case 'error':
      return 'bg-red-500/90';
    default:
      return 'bg-[#0A2463]/80 hover:bg-[#0A2463]';
  }
}

// Show parsed field chips for CREATE_TASK
function FieldChips({ cmd }: { cmd: ParsedCommand }) {
  if (cmd.intent !== 'CREATE_TASK' && cmd.intent !== 'UPDATE_TASK_STATUS') return null;

  const chips: { icon: React.ReactNode; label: string; color: string }[] = [];

  if (cmd.departmentId) {
    chips.push({
      icon: <FolderOpen size={9} />,
      label: cmd.departmentId.replace('_', ' '),
      color: 'bg-indigo-500/20 text-indigo-300',
    });
  }
  if (cmd.priority) {
    const colors: Record<string, string> = {
      critica: 'bg-red-500/20 text-red-300',
      alta: 'bg-amber-500/20 text-amber-300',
      media: 'bg-blue-500/20 text-blue-300',
      baixa: 'bg-gray-500/20 text-gray-300',
    };
    chips.push({
      icon: <Flag size={9} />,
      label: cmd.priority,
      color: colors[cmd.priority] || 'bg-blue-500/20 text-blue-300',
    });
  }
  if (cmd.dueDate) {
    chips.push({
      icon: <Calendar size={9} />,
      label: cmd.dueDate,
      color: 'bg-cyan-500/20 text-cyan-300',
    });
  }
  if (cmd.status && cmd.intent === 'CREATE_TASK' && cmd.status !== 'nao_iniciada') {
    chips.push({
      icon: null,
      label: cmd.status.replace('_', ' '),
      color: 'bg-white/[0.08] text-white/60',
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${chip.color}`}
        >
          {chip.icon}
          {chip.label}
        </span>
      ))}
    </div>
  );
}

export default function VoiceCommandSystem() {
  const {
    state,
    transcript,
    interimTranscript,
    parsedCommand,
    resultMessage,
    isSupported,
    startListening,
    stopListening,
  } = useVoiceCommands();

  const [overlayVisible, setOverlayVisible] = useState(false);

  if (!isSupported) return null;

  const showOverlay = state !== 'idle' || overlayVisible;
  const displayTranscript = transcript || interimTranscript;

  const handleFabClick = () => {
    if (state === 'listening') {
      stopListening();
    } else if (state === 'idle') {
      setOverlayVisible(true);
      startListening();
    }
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        onClick={handleFabClick}
        className={`fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full flex items-center justify-center text-white backdrop-blur border border-white/10 transition-colors ${fabBgClass(state)}`}
        whileTap={{ scale: 0.92 }}
        style={state === 'listening' ? { animation: 'voice-pulse 1.5s ease-in-out infinite' } : {}}
        aria-label="Comando de voz"
      >
        <FabIcon state={state} />
      </motion.button>

      {/* Bottom-sheet overlay */}
      <AnimatePresence
        onExitComplete={() => {
          if (state === 'idle') setOverlayVisible(false);
        }}
      >
        {showOverlay && state !== 'idle' && (
          <motion.div
            key="voice-overlay"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:w-96 z-[35] rounded-2xl overflow-hidden"
          >
            <div className="glass border border-white/[0.08] p-4 space-y-2.5">
              {/* State label */}
              <div className="flex items-center gap-2">
                {state === 'listening' && (
                  <span className="w-2 h-2 rounded-full bg-[#00B4D8] animate-pulse" />
                )}
                {state === 'processing' && (
                  <Loader2 size={14} className="text-[#00B4D8] animate-spin" />
                )}
                {state === 'success' && (
                  <Check size={14} className="text-emerald-400" />
                )}
                {state === 'error' && (
                  <X size={14} className="text-red-400" />
                )}
                <span className="text-xs font-medium text-white/60">
                  {STATE_LABELS[state]}
                </span>
              </div>

              {/* Live transcript */}
              {displayTranscript && (
                <div className="bg-white/[0.04] rounded-lg px-3 py-2">
                  <p className="text-sm text-white/80 leading-relaxed">
                    &ldquo;{transcript || ''}{interimTranscript && (
                      <span className="text-white/40 italic">{interimTranscript}</span>
                    )}&rdquo;
                  </p>
                </div>
              )}

              {/* Parsed intent badge + title */}
              {parsedCommand && parsedCommand.intent !== 'UNKNOWN' && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-[#00B4D8]/15 text-[#00B4D8] text-[10px] font-semibold uppercase tracking-wider shrink-0">
                    {INTENT_LABELS[parsedCommand.intent] || parsedCommand.intent}
                  </span>
                  {parsedCommand.title && (
                    <span className="text-[11px] text-white/70 font-medium truncate">
                      {parsedCommand.title}
                    </span>
                  )}
                </div>
              )}

              {/* Extracted field chips */}
              {parsedCommand && <FieldChips cmd={parsedCommand} />}

              {/* Result message */}
              {resultMessage && (
                <p className={`text-xs leading-relaxed ${
                  state === 'error' ? 'text-red-400/90' : 'text-emerald-400/90'
                }`}>
                  {resultMessage}
                </p>
              )}

              {/* Hint when listening */}
              {state === 'listening' && !displayTranscript && (
                <p className="text-[10px] text-white/30 leading-relaxed">
                  Diga: &ldquo;Criar tarefa X no juridico para amanha com prioridade alta&rdquo;
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
