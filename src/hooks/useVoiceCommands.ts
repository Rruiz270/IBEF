'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import { parseVoiceCommand, type ParsedCommand, type VoiceIntent } from '@/lib/voiceCommandParser';
import type { TaskStatus, DepartmentId, HiringStatus } from '@/data/types';

// Explicitly reference the speech types
/// <reference path="../types/speech.d.ts" />

export type VoiceState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

export interface VoiceResult {
  state: VoiceState;
  transcript: string;
  interimTranscript: string;
  parsedCommand: ParsedCommand | null;
  resultMessage: string;
  isSupported: boolean;
}

function getSpeechRecognition(): SpeechRecognitionStatic | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useVoiceCommands(): VoiceResult & {
  startListening: () => void;
  stopListening: () => void;
} {
  const router = useRouter();
  const {
    tasks, addTask, updateTask, deleteTask, addSubtask,
    hiringPositions, addHiring, updateHiring,
  } = useProject();

  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [parsedCommand, setParsedCommand] = useState<ParsedCommand | null>(null);
  const [resultMessage, setResultMessage] = useState('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSupported = typeof window !== 'undefined' && !!getSpeechRecognition();

  // Reset state after delay
  const scheduleReset = useCallback((ms = 3000) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setState('idle');
      setTranscript('');
      setInterimTranscript('');
      setParsedCommand(null);
      setResultMessage('');
    }, ms);
  }, []);

  // Execute parsed command
  const executeCommand = useCallback(
    (cmd: ParsedCommand) => {
      try {
        switch (cmd.intent) {
          case 'CREATE_TASK': {
            const id = addTask({
              title: cmd.title || 'Nova Tarefa',
              departmentId: (cmd.departmentId || 'tecnologia') as DepartmentId,
              priority: cmd.priority || 'media',
              status: 'nao_iniciada' as TaskStatus,
            });
            return `Tarefa "${cmd.title}" criada com sucesso (${id})`;
          }

          case 'UPDATE_TASK_STATUS': {
            if (!cmd.matchedTaskId) return `Tarefa "${cmd.title}" nao encontrada`;
            if (!cmd.status) return 'Status nao reconhecido';
            updateTask(cmd.matchedTaskId, { status: cmd.status });
            const task = tasks.find((t) => t.id === cmd.matchedTaskId);
            return `Tarefa "${task?.title}" atualizada para "${cmd.status.replace('_', ' ')}"`;
          }

          case 'UPDATE_TASK_PROGRESS': {
            if (!cmd.matchedTaskId) return `Tarefa "${cmd.title}" nao encontrada`;
            if (cmd.progress === undefined) return 'Progresso nao reconhecido';
            updateTask(cmd.matchedTaskId, { progress: cmd.progress });
            const task = tasks.find((t) => t.id === cmd.matchedTaskId);
            return `Progresso de "${task?.title}" atualizado para ${cmd.progress}%`;
          }

          case 'DELETE_TASK': {
            if (!cmd.matchedTaskId) return `Tarefa "${cmd.title}" nao encontrada`;
            const task = tasks.find((t) => t.id === cmd.matchedTaskId);
            deleteTask(cmd.matchedTaskId);
            return `Tarefa "${task?.title}" excluida`;
          }

          case 'CREATE_HIRING': {
            const id = addHiring({
              title: cmd.title || 'Nova Vaga',
              departmentId: (cmd.departmentId || 'tecnologia') as DepartmentId,
              priority: cmd.priority || 'media',
              status: 'aberta',
              description: '',
            });
            return `Vaga "${cmd.title}" criada com sucesso (${id})`;
          }

          case 'UPDATE_HIRING_STATUS': {
            if (!cmd.matchedHiringId) return `Vaga "${cmd.title}" nao encontrada`;
            if (!cmd.hiringStatus) return 'Status nao reconhecido';
            updateHiring(cmd.matchedHiringId, { status: cmd.hiringStatus as HiringStatus });
            const hiring = hiringPositions.find((h) => h.id === cmd.matchedHiringId);
            return `Vaga "${hiring?.title}" atualizada para "${cmd.hiringStatus}"`;
          }

          case 'ADD_SUBTASK': {
            if (!cmd.matchedTaskId) return `Tarefa pai "${cmd.parentTitle}" nao encontrada`;
            addSubtask(cmd.matchedTaskId, cmd.title || 'Nova subtarefa');
            return `Subtarefa "${cmd.title}" adicionada`;
          }

          case 'NAVIGATE': {
            if (!cmd.route) return 'Pagina nao reconhecida';
            router.push(cmd.route);
            return `Navegando para ${cmd.route}`;
          }

          case 'QUERY': {
            return cmd.queryAnswer || 'Sem dados';
          }

          default:
            return 'Comando nao reconhecido. Tente novamente.';
        }
      } catch (err) {
        return `Erro ao executar: ${err instanceof Error ? err.message : 'desconhecido'}`;
      }
    },
    [tasks, hiringPositions, addTask, updateTask, deleteTask, addSubtask, addHiring, updateHiring, router],
  );

  const startListening = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) return;

    // Clean up previous
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    const recognition = new SR();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    setTranscript('');
    setInterimTranscript('');
    setParsedCommand(null);
    setResultMessage('');
    setState('listening');

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (final) setTranscript(final);
      setInterimTranscript(interim);
    };

    recognition.onend = () => {
      // Process the final transcript
      setState('processing');
      setTranscript((prev) => {
        const finalText = prev || interimTranscript;
        if (!finalText.trim()) {
          setState('error');
          setResultMessage('Nenhuma fala detectada');
          scheduleReset();
          return prev;
        }

        const cmd = parseVoiceCommand(finalText, tasks, hiringPositions);
        setParsedCommand(cmd);
        const msg = executeCommand(cmd);
        setResultMessage(msg);

        if (cmd.intent === 'UNKNOWN') {
          setState('error');
        } else {
          setState('success');
        }
        scheduleReset();
        return prev;
      });
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const msg = event.error === 'no-speech'
        ? 'Nenhuma fala detectada'
        : event.error === 'not-allowed'
          ? 'Microfone nao permitido'
          : `Erro: ${event.error}`;
      setResultMessage(msg);
      setState('error');
      scheduleReset();
    };

    try {
      recognition.start();
    } catch {
      setState('error');
      setResultMessage('Erro ao iniciar reconhecimento');
      scheduleReset();
    }
  }, [tasks, hiringPositions, executeCommand, scheduleReset, interimTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
      }
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return {
    state,
    transcript,
    interimTranscript,
    parsedCommand,
    resultMessage,
    isSupported,
    startListening,
    stopListening,
  };
}
