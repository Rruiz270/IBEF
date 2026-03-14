'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ListChecks,
  Network,
  UserPlus,
  MapPin,
  Scale,
  Users,
  GitMerge,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Cronograma Master', href: '/timeline', icon: GitMerge },
  { label: 'Atividades', href: '/workstreams', icon: ListChecks },
  { label: 'Organograma', href: '/organograma', icon: Network },
  { label: 'Contrata\u00e7\u00f5es & Hiring', href: '/contratacoes', icon: UserPlus },
  { label: 'Santa Catarina', href: '/santa-catarina', icon: MapPin },
  { label: 'Jur\u00eddico', href: '/juridico', icon: Scale },
  { label: 'Associados', href: '/associados', icon: Users },
];

function I10Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`transition-all duration-300 ${collapsed ? 'w-8 h-8' : 'w-10 h-10'}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Open book shape */}
      <path
        d="M24 8C24 8 18 6 10 8C10 8 8 8.5 8 11V34C8 35.5 9.5 36 10 36C18 34 24 36 24 36C24 36 30 34 38 36C38.5 36 40 35.5 40 34V11C40 8.5 38 8 38 8C30 6 24 8 24 8Z"
        stroke="#00B4D8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(0, 180, 216, 0.08)"
      />
      {/* Book spine */}
      <path
        d="M24 8V36"
        stroke="#00B4D8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Neural network nodes - left page */}
      <circle cx="14" cy="16" r="2" fill="#00E5A0" />
      <circle cx="20" cy="20" r="1.5" fill="#00E5A0" />
      <circle cx="14" cy="26" r="1.5" fill="#00E5A0" />
      <circle cx="19" cy="30" r="1.5" fill="#00B4D8" />
      {/* Neural network nodes - right page */}
      <circle cx="34" cy="16" r="2" fill="#00E5A0" />
      <circle cx="28" cy="20" r="1.5" fill="#00E5A0" />
      <circle cx="34" cy="26" r="1.5" fill="#00E5A0" />
      <circle cx="29" cy="30" r="1.5" fill="#00B4D8" />
      {/* Connection lines - left */}
      <line x1="14" y1="16" x2="20" y2="20" stroke="#00E5A0" strokeWidth="0.7" opacity="0.6" />
      <line x1="20" y1="20" x2="14" y2="26" stroke="#00E5A0" strokeWidth="0.7" opacity="0.6" />
      <line x1="14" y1="26" x2="19" y2="30" stroke="#00B4D8" strokeWidth="0.7" opacity="0.6" />
      <line x1="14" y1="16" x2="14" y2="26" stroke="#00E5A0" strokeWidth="0.5" opacity="0.3" />
      {/* Connection lines - right */}
      <line x1="34" y1="16" x2="28" y2="20" stroke="#00E5A0" strokeWidth="0.7" opacity="0.6" />
      <line x1="28" y1="20" x2="34" y2="26" stroke="#00E5A0" strokeWidth="0.7" opacity="0.6" />
      <line x1="34" y1="26" x2="29" y2="30" stroke="#00B4D8" strokeWidth="0.7" opacity="0.6" />
      <line x1="34" y1="16" x2="34" y2="26" stroke="#00E5A0" strokeWidth="0.5" opacity="0.3" />
      {/* Cross connections through spine */}
      <line x1="20" y1="20" x2="28" y2="20" stroke="#00B4D8" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 2" />
      <line x1="19" y1="30" x2="29" y2="30" stroke="#00B4D8" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 2" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);
  const toggleMobile = useCallback(() => setMobileOpen((m) => !m), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo and Title */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-white/10">
        <motion.div
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <I10Logo collapsed={collapsed} />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-sm font-bold text-white leading-tight">
                i10
              </h1>
              <p className="text-xs text-[#90E0EF] leading-tight">
                Project Control
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className="block"
            >
              <motion.div
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-colors duration-200 group
                  ${active
                    ? 'bg-[#00B4D8]/15 text-[#00B4D8]'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }
                `}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active indicator bar */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#00B4D8] rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon
                  size={20}
                  className={`shrink-0 ${active ? 'text-[#00B4D8]' : 'text-white/50 group-hover:text-white/80'}`}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`text-sm font-medium overflow-hidden whitespace-nowrap ${
                        active ? 'text-[#00B4D8]' : ''
                      }`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#061742] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-white/10">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse button (desktop only) */}
      <div className="hidden lg:block px-2 py-4 border-t border-white/10">
        <button
          onClick={toggleCollapsed}
          className="flex items-center justify-center w-full py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={18} />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-2 text-xs overflow-hidden whitespace-nowrap"
              >
                Recolher
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Bottom branding */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-3 border-t border-white/10"
          >
            <p className="text-[10px] text-white/30 leading-relaxed">
              Instituto i10 &mdash; Educação<br />
              · Tecnologia · Inovação
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-[#0A2463] text-white shadow-lg"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {mobileOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-64 z-50 lg:hidden"
            style={{ background: 'linear-gradient(180deg, #0A2463 0%, #061742 100%)' }}
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden lg:flex flex-col h-screen sticky top-0 shrink-0 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0A2463 0%, #061742 100%)' }}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
