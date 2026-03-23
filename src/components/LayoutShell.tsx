'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import GlobalSearch from '@/components/GlobalSearch';
import TaskEditModal from '@/components/TaskEditModal';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import VoiceCommandSystem from '@/components/VoiceCommandSystem';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useProject } from '@/contexts/ProjectContext';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/' || pathname === '/login';
  const [searchTaskId, setSearchTaskId] = useState<string | null>(null);
  const { bootstrapped } = useProject();

  if (isLanding) {
    return <div className="min-h-screen">{children}</div>;
  }

  if (!bootstrapped) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-white/60">Carregando dados do projeto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <ErrorBoundary>
        <main className="flex-1 overflow-y-auto h-screen">
          {children}
        </main>
      </ErrorBoundary>
      <ErrorBoundary>
        <GlobalSearch onTaskSelect={(taskId) => setSearchTaskId(taskId)} />
      </ErrorBoundary>
      <TaskEditModal taskId={searchTaskId} onClose={() => setSearchTaskId(null)} />
      <PWAInstallPrompt />
      <ErrorBoundary>
        <VoiceCommandSystem />
      </ErrorBoundary>
    </div>
  );
}
