'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import GlobalSearch from '@/components/GlobalSearch';
import TaskEditModal from '@/components/TaskEditModal';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import VoiceCommandSystem from '@/components/VoiceCommandSystem';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const [searchTaskId, setSearchTaskId] = useState<string | null>(null);

  if (isLanding) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-screen">
        {children}
      </main>
      <GlobalSearch onTaskSelect={(taskId) => setSearchTaskId(taskId)} />
      <TaskEditModal taskId={searchTaskId} onClose={() => setSearchTaskId(null)} />
      <PWAInstallPrompt />
      <VoiceCommandSystem />
    </div>
  );
}
