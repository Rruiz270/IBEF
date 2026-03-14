'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, ListTodo } from 'lucide-react';
import type { Department, Task, Person } from '../data/types';

interface DepartmentProgressProps {
  department: Department;
  /** All tasks in the system (component will filter by department) */
  tasks?: Task[];
  /** All people in the system (component will resolve lead names) */
  people?: Person[];
  index?: number;
}

function CircularProgress({
  progress,
  size = 80,
  strokeWidth = 6,
  color,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="rgba(255,255,255,0.06)"
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg font-bold text-white"
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .join('')
    .toUpperCase();
}

export default function DepartmentProgress({
  department,
  tasks = [],
  people = [],
  index = 0,
}: DepartmentProgressProps) {
  // Compute stats from tasks
  const { totalTasks, completedTasks, progress } = useMemo(() => {
    const deptTasks = tasks.filter((t) => t.departmentId === department.id);
    const total = deptTasks.length || department.taskIds.length;
    const completed = deptTasks.filter(
      (t) => t.status === 'concluida',
    ).length;
    const pct = total > 0 ? (completed / total) * 100 : 0;
    return { totalTasks: total, completedTasks: completed, progress: pct };
  }, [tasks, department]);

  // Resolve lead names
  const leadNames = useMemo(() => {
    if (people.length === 0) return department.leadIds;
    return department.leadIds.map((id) => {
      const person = people.find((p) => p.id === id);
      return person ? person.name : id;
    });
  }, [department.leadIds, people]);

  const primaryLead = leadNames[0] ?? 'TBD';
  const initials = getInitials(primaryLead);

  // Count members: people who belong to this department
  const memberCount = useMemo(() => {
    if (people.length === 0) return 0;
    return people.filter((p) => p.departmentIds.includes(department.id)).length;
  }, [people, department.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative rounded-xl bg-[#0A2463]/60 border border-white/5 p-4 sm:p-5 overflow-hidden hover:border-white/10 transition-colors"
    >
      {/* Top color accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ backgroundColor: department.color }}
      />

      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: department.color }}
      />

      <div className="relative flex items-start gap-4">
        {/* Circular progress */}
        <CircularProgress progress={progress} color={department.color} />

        <div className="flex-1 min-w-0">
          {/* Department name */}
          <h3 className="text-sm font-bold text-white truncate">
            {department.name}
          </h3>

          {/* Lead person */}
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ backgroundColor: `${department.color}40` }}
            >
              {initials}
            </div>
            <span className="text-xs text-white/50 truncate">
              {primaryLead}
            </span>
            {leadNames.length > 1 && (
              <span className="text-[10px] text-white/30">
                +{leadNames.length - 1}
              </span>
            )}
          </div>

          {/* Task stats */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1">
              <ListTodo size={12} className="text-white/30" />
              <span className="text-xs text-white/40">
                {totalTasks} tarefas
              </span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2
                size={12}
                style={{ color: department.color }}
              />
              <span
                className="text-xs"
                style={{ color: department.color }}
              >
                {completedTasks} concluidas
              </span>
            </div>
          </div>

          {/* Members count */}
          {memberCount > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Users size={12} className="text-white/20" />
              <span className="text-[10px] text-white/30">
                {memberCount} membro{memberCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar showing completion */}
      <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
            delay: index * 0.1,
          }}
          className="h-full rounded-full"
          style={{ backgroundColor: department.color }}
        />
      </div>
    </motion.div>
  );
}
