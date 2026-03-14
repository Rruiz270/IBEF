'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Target,
  Eye,
  Heart,
  BookOpen,
  Users,
  Building2,
  GraduationCap,
  ArrowRight,
  Lightbulb,
  Rocket,
  Shield,
  ChevronRight,
} from 'lucide-react';

/* ============================================
   Data
   ============================================ */

const phases = [
  {
    id: 1,
    title: 'Alinhamento e Imers\u00e3o',
    period: 'Abr \u2013 Mai 2026',
    icon: Target,
  },
  {
    id: 2,
    title: 'Prova de Conceito',
    period: 'Mai \u2013 Set 2026',
    icon: Lightbulb,
  },
  {
    id: 3,
    title: 'Piloto Controlado',
    period: 'Out 2026 \u2013 Jun 2027',
    icon: Rocket,
  },
  {
    id: 4,
    title: 'Valida\u00e7\u00e3o e Transfer\u00eancia',
    period: 'Jul 2027 \u2013 Mar 2028',
    icon: Shield,
  },
];

const teamMembers = [
  { name: 'Raphael Ruiz', role: 'L\u00edder do Projeto', initials: 'RR' },
  { name: 'Bruno Almeida', role: 'Ger\u00eancia de Tecnologia', initials: 'BA' },
  { name: 'Bruno Quick', role: 'Rela\u00e7\u00f5es P\u00fablicas', initials: 'BQ' },
  { name: 'M\u00e9rcia', role: 'Assessoria Jur\u00eddica', initials: 'ME' },
  { name: 'Emerson', role: 'Assessoria Jur\u00eddica', initials: 'EM' },
  { name: 'Gustavo', role: 'Opera\u00e7\u00f5es Locais', initials: 'GU' },
  { name: 'Enio', role: 'Administrativo/Financeiro', initials: 'EN' },
];

const partners = [
  { name: 'Jinso', description: 'Desenvolvimento de Software' },
  { name: 'Sprix', description: 'Tecnologia Educacional' },
  { name: 'MadeinWEB', description: 'Desenvolvimento Web' },
  { name: 'Gestorial', description: 'Gest\u00e3o Administrativa e Cont\u00e1bil' },
];

const valores = [
  'Inova\u00e7\u00e3o com prop\u00f3sito',
  'Transpar\u00eancia e presta\u00e7\u00e3o de contas',
  'Colabora\u00e7\u00e3o p\u00fablico-privada',
  'Compromisso com resultados mensur\u00e1veis',
  'Respeito \u00e0 diversidade regional',
];

/* ============================================
   Animations
   ============================================ */

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

