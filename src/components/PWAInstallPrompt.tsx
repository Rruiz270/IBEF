'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, Plus } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

const DISMISS_KEY = 'i10-pwa-dismiss-ts';
const COOLDOWN_DAYS = 7;

export default function PWAInstallPrompt() {
  const { canPrompt, isInstalled, isIOS, isStandalone, promptInstall } = usePWAInstall();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed / standalone
    if (isInstalled || isStandalone) return;

    // Check 7-day cooldown
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (elapsed < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) return;
    }

    // Show if we can natively prompt OR if iOS
    if (canPrompt || isIOS) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [canPrompt, isIOS, isInstalled, isStandalone]);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  }

  async function handleInstall() {
    const accepted = await promptInstall();
    if (accepted) setVisible(false);
  }

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50"
      >
        <div className="relative rounded-xl border border-white/10 bg-[#0A2463]/95 backdrop-blur-lg shadow-2xl p-4">
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>

          {isIOS ? (
            /* iOS instructions */
            <div className="pr-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00B4D8]/20">
                  <Download size={18} className="text-[#00B4D8]" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Instalar Aplicativo
                </h3>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Para instalar o i10 no seu dispositivo:
              </p>
              <ol className="mt-2 space-y-1.5 text-xs text-white/60">
                <li className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-white/10 text-[10px] font-bold text-white/80">1</span>
                  Toque no botão <Share size={12} className="inline text-[#00B4D8]" /> Compartilhar
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-white/10 text-[10px] font-bold text-white/80">2</span>
                  Selecione <Plus size={12} className="inline text-[#00B4D8]" /> <span className="font-medium text-white/80">Adicionar à Tela de Início</span>
                </li>
              </ol>
            </div>
          ) : (
            /* Android / Desktop prompt */
            <div className="pr-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00E5A0]/20">
                  <Download size={18} className="text-[#00E5A0]" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Instalar Aplicativo
                </h3>
              </div>
              <p className="text-xs text-white/60 mb-3">
                Instale o i10 Project Control para acesso rápido e funcionamento offline.
              </p>
              <button
                onClick={handleInstall}
                className="w-full py-2 rounded-lg bg-[#00E5A0] hover:bg-[#00E5A0]/90 text-[#030B1A] text-sm font-semibold transition-colors"
              >
                Instalar agora
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
