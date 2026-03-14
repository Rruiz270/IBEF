'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Flame } from 'lucide-react';
import { differenceInSeconds, differenceInDays, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { UrgencyLevel } from '../data/types';

interface CountdownCardProps {
  targetDate: string;
  title: string;
  subtitle?: string;
  urgency: UrgencyLevel;
  /** Total span in days (used to calculate progress bar) */
  totalDays?: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const now = new Date();
  const target = parseISO(targetDate);
  const totalSeconds = Math.max(0, differenceInSeconds(target, now));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalSeconds };
}

const urgencyConfig: Record<
  UrgencyLevel,
  { gradient: string; glow: string; icon: React.ElementType; label: string }
> = {
  low: {
    gradient: 'from-[#0A2463] to-[#0A2463]/80',
    glow: 'shadow-[#00B4D8]/10',
    icon: Clock,
    label: 'Normal',
  },
  medium: {
    gradient: 'from-[#0A2463] to-[#00B4D8]/30',
    glow: 'shadow-[#00B4D8]/20',
    icon: Clock,
    label: 'Atencao',
  },
  high: {
    gradient: 'from-[#0A2463] to-amber-900/40',
    glow: 'shadow-amber-500/20',
    icon: AlertTriangle,
    label: 'Urgente',
  },
  critical: {
    gradient: 'from-[#0A2463] to-red-900/40',
    glow: 'shadow-red-500/30',
    icon: Flame,
    label: 'Critico',
  },
};

function TimeUnit({
  value,
  label,
  critical,
}: {
  value: number;
  label: string;
  critical: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`
          w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center
          text-xl sm:text-2xl font-bold tabular-nums
          ${
            critical
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-white/10 text-white border border-white/10'
          }
        `}
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <span className="mt-1.5 text-[10px] sm:text-xs text-white/50 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function CountdownCard({
  targetDate,
  title,
  subtitle,
  urgency,
  totalDays,
}: CountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate),
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isCritical = timeLeft.days < 3 && timeLeft.totalSeconds > 0;
  const isExpired = timeLeft.totalSeconds === 0;

  const effectiveUrgency = isCritical ? 'critical' : urgency;
  const config = urgencyConfig[effectiveUrgency];
  const UrgencyIcon = config.icon;

  const progressPercent = useMemo(() => {
    if (!totalDays || totalDays <= 0) return 0;
    const daysElapsed =
      totalDays - differenceInDays(parseISO(targetDate), new Date());
    return Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
  }, [targetDate, totalDays]);

  const formattedDate = useMemo(() => {
    try {
      return format(parseISO(targetDate), "dd 'de' MMMM, yyyy", {
        locale: ptBR,
      });
    } catch {
      return targetDate;
    }
  }, [targetDate]);

  if (!mounted) {
    return (
      <div
        className={`relative rounded-2xl bg-gradient-to-br ${config.gradient} p-6 shadow-xl ${config.glow} min-h-[200px]`}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="h-8 w-full bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-xl
        bg-gradient-to-br ${config.gradient} ${config.glow}
        border border-white/5
      `}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B4D8]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00E5A0]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Critical pulse animation */}
      {isCritical && !isExpired && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-red-500/40"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-white/60 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`
          flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
          ${
            effectiveUrgency === 'critical'
              ? 'bg-red-500/20 text-red-300'
              : effectiveUrgency === 'high'
                ? 'bg-amber-500/20 text-amber-300'
                : effectiveUrgency === 'medium'
                  ? 'bg-[#00B4D8]/20 text-[#90E0EF]'
                  : 'bg-white/10 text-white/70'
          }
        `}
        >
          <UrgencyIcon size={12} />
          {config.label}
        </div>
      </div>

      {/* Countdown or Expired */}
      {isExpired ? (
        <div className="relative text-center py-4">
          <motion.p
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xl font-bold text-red-400"
          >
            Prazo Expirado
          </motion.p>
          <p className="text-sm text-white/50 mt-1">{formattedDate}</p>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <TimeUnit
              value={timeLeft.days}
              label="Dias"
              critical={isCritical}
            />
            <span className="text-white/30 text-lg font-light mt-[-20px]">
              :
            </span>
            <TimeUnit
              value={timeLeft.hours}
              label="Horas"
              critical={isCritical}
            />
            <span className="text-white/30 text-lg font-light mt-[-20px]">
              :
            </span>
            <TimeUnit
              value={timeLeft.minutes}
              label="Min"
              critical={isCritical}
            />
            <span className="text-white/30 text-lg font-light mt-[-20px]">
              :
            </span>
            <TimeUnit
              value={timeLeft.seconds}
              label="Seg"
              critical={isCritical}
            />
          </div>
        </div>
      )}

      {/* Target date */}
      <p className="relative text-center text-xs text-white/40 mt-4">
        Meta: {formattedDate}
      </p>

      {/* Progress bar */}
      {totalDays != null && totalDays > 0 && (
        <div className="relative mt-3">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                progressPercent > 80
                  ? 'bg-gradient-to-r from-red-400 to-red-500'
                  : progressPercent > 50
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                    : 'bg-gradient-to-r from-[#00B4D8] to-[#00E5A0]'
              }`}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-white/30">
              {Math.round(progressPercent)}% do tempo
            </span>
            <span className="text-[10px] text-white/30">
              {timeLeft.days}d restantes
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