/* ============================================
   Landing Page Component
   ============================================ */

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden bg-white">

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden bg-white">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#00B4D8]/[0.05] blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#0A2463]/[0.04] blur-[100px]" />
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(#0A2463 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' as const }}
        >
          {/* Logo icon */}
          <motion.div
            className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A2463] to-[#00B4D8] flex items-center justify-center shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <GraduationCap size={32} className="text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none text-[#0A2463]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            IBEF
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-4 text-lg sm:text-xl md:text-2xl text-[#0A2463]/70 font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Instituto Brasileiro pela Educa\u00e7\u00e3o do Futuro
          </motion.p>

          {/* Tagline */}
          <motion.p
            className="mt-6 text-sm sm:text-base md:text-lg text-[#64748B] max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Transformando a educa\u00e7\u00e3o p\u00fablica brasileira por meio da tecnologia,
            intelig\u00eancia artificial e inova\u00e7\u00e3o pedag\u00f3gica.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base
                         bg-[#0A2463] text-white
                         hover:bg-[#0A2463]/90 hover:shadow-lg hover:shadow-[#0A2463]/20 transition-all duration-300"
            >
              Acessar Painel de Controle
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
          >
            <ChevronRight size={24} className="rotate-90 text-[#94A3B8]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========== SOBRE N\u00d3S ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0A2463]/10 bg-[#0A2463]/5 mb-6">
              <BookOpen size={14} className="text-[#0A2463]" />
              <span className="text-xs text-[#0A2463] font-medium uppercase tracking-wider">Sobre N\u00f3s</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              Quem Somos
            </h2>
            <p className="mt-8 text-[#64748B] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
              O IBEF \u2014 Instituto Brasileiro pela Educa\u00e7\u00e3o do Futuro \u2014 \u00e9 uma organiza\u00e7\u00e3o
              dedicada a transformar a educa\u00e7\u00e3o p\u00fablica brasileira por meio da inova\u00e7\u00e3o
              tecnol\u00f3gica, intelig\u00eancia artificial e parcerias estrat\u00e9gicas com governos
              estaduais.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========== MISS\u00c3O, VIS\u00c3O E VALORES ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              {'Miss\u00e3o, Vis\u00e3o e Valores'}
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
            {...staggerContainer}
          >
            {/* Miss\u00e3o */}
            <motion.div
              {...staggerItem}
              className="relative rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md hover:border-[#00B4D8]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A2463]/5 flex items-center justify-center mb-5">
                <Target size={24} className="text-[#0A2463]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">{'Miss\u00e3o'}</h3>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                {'Desenvolver e implementar solu\u00e7\u00f5es tecnol\u00f3gicas inovadoras que personalizem o processo de aprendizagem, elevando os indicadores educacionais da rede p\u00fablica brasileira.'}
              </p>
            </motion.div>

            {/* Vis\u00e3o */}
            <motion.div
              {...staggerItem}
              className="relative rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md hover:border-[#00B4D8]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00B4D8]/10 flex items-center justify-center mb-5">
                <Eye size={24} className="text-[#00B4D8]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">{'Vis\u00e3o'}</h3>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                {'Ser refer\u00eancia nacional na aplica\u00e7\u00e3o de intelig\u00eancia artificial para educa\u00e7\u00e3o p\u00fablica, promovendo equidade e excel\u00eancia no ensino.'}
              </p>
            </motion.div>

            {/* Valores */}
            <motion.div
              {...staggerItem}
              className="relative rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md hover:border-[#00B4D8]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00E5A0]/10 flex items-center justify-center mb-5">
                <Heart size={24} className="text-[#00E5A0]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Valores</h3>
              <ul className="space-y-2">
                {valores.map((valor) => (
                  <li key={valor} className="flex items-start gap-2 text-sm sm:text-base text-[#64748B]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00E5A0] shrink-0" />
                    {valor}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== NOSSO PROJETO ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00B4D8]/15 bg-[#00B4D8]/5 mb-6">
              <Rocket size={14} className="text-[#00B4D8]" />
              <span className="text-xs text-[#00B4D8] font-medium uppercase tracking-wider">Nosso Projeto</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              {'Encomenda Tecnol\u00f3gica'}
              <br />
              <span className="text-[#00B4D8]">Santa Catarina</span>
            </h2>
            <p className="mt-6 text-[#64748B] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              {'Nosso primeiro grande projeto \u00e9 a Encomenda Tecnol\u00f3gica com o Estado de Santa Catarina, uma parceria com a Secretaria de Educa\u00e7\u00e3o para desenvolver uma plataforma educacional potencializada por IA, visando personalizar a aprendizagem em escolas p\u00fablicas catarinenses.'}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0A2463]/5 border border-[#0A2463]/10">
              <span className="text-sm font-semibold text-[#0A2463]">
                {'Investimento: R$ 4,65 milh\u00f5es'}
              </span>
              <span className="text-[#94A3B8]">|</span>
              <span className="text-sm text-[#64748B]">{'24 meses de execu\u00e7\u00e3o'}</span>
            </div>
          </motion.div>

          {/* Phase Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical connector line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00B4D8] via-[#00B4D8]/40 to-[#E2E8F0]" />

            <div className="space-y-8">
              {phases.map((phase, i) => {
                const PhaseIcon = phase.icon;
                return (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="relative pl-16 sm:pl-20"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-3 sm:left-5 top-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-[#00B4D8] flex items-center justify-center z-10 shadow-sm">
                      <PhaseIcon size={14} className="text-[#00B4D8]" />
                    </div>

                    {/* Card */}
                    <div className="rounded-xl bg-white border border-[#E2E8F0] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <span className="text-xs text-[#94A3B8] font-medium uppercase tracking-wider">
                            Fase {phase.id}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">{phase.title}</h3>
                        </div>
                        <span className="text-sm font-medium text-[#00B4D8] bg-[#00B4D8]/5 px-3 py-1 rounded-full w-fit">
                          {phase.period}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========== EQUIPE FUNDADORA ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0A2463]/10 bg-[#0A2463]/5 mb-6">
              <Users size={14} className="text-[#0A2463]" />
              <span className="text-xs text-[#0A2463] font-medium uppercase tracking-wider">{'Lideran\u00e7a'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A]">
              Equipe Fundadora
            </h2>
            <p className="mt-4 text-[#64748B] text-base sm:text-lg max-w-2xl mx-auto">
              {'Profissionais dedicados a transformar o futuro da educa\u00e7\u00e3o brasileira.'}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            {...staggerContainer}
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                {...staggerItem}
                className="group relative rounded-2xl bg-white border border-[#E2E8F0] p-6
                           hover:shadow-md hover:border-[#00B4D8]/30 transition-all duration-300
                           flex flex-col items-center text-center"
              >
                {/* Avatar */}
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#0A2463] to-[#00B4D8]
                              flex items-center justify-center mb-4 shadow-md
                              group-hover:scale-105 transition-transform duration-300"
                >
                  <span className="text-lg sm:text-xl font-bold text-white">{member.initials}</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#0F172A]">{member.name}</h3>
                <p className="mt-1 text-xs sm:text-sm text-[#64748B]">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== EMPRESAS ASSOCIADAS ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00B4D8]/15 bg-[#00B4D8]/5 mb-6">
              <Building2 size={14} className="text-[#00B4D8]" />
              <span className="text-xs text-[#00B4D8] font-medium uppercase tracking-wider">Parceiros</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A]">
              Empresas Associadas
            </h2>
            <p className="mt-4 text-[#64748B] text-base sm:text-lg max-w-2xl mx-auto">
              Empresas parceiras que contribuem com expertise e tecnologia para o sucesso do projeto.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            {...staggerContainer}
          >
            {partners.map((partner) => (
              <motion.div
                key={partner.name}
                {...staggerItem}
                className="group relative rounded-2xl bg-white border border-[#E2E8F0] p-8
                           hover:shadow-md hover:border-[#00B4D8]/30
                           transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0]
                                flex items-center justify-center mb-4 group-hover:bg-[#00B4D8]/5 group-hover:border-[#00B4D8]/20 transition-colors">
                  <Building2 size={24} className="text-[#0A2463] group-hover:text-[#00B4D8] transition-colors" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">{partner.name}</h3>
                <p className="mt-1 text-xs sm:text-sm text-[#64748B]">{partner.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="relative py-16 px-4 sm:px-6 bg-[#0A2463] text-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">IBEF</p>
              <p className="text-xs text-white/60">{'Instituto Brasileiro pela Educa\u00e7\u00e3o do Futuro'}</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[#00B4D8] hover:text-[#00E5A0] transition-colors font-medium"
          >
            Acessar Painel de Controle
            <ArrowRight size={16} />
          </Link>

          <p className="text-xs text-white/40 mt-4">
            &copy; 2026 IBEF. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
