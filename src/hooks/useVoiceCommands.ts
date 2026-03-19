'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import { parseVoiceCommand, type ParsedCommand } from '@/lib/voiceCommandParser';
import type { Task, TaskStatus, DepartmentId, HiringStatus } from '@/data/types';

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

  const scheduleReset = useCallback((ms = 3500) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setState('idle');
      setTranscript('');
      setInterimTranscript('');
      setParsedCommand(null);
      setResultMessage('');
    }, ms);
  }, []);

  // Build a human-readable summary of what was filled
  function buildSummary(fields: string[]): string {
    if (fields.length === 0) return '';
    return ' | ' + fields.join(', ');
  }

  const executeCommand = useCallback(
    (cmd: ParsedCommand) => {
      try {
        switch (cmd.intent) {
          case 'CREATE_TASK': {
            const id = addTask({
              title: cmd.title || 'Nova Tarefa',
              departmentId: (cmd.departmentId || 'tecnologia') as DepartmentId,
              priority: cmd.priority || 'media',
              status: (cmd.status as TaskStatus) || 'nao_iniciada',
            });

            // Fill additional fields via updateTask
            const extras: Partial<Task> = {};
            const filled: string[] = [];

            if (cmd.dueDate) {
              extras.dueDate = cmd.dueDate;
              filled.push(`prazo: ${cmd.dueDate}`);
            }
            if (cmd.description) {
              extras.description = cmd.description;
            }
            if (cmd.notes) {
              extras.notes = cmd.notes;
            }

            // Track what was set
            if (cmd.departmentId) filled.push(`dept: ${cmd.departmentId}`);
            if (cmd.priority && cmd.priority !== 'media') filled.push(`prioridade: ${cmd.priority}`);
            if (cmd.status && cmd.status !== 'nao_iniciada') filled.push(`status: ${cmd.status.replace('_', ' ')}`);

            if (Object.keys(extras).length > 0) {
              updateTask(id, extras);
            }

            return `Tarefa "${cmd.title}" criada${buildSummary(filled)}`;
          }

          case 'UPDATE_TASK_STATUS': {
            if (!cmd.matchedTaskId) return `Tarefa "${cmd.title}" nao encontrada`;
            const task = tasks.find((t) => t.id === cmd.matchedTaskId);
            const updates: Partial<Task> = {};
            const changed: string[] = [];

            if (cmd.status) {
              updates.status = cmd.status;
              changed.push(`status → ${cmd.status.replace('_', ' ')}`);
              // Auto-set progress to 100 if completing
              if (cmd.status === 'concluida') {
                updates.progress = 100;
                updates.completedAt = new Date().toISOString().slice(0, 10);
              }
            }
            if (cmd.priority) {
              updates.priority = cmd.priority;
              changed.push(`prioridade → ${cmd.priority}`);
            }
            if (cmd.dueDate) {
              updates.dueDate = cmd.dueDate;
              changed.push(`prazo → ${cmd.dueDate}`);
            }

            if (Object.keys(updates).length === 0) {
              return 'Nenhuma alteracao detectada no comando';
            }

            updateTask(cmd.matchedTaskId, updates);
            return `"${task?.title}" atualizada: ${changed.join(', ')}`;
          }

          case 'UPDATE_TASK_PROGRESS': {
            if (!cmd.matchedTaskId) return `Tarefa "${cmd.title}" nao encontrada`;
            if (cmd.progress === undefined) return 'Progresso nao reconhecido';
            const updates: Partial<Task> = { progress: cmd.progress };
            if (cmd.progress === 100) {
              updates.status = 'concluida';
              updates.completedAt = new Date().toISOString().slice(0, 10);
            }
            updateTask(cmd.matchedTaskId, updates);
            const task = tasks.find((t) => t.id === cmd.matchedTaskId);
            return `"${task?.title}" → progresso ${cmd.progress}%`;
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
              description: cmd.description || `Criada por voz: "${cmd.raw}"`,
              ...(cmd.dueDate ? { deadlineDate: cmd.dueDate } : {}),
            });
            const filled: string[] = [];
            if (cmd.departmentId) filled.push(`dept: ${cmd.departmentId}`);
            if (cmd.dueDate) filled.push(`deadline: ${cmd.dueDate}`);
            return `Vaga "${cmd.title}" criada${buildSummary(filled)}`;
          }

          case 'UPDATE_HIRING_STATUS': {
            if (!cmd.matchedHiringId) return `Vaga "${cmd.title}" nao encontrada`;
            if (!cmd.hiringStatus) return 'Status nao reconhecido';
            updateHiring(cmd.matchedHiringId, { status: cmd.hiringStatus as HiringStatus });
            const hiring = hiringPositions.find((h) => h.id === cmd.matchedHiringId);
            return `Vaga "${hiring?.title}" → ${cmd.hiringStatus}`;
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
            return cmd.notes || 'Comando nao reconhecido. Tente: "Criar tarefa X no juridico com prioridade alta para amanha"';
        }
      } catch (err) {
        return `Erro: ${err instanceof Error ? err.message : 'desconhecido'}`;
      }
    },
    [tasks, hiringPositions, addTask, updateTask, deleteTask, addSubtask, addHiring, updateHiring, router],
  );

  // Keep a ref to always-current values for the onend callback
  const tasksRef = useRef(tasks);
  const hiringRef = useRef(hiringPositions);
  const executeRef = useRef(executeCommand);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);
  useEffect(() => { hiringRef.current = hiringPositions; }, [hiringPositions]);
  useEffect(() => { executeRef.current = executeCommand; }, [executeCommand]);

  // Store final transcript in a ref so onend can read it
  const finalTranscriptRef = useRef('');

  const startListening = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) return;

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
    finalTranscriptRef.current = '';

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
      if (final) {
        finalTranscriptRef.current = final;
        setTranscript(final);
      }
      setInterimTranscript(interim);
    };

    recognition.onend = () => {
      setState('processing');

      const finalText = finalTranscriptRef.current;
      if (!finalText.trim()) {
        setState('error');
        setResultMessage('Nenhuma fala detectada. Tente novamente.');
        scheduleReset();
        return;
      }

      setTranscript(finalText);
      const cmd = parseVoiceCommand(finalText, tasksRef.current, hiringRef.current);
      setParsedCommand(cmd);
      const msg = executeRef.current(cmd);
      setResultMessage(msg);

      if (cmd.intent === 'UNKNOWN') {
        setState('error');
      } else {
        setState('success');
      }
      scheduleReset(4000); // slightly longer to read the result
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const msg = event.error === 'no-speech'
        ? 'Nenhuma fala detectada'
        : event.error === 'not-allowed'
          ? 'Permissao de microfone negada. Verifique as configuracoes do navegador.'
          : event.error === 'audio-capture'
            ? 'Microfone nao encontrado'
            : `Erro: ${event.error}`;
      setResultMessage(msg);
      setState('error');
      scheduleReset();
    };

    try {
      recognition.start();
    } catch {
      setState('error');
      setResultMessage('Erro ao iniciar reconhecimento de voz');
      scheduleReset();
    }
  }, [scheduleReset]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
  }, []);

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
